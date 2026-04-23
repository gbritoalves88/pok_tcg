# app/services/carta_service.py
from fastapi import HTTPException, status
from app.models.carta import (
    adicionar_carta_usuario,
    buscar_cartas_usuario,
    buscar_carta_catalogo_por_id,
    atualizar_quantidade_carta_usuario,
    buscar_carta_usuario_por_id_carta  
)
from app.services.auth_service import AuthService
from app.models import get_user_by_email

class CartaService:
    
    def adicionar_carta(self, carta_id: str, condicao: str = None, 
                        observacao: str = None, quantidade: int = 1, 
                        bearer: str = None):
        
        # 1. Valida o token e obtém o usuário
        auth = AuthService()
        email_usuario = auth.normalizarBearer(bearer)
        user = get_user_by_email(email_usuario)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado"
            )
        
        usuario_id = str(user["_id"])
        
        # 2. Verifica se a carta existe no catálogo
        carta_catalogo = buscar_carta_catalogo_por_id(carta_id)
        if not carta_catalogo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Carta com ID '{carta_id}' não encontrada no catálogo"
            )
        
        # 3. VERIFICA SE O USUÁRIO JÁ TEM ESTA CARTA
        carta_existente = buscar_carta_usuario_por_id_carta(usuario_id, carta_id)
        
        if carta_existente:
            # Atualiza a quantidade
            nova_quantidade = carta_existente.get("quantidade", 1) + quantidade
            
            resultado = atualizar_quantidade_carta_usuario(
                usuario_id, 
                carta_id, 
                nova_quantidade
            )
            
            return {
                "mensagem": f"Carta já existente! Quantidade atualizada para {nova_quantidade} cópias",
                "carta_id": carta_id,
                "quantidade_anterior": carta_existente.get("quantidade", 1),
                "quantidade_nova": nova_quantidade,
                "atualizado": True
            }
        
        # 4. Se não existir, cria novo registro
        carta_data = {
            "carta_id": carta_id,
            "condicao": condicao,
            "observacao": observacao,
            "quantidade": quantidade
        }
        
        result = adicionar_carta_usuario(usuario_id, carta_data)
        
        return {
            "id": str(result.inserted_id),
            "carta_id": carta_id,
            "mensagem": "Carta adicionada à coleção com sucesso!",
            "atualizado": False
        }
    
    def listar_minhas_cartas(self, bearer: str = None):
        """Lista todas as cartas do usuário com dados do catálogo"""
        
        # 1. Valida token
        auth = AuthService()
        email_usuario = auth.normalizarBearer(bearer)
        user = get_user_by_email(email_usuario)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado"
            )
        
        usuario_id = str(user["_id"])
        
        # 2. Busca cartas do usuário
        cartas_usuario = buscar_cartas_usuario(usuario_id)
        
        # 3. Enriquece com dados do catálogo (LEFT JOIN mental)
        resultado = []
        for carta in cartas_usuario:
            carta_catalogo = buscar_carta_catalogo_por_id(carta["carta_id"])
            
            if carta_catalogo:
                resultado.append({
                    "id": str(carta["_id"]),
                    "carta_id": carta["carta_id"],
                    "nome": carta_catalogo.get("nome"),
                    "set_id": carta_catalogo.get("set_id"),
                    "set_nome": carta_catalogo.get("set_nome"),
                    "imagem_url": carta_catalogo.get("imagem_url"),
                    "hash": carta_catalogo.get("hash"),
                    "condicao": carta.get("condicao"),
                    "observacao": carta.get("observacao"),
                    "quantidade": carta.get("quantidade", 1),
                    "data_adicao": carta.get("data_adicao")
                })
            else:
                # Caso a carta não exista mais no catálogo
                resultado.append({
                    "id": str(carta["_id"]),
                    "carta_id": carta["carta_id"],
                    "nome": "Carta não encontrada",
                    "imagem_url": None,
                    "condicao": carta.get("condicao"),
                    "observacao": carta.get("observacao"),
                    "quantidade": carta.get("quantidade", 1),
                    "data_adicao": carta.get("data_adicao")
                })
        
        return resultado