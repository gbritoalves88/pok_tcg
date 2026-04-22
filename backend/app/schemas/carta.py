# app/schemas/carta.py
from pydantic import BaseModel
from typing import Optional

class CartaCatalogo(BaseModel):
    """Catálogo genérico de cartas (hash + dados oficiais)"""
    id: str
    nome: str
    set_id: str
    set_nome: str
    hash: str
    imagem_url: str

class CartaUsuario(BaseModel):
    """Carta do usuário (board pessoal)"""
    usuario_id: str
    carta_id: str
    hash_original: str
    imagem_original_base64: str
    condicao: Optional[str] = None
    observacao: Optional[str] = None
    data_adicao: str

class ReconhecerRequest(BaseModel):
    """Request para reconhecimento de carta"""
    imagem_base64: str

class ReconhecerResponse(BaseModel):
    """Response do reconhecimento"""
    encontrada: bool
    confianca: Optional[str] = None
    mensagem: str
    distancia: Optional[int] = None
    carta: Optional[CartaCatalogo] = None

class AdicionarCartaRequest(BaseModel):
    carta_id: str
    imagem_original_base64: str
    condicao: Optional[str] = None
    observacao: Optional[str] = None