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