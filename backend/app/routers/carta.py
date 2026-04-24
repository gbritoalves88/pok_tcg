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
    """Remove uma carta ou decrementa quantidade da coleção"""
    service = CartaService()
    return service.remover_carta(carta_id=carta_id, bearer=bearer)

# app/routers/carta.py
@router.get("/catalogo")
async def listar_catalogo(bearer: str = Header(...)):
    """Lista todas as cartas do catálogo"""
    service = CartaService()
    return service.buscar_catalogo(bearer=bearer)