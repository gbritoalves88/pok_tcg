from app.core.database import get_database

def get_collection():
    return get_database()["usuarios"]

def get_user_by_email(email: str):
    return get_collection().find_one({"email": email})

def create_user(user_data: dict):
    return get_collection().insert_one(user_data)