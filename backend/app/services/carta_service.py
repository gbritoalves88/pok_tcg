from fastapi import HTTPException
from app.models.carta import adicionar_carta_usuario, buscar_cartas_usuario, buscar_carta_catalogo_por_id 
from app.services.auth_service import AuthService
from app.models import get_user_by_email
from app.utils.serializer import serialize_docs

class CartaService:
    
    def adicionar_carta(self, carta_id: str, imagem_base64: str, condicao: str = None, observacao: str = None, bearer: str= None):
        
        auth = AuthService()
        email_usuario = auth.normalizarBearer(bearer)
        # 1. Busca o usuario
        user = get_user_by_email(email_usuario)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="usuario não encontrado"
            )
        
        
        usuario_id = str(user["_id"])
        
        # Verifica se a carta existe no catálogo
        carta_catalogo = buscar_carta_catalogo_por_id(carta_id)
        if not carta_catalogo:
            raise HTTPException(404, "Carta não encontrada no catálogo")
        
        # Prepara os dados
        carta_data = {
            "carta_id": carta_id,
            "imagem_original_base64": imagem_base64,
            "condicao": condicao,
            "observacao": observacao
        }
        
        # Salva na coleção do usuário
        result = adicionar_carta_usuario(usuario_id, carta_data)
        
        return {
            "id": str(result.inserted_id),
            "mensagem": "Carta adicionada à coleção com sucesso!"
        }
    

    def listar_minhas_cartas(self, bearer: str = None):
        auth = AuthService()
        email_usuario = auth.normalizarBearer(bearer)
        user = get_user_by_email(email_usuario)
        
        if not user:
            raise HTTPException(401, "Usuário não encontrado")
        
        usuario_id = str(user["_id"])
        cartas = buscar_cartas_usuario(usuario_id)
    
        # Remove base64
        for carta in cartas:
            if "imagem_original_base64" in carta:
                del carta["imagem_original_base64"]
        
        # Converte ObjectIds para string
        return serialize_docs(cartas)