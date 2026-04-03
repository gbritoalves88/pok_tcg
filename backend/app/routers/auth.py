from fastapi import APIRouter, Depends, Header
from app.schemas import UserCreate, UserLogin, Token, UserResponse, UserUpdateActive, UserUpdatePassword
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["autenticação"])

@router.post("/registrar") 
async def registrar(user: UserCreate):
    return auth_service.registrar(user)

@router.post("/token", response_model=Token)
async def token(user: UserLogin):
    return auth_service.login(user)

@router.post("/atualizar-status")
async def atualizar_status(user: UserUpdateActive, bearer: str = Header(...)):
    return auth_service.atualizarStatusUsuario(user, bearer)

@router.post("/atualizar-senha")
async def atualizar_senha(user: UserUpdatePassword, bearer: str = Header(...)):
    return auth_service.atualizarPassawordUsuario(user, bearer)

@router.get("/buscar-usuario")
async def buscar_usuario(bearer: str = Header(...)):
    return auth_service.buscarUsuario(bearer)