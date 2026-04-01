from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    nome: str = Field(..., min_length=3)
    senha: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    senha: str

class UserResponse(BaseModel):
    id: str
    email: str
    nome: str
    ativo: bool
    admin: bool

class UserUpdateActive(BaseModel):
    admin_email: str = Field(..., description="Email do administrador")
    admin_senha: str = Field(..., description="Senha do administrador")
    email: str = Field(..., description="Email do usuário")
    ativo: bool = Field(..., description="Status: true = ativo, false = inativo")

class UserUpdatePassword(BaseModel):
    email: str = Field(..., description="Email do administrador", min_length=3)
    nova_senha: str = Field(..., description="Nova senha do administrador", min_length=6)
