from fastapi import HTTPException, status
from app.schemas import UserCreate, UserLogin
from app.models import get_user_by_email, create_user
from app.core.security import verify_password, get_password_hash, create_access_token

class AuthService:
    
    def registrar(self, user: UserCreate):
        # Verificar se já existe
        if get_user_by_email(user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já registrado"
            )
        
        # Criar usuário
        user_dict = user.dict()
        user_dict["senha"] = get_password_hash(user_dict.pop("senha"))
        user_dict["ativo"] = self.verificarAtivacaoUsuario()
        user_dict["admin"] = self.verificarPerfilUsuario()

        result = create_user(user_dict)
        
        return {
            "id": str(result.inserted_id),
            "email": user.email,
            "nome": user.nome,
            "ativo": user_dict["ativo"],  
            "admin": user_dict["admin"] 
        }
    
    def login(self, user: UserLogin):
        # Buscar usuário
        db_user = get_user_by_email(user.email)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # Verificar senha
        if not verify_password(user.senha, db_user["senha"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # Criar token
        access_token = create_access_token(data={"sub": user.email})
        
        return {"access_token": access_token, "token_type": "bearer"}

    def verificarAtivacaoUsuario(self) -> bool:
        # já adiciona false para o usuario
        return False

    def verificarPerfilUsuario(self) -> bool:
        # já adiciona false para o usuario
        return False
