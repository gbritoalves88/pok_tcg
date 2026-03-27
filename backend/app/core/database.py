from pymongo import MongoClient
from app.config import settings

class Database:
    client: MongoClient = None
    db = None

db = Database()

def connect_to_mongo():
    try:
        # Cria o cliente com opções TLS explícitas
        db.client = MongoClient(
            settings.mongodb_url,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        db.db = db.client[settings.database_name]
        print(f"✅ Conectado ao MongoDB: {settings.database_name}")
    except Exception as e:
        print(f"❌ Erro ao conectar ao MongoDB: {e}")
        raise

def close_mongo_connection():
    if db.client:
        db.client.close()
        print("❌ Conexão MongoDB fechada")

def get_database():
    return db.db