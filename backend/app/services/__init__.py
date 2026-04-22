from .auth_service import AuthService
from .recognition_service import reconhecer_carta, calcular_hash_imagem_base64
from .carta_service import CartaService  # ← Importa a classe, não as funções

auth_service = AuthService()
carta_service = CartaService() 