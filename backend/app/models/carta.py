# app/models/carta.py
from app.core.database import get_database
from datetime import datetime

def get_catalogo_collection():
    return get_database()["cartas_catalogo"]

def get_usuario_cartas_collection():
    return get_database()["usuarios_cartas"]

# ========== CATÁLOGO (genérico) ==========
def salvar_carta_catalogo(carta_data: dict):
    """Salva ou atualiza uma carta no catálogo"""
    return get_catalogo_collection().update_one(
        {"id": carta_data["id"]},
        {"$set": carta_data},
        upsert=True
    )

def buscar_todas_cartas_catalogo():
    """Retorna todas as cartas do catálogo"""
    return list(get_catalogo_collection().find({}))

def buscar_carta_catalogo_por_id(carta_id: str):
    """Busca uma carta no catálogo pelo ID"""
    return get_catalogo_collection().find_one({"id": carta_id})

def limpar_catalogo():
    """Limpa todo o catálogo (útil para recriar)"""
    return get_catalogo_collection().delete_many({})

# ========== CARTAS DO USUÁRIO (board) ==========




# app/models/carta.py
from app.core.database import get_database
from datetime import datetime

# app/models/carta.py
from app.core.database import get_database
from datetime import datetime

def get_usuario_cartas_collection():
    return get_database()["usuarios_cartas"]

def adicionar_carta_usuario(usuario_id: str, carta_data: dict):
    """Adiciona uma nova carta à coleção do usuário"""
    carta_data["usuario_id"] = usuario_id
    carta_data["data_adicao"] = datetime.utcnow()
    return get_usuario_cartas_collection().insert_one(carta_data)

def buscar_cartas_usuario(usuario_id: str):
    """Busca todas as cartas de um usuário"""
    return list(get_usuario_cartas_collection().find({"usuario_id": usuario_id}))

def buscar_carta_usuario_por_id_carta(usuario_id: str, carta_id: str):
    """Busca uma carta específica do usuário pelo ID da carta"""
    return get_usuario_cartas_collection().find_one({
        "usuario_id": usuario_id,
        "carta_id": carta_id
    })

def atualizar_quantidade_carta_usuario(usuario_id: str, carta_id: str, nova_quantidade: int):
    """Atualiza a quantidade de uma carta existente"""
    return get_usuario_cartas_collection().update_one(
        {"usuario_id": usuario_id, "carta_id": carta_id},
        {
            "$set": {
                "quantidade": nova_quantidade,
                "data_atualizacao": datetime.utcnow()
            }
        }
    )

def remover_carta_usuario(usuario_id: str, carta_id: str):
    """Remove uma carta da coleção do usuário"""
    return get_usuario_cartas_collection().delete_one({
        "usuario_id": usuario_id,
        "carta_id": carta_id
    })