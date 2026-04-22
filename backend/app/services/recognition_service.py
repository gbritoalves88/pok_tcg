# app/services/recognition_service.py
import imagehash
from PIL import Image
import io
import base64
from app.services.auth_service import AuthService
from app.models.carta import buscar_todas_cartas_catalogo
from app.models import get_user_by_email

def base64_para_bytes(base64_str: str) -> bytes:
    """Converte base64 para bytes"""
    if ',' in base64_str:
        base64_str = base64_str.split(',')[1]
    return base64.b64decode(base64_str)

def calcular_hash_imagem(imagem_bytes: bytes) -> imagehash.ImageHash:
    """Calcula o hash perceptual de uma imagem a partir dos bytes"""
    img = Image.open(io.BytesIO(imagem_bytes))
    img = img.resize((256, 256))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return imagehash.phash(img)

def calcular_hash_imagem_base64(imagem_base64: str) -> str:
    """Calcula o hash de uma imagem em base64 e retorna como string"""
    imagem_bytes = base64_para_bytes(imagem_base64)
    hash_obj = calcular_hash_imagem(imagem_bytes)
    return str(hash_obj)

def reconhecer_carta(imagem_base64: str, bearer: str = None, limite: int = 15) -> dict:

    auth = AuthService()
    email_usuario = auth.normalizarBearer(bearer)
    user = get_user_by_email(email_usuario)
        
    if not user:
        raise HTTPException(401, "Usuário não encontrado")

    """
    Reconhece uma carta a partir da imagem em base64.
    
    Args:
        imagem_base64: imagem em formato base64
        limite: distância máxima para considerar match
    """
    # 1. Converte base64 para bytes e calcula hash
    imagem_bytes = base64_para_bytes(imagem_base64)
    hash_consulta = calcular_hash_imagem(imagem_bytes)
    
    # 2. Busca todas as cartas do catálogo
    todas_cartas = buscar_todas_cartas_catalogo()
    
    if not todas_cartas:
        return {
            "encontrada": False,
            "mensagem": "Catálogo vazio. Execute o script de popular_hashes.py primeiro."
        }
    
    # 3. Compara com cada carta do catálogo
    melhor_carta = None
    menor_distancia = float('inf')
    
    for carta in todas_cartas:
        hash_carta = imagehash.hex_to_hash(carta["hash"])
        distancia = hash_consulta - hash_carta
        
        if distancia < menor_distancia:
            menor_distancia = distancia
            melhor_carta = carta
    
    # 4. Avalia o resultado
    if menor_distancia > limite:
        return {
            "encontrada": False,
            "mensagem": "Não foi possível identificar a carta. Tente outra foto com melhor iluminação e fundo claro."
        }
    
    # Define o nível de confiança
    if menor_distancia <= 5:
        confianca = "excelente"
        mensagem = "Carta identificada com alta confiança!"
    elif menor_distancia <= 12:
        confianca = "boa"
        mensagem = "Carta identificada com boa confiança."
    else:
        confianca = "media"
        mensagem = "Possível correspondência. Confirme se é esta carta."
    
    return {
        "encontrada": True,
        "confianca": confianca,
        "mensagem": mensagem,
        "distancia": menor_distancia,
        "carta": {
            "id": melhor_carta["id"],
            "nome": melhor_carta["nome"],
            "set_id": melhor_carta["set_id"],
            "set_nome": melhor_carta["set_nome"],
            "hash": melhor_carta["hash"],
            "imagem_url": melhor_carta["imagem_url"]
        }
    }