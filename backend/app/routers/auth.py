from fastapi import APIRouter, Depends, Header
from app.schemas import UserCreate, UserLogin, Token, UserResponse, UserUpdateActive, UserUpdatePassword
from app.services import auth_service
from app.models import get_user_by_email

router = APIRouter(prefix="/auth", tags=["autenticação"])

@router.post("/registrar") 
async def registrar(user: UserCreate):
    return auth_service.registrar(user)

@router.post("/token", response_model=Token)
async def token(user: UserLogin):
    return auth_service.login(user)

@router.put("/atualizar-status")
async def atualizar_status(user: UserUpdateActive, bearer: str = Header(...)):
    return auth_service.atualizarStatusUsuario(user, bearer)

@router.put("/atualizar-senha")
async def atualizar_senha(user: UserUpdatePassword):
    return auth_service.atualizarPassawordUsuario(user)

@router.get("/buscar-usuario")
async def buscar_usuario(bearer: str = Header(...)):
    return auth_service.buscarUsuario(bearer)

@router.get("/validar-token")
async def validar_token(bearer: str = Header(...)):
    """Valida se o token é válido"""
    from app.services.auth_service import AuthService
    
    try:
        auth = AuthService()
        email = auth.normalizarBearer(bearer)
        
        # Busca o usuário

        user = get_user_by_email(email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado"
            )
        
        return {
            "valido": True,
            "email": email,
            "nome": user.get("nome")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )