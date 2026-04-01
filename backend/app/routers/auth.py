from fastapi import APIRouter, Depends
from app.schemas import UserCreate, UserLogin, Token, UserResponse, UserUpdateActive, UserUpdatePassword
from app.services import auth_service  # ← agora funciona!

router = APIRouter(prefix="/auth", tags=["autenticação"])

@router.post("/registrar") 
async def registrar(user: UserCreate):
    return auth_service.registrar(user)

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    return auth_service.login(user)

@router.post("/atualizar-status")
async def atualizar_status(user: UserUpdateActive):
    return auth_service.atualizarStatusUsuario(user)

@router.post("/atualizar-senha")
async def atualizar_senha(user: UserUpdatePassword):
    return auth_service.atualizarPassawordUsuario(user)