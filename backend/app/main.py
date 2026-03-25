from fastapi import FastAPI
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routers import auth_router

app = FastAPI(
    title="Pokémon TCG API",
    description="API para catálogo de cartas Pokémon",
    version="1.0.0"
)

# Eventos de startup/shutdown
@app.on_event("startup")
async def startup():
    connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    close_mongo_connection()

# Rotas
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Pokémon TCG API", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}