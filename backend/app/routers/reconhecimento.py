# app/routers/reconhecimento.py
from fastapi import APIRouter, HTTPException, Header
from app.schemas.carta import ReconhecerRequest, ReconhecerResponse
from app.services.recognition_service import reconhecer_carta

router = APIRouter(prefix="/reconhecer", tags=["reconhecimento"])

@router.post("/carta", response_model=ReconhecerResponse)
async def reconhecer_carta_endpoint(request: ReconhecerRequest,
                                    bearer: str = Header(...)):
    """
    Endpoint para reconhecimento de cartas Pokémon.
    Envie uma imagem em base64 e o sistema tentará identificá-la.
    """
    # Validação básica
    if not request.imagem_base64 or len(request.imagem_base64) < 100:
        raise HTTPException(status_code=400, detail="Imagem inválida ou muito pequena")
    
    if ',' not in request.imagem_base64:
        raise HTTPException(status_code=400, detail="Formato de imagem inválido. Use data:image/...;base64,...")
    
    # Reconhece a carta
    resultado = reconhecer_carta(request.imagem_base64, bearer)
    
    return resultado