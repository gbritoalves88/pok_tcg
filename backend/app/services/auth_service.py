from fastapi import HTTPException, status
from app.schemas import UserCreate, UserLogin, UserUpdateActive
from app.models import get_user_by_email, create_user, update_user_status
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

    def atualizarStatusUsuario(self, user: UserUpdateActive):
        # 1. Busca o admin
        admin_user = get_user_by_email(user.admin_email)
        if not admin_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Administrador não encontrado"
            )
        
        # 2. Verifica senha do admin
        if not verify_password(user.admin_senha, admin_user["senha"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha do administrador incorreta"
            )

        # 3. Verifica se é admin
        if not admin_user.get("admin", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. Apenas administradores podem alterar status"
            )

        # 4. Busca o usuário a ser alterado
        target_user = get_user_by_email(user.email)
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        # 5. Atualiza o status
        result = update_user_status(user.email, user.ativo)
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao atualizar status do usuário"
            )   
            
        status_text = "ativado" if user.ativo else "desativado"
        return {"message": f"Usuário {user.email} {status_text} com sucesso"}


