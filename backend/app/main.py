from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import connect_to_mongo, close_mongo_connection
from app.routers import auth_router, reconhecimento_router  

app = FastAPI(
    title="Pokémon TCG API",
    description="API para catálogo de cartas Pokémon",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",           # Angular development (local)
        "http://localhost:8000",           # Backend local
        "https://pok-tcg.onrender.com",    # Frontend em produção
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(reconhecimento_router)  # ← ADICIONE ESTA LINHA!

@app.get("/")
async def root():
    return {"message": "Pokémon TCG API", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "ok"}