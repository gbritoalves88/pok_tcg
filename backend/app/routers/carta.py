# app/routers/carta.py
from fastapi import APIRouter, HTTPException, Header, status
from app.schemas.carta import AdicionarCartaRequest
from app.services.carta_service import CartaService

router = APIRouter(prefix="/carta", tags=["coleção"])

@router.post("/adicionar")
async def adicionar_carta(
    request: AdicionarCartaRequest,
    bearer: str = Header(...)
):
    """Adiciona uma carta à coleção do usuário"""
    service = CartaService()
    
    return service.adicionar_carta(
        carta_id=request.carta_id,
        condicao=request.condicao,
        observacao=request.observacao,
        quantidade=request.quantidade,
        bearer=bearer
    )

@router.get("/minhas-cartas")
async def listar_minhas_cartas(
    bearer: str = Header(...)
):
    """Lista todas as cartas do usuário com dados do catálogo"""
    service = CartaService()
    return service.listar_minhas_cartas(bearer=bearer)

@router.delete("/remover/{carta_id}")
async def remover_carta(
    carta_id: str,
    bearer: str = Header(...)
):
    """Remove uma carta da coleção do usuário"""
    from app.models.carta import remover_carta_usuario
    from app.services.auth_service import AuthService
    from app.models import get_user_by_email
    
    auth = AuthService()
    email_usuario = auth.normalizarBearer(bearer)
    user = get_user_by_email(email_usuario)
    
    if not user:
        raise HTTPException(401, "Usuário não encontrado")
    
    usuario_id = str(user["_id"])
    result = remover_carta_usuario(usuario_id, carta_id)
    
    if result.deleted_count == 0:
        raise HTTPException(404, "Carta não encontrada na coleção")
    
    return {"mensagem": "Carta removida com sucesso"}