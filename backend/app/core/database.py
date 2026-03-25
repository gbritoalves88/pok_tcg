from pymongo import MongoClient
from app.config import settings

class Database:
    client: MongoClient = None
    db = None

db = Database()

def connect_to_mongo():
    db.client = MongoClient(settings.mongodb_url)
    db.db = db.client[settings.database_name]
    print(f"✅ Conectado ao MongoDB: {settings.database_name}")

def close_mongo_connection():
    if db.client:
        db.client.close()
        print("❌ Conexão MongoDB fechada")

def get_database():
    return db.db