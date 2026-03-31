from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "pokemon_tcg"
    
    # JWT
    secret_key: str = "your-secret-key-change-this"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Server
    port: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Mascara a senha na URL
        masked_url = self.mongodb_url
        if "@" in masked_url:
            # Remove a parte da senha: user:pass@ → user:****@
            import re
            masked_url = re.sub(r':[^@]+@', ':****@', masked_url)
        
        print("=" * 60)
        print("🔧 VARIÁVEIS DE AMBIENTE CARREGADAS:")
        print(f"MONGODB_URL: {masked_url}")
        print(f"DATABASE_NAME: {self.database_name}")
        print(f"SECRET_KEY: {self.secret_key[:20]}...")
        print("=" * 60)

settings = Settings()