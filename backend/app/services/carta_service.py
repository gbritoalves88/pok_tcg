# app/services/carta_service.py
from fastapi import HTTPException, status
from app.models.carta import (
    adicionar_carta_usuario,
    buscar_cartas_usuario,
    buscar_carta_catalogo_por_id,
    atualizar_quantidade_carta_usuario,
    buscar_carta_usuario_por_id_carta,
    remover_carta_usuario  # ← ADICIONE ESTA LINHA
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
        
        # 3. Verifica se o usuário já tem esta carta
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
        
        auth = AuthService()
        email_usuario = auth.normalizarBearer(bearer)
        user = get_user_by_email(email_usuario)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado"
            )
        
        usuario_id = str(user["_id"])
        
        # Busca cartas do usuário
        cartas_usuario = buscar_cartas_usuario(usuario_id)
        
        # Enriquece com dados do catálogo
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
        
        return resultado
    
    def remover_carta(self, carta_id: str, bearer: str = None):
        """Remove uma carta ou decrementa quantidade da coleção"""
        
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
        
        # 2. Busca a carta do usuário
        carta_existente = buscar_carta_usuario_por_id_carta(usuario_id, carta_id)
        
        if not carta_existente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carta não encontrada na coleção"
            )
        
        # 3. Obtém a quantidade atual
        quantidade_atual = carta_existente.get("quantidade", 1)
        
        # 4. Se for a última carta (quantidade = 1), remove completamente
        if quantidade_atual <= 1:
            result = remover_carta_usuario(usuario_id, carta_id)
            
            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Erro ao remover carta"
                )
            
            return {
                "mensagem": "Carta removida completamente da coleção",
                "carta_id": carta_id,
                "acao": "removida",
                "quantidade_anterior": quantidade_atual,
                "quantidade_nova": 0
            }
        
        # 5. Se tem mais de uma, apenas decrementa a quantidade
        nova_quantidade = quantidade_atual - 1
        
        resultado = atualizar_quantidade_carta_usuario(
            usuario_id, 
            carta_id, 
            nova_quantidade
        )
        
        if resultado.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao atualizar quantidade"
            )
        
        return {
            "mensagem": f"Quantidade decrementada para {nova_quantidade} cópia(s)",
            "carta_id": carta_id,
            "acao": "decrementada",
            "quantidade_anterior": quantidade_atual,
            "quantidade_nova": nova_quantidade
        }