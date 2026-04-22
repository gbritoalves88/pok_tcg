from fastapi import APIRouter, HTTPException, Header
from app.schemas.carta import AdicionarCartaRequest
from app.services.carta_service import CartaService

router = APIRouter(prefix="/cartas", tags=["coleção"])

@router.post("/adicionar")
async def adicionar_carta(
    request: AdicionarCartaRequest,
    bearer: str = Header(...)
):
    """Adiciona uma carta reconhecida à coleção do usuário"""
    service = CartaService()
    
    # CORRETO: passe o bearer, não usuario_atual
    return service.adicionar_carta(
        carta_id=request.carta_id,
        imagem_base64=request.imagem_original_base64,
        condicao=request.condicao,
        observacao=request.observacao,
        bearer=bearer  # ← passa o token
    )

@router.get("/minhas-cartas")
async def listar_minhas_cartas(bearer: str = Header(...)):
    service = CartaService()
    return service.listar_minhas_cartas(bearer=bearer)