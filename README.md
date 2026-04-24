# 🃏 Pokémon TCG - Sistema de Catálogo com Reconhecimento de Imagens

Sistema completo para catálogo de cartas Pokémon TCG com reconhecimento de imagens usando hash perceptual. Permite aos usuários tirar fotos de suas cartas, reconhecer automaticamente e gerenciar sua coleção pessoal.

## ✨ Funcionalidades

**Backend:** Autenticação JWT (login/registro/validação), reconhecimento de cartas via hash perceptual (imagehash), catálogo completo de cartas Pokémon, coleção pessoal com controle de quantidade, API RESTful com documentação Swagger, integração com MongoDB Atlas, controle de status de usuário (ativo/inativo), recuperação de senha.

**Frontend:** Interface responsiva (mobile-first), reconhecimento de cartas via câmera/galeria, dashboard com coleção do usuário, catálogo completo de cartas disponíveis, busca/filtro em tempo real, menu inferior com navegação (Dashboard, Catálogo, Perfil), controle de quantidade (+ e -), proteção de rotas (AuthGuard), interceptor para token JWT, compressão automática de imagens.

## 🚀 Tecnologias

**Backend:** Python 3.11+, FastAPI 0.104.1, MongoDB 4.4.1, JWT 3.3.0, ImageHash 4.3.1, Pillow 10.4.0, Pydantic 2.5.0, OpenCV 4.10.0

**Frontend:** Angular 18+, TypeScript 5.0+, RxJS 7.0+, HTML5/CSS3

**Infraestrutura:** Render (hospedagem), MongoDB Atlas (banco de dados), Git (versão)

## 📋 Pré-requisitos

Python 3.11+, Node.js 18+ e Angular CLI, MongoDB Atlas (ou local), Git

## 🔧 Instalação e Configuração

Clone o repositório: `git clone https://github.com/gbritoalves88/pok_tcg.git`

**Backend:** `cd backend`, `python -m venv venv`, `venv\Scripts\activate` (Windows) ou `source venv/bin/activate` (Linux/Mac), `pip install -r requirements.txt`, `cp .env.example .env` (edite com suas credenciais), `uvicorn app.main:app --reload --port 8000`

**Frontend:** `cd frontend`, `npm install`, `ng serve`, acesse `http://localhost:4200`

## 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/registrar` | Registrar usuário |
| POST | `/auth/token` | Login |
| PUT | `/auth/atualizar-status` | Atualizar status (admin) |
| PUT | `/auth/atualizar-senha` | Atualizar senha |
| GET | `/auth/buscar-usuario` | Buscar usuário |
| GET | `/auth/validar-token` | Validar token |
| POST | `/reconhecer/carta` | Reconhecer carta |
| POST | `/carta/adicionar` | Adicionar carta à coleção |
| GET | `/carta/minhas-cartas` | Listar minhas cartas |
| DELETE | `/carta/remover/{carta_id}` | Remover carta |
| GET | `/carta/catalogo` | Listar catálogo |
| GET | `/health` | Health check |

## 📦 Schemas

**AdicionarCartaRequest:** `{"carta_id": "me3-3", "condicao": "excelente", "observacao": "texto", "quantidade": 1}`

**UserCreate:** `{"email": "user@email.com", "nome": "Nome", "senha": "123456"}`

**UserLogin:** `{"email": "user@email.com", "senha": "123456"}`

**Token:** `{"access_token": "eyJ...", "token_type": "bearer"}`

## 🎯 Exemplos de Uso

```bash
# Registrar
curl -X POST http://localhost:8000/auth/registrar -H "Content-Type: application/json" -d '{"email":"treinador@pokemon.com","nome":"Ash","senha":"pikachu123"}'

# Login
curl -X POST http://localhost:8000/auth/token -H "Content-Type: application/json" -d '{"email":"treinador@pokemon.com","senha":"pikachu123"}'

# Adicionar carta (usando token)
curl -X POST http://localhost:8000/carta/adicionar -H "Content-Type: application/json" -H "bearer: Bearer SEU_TOKEN" -d '{"carta_id":"me3-3","condicao":"excelente","quantidade":1}'

# Listar minhas cartas
curl -X GET http://localhost:8000/carta/minhas-cartas -H "bearer: Bearer SEU_TOKEN"


pok_tcg/
├── backend/
│   ├── app/
│   │   ├── core/           # database.py, security.py
│   │   ├── models/         # carta.py, user.py
│   │   ├── routers/        # auth.py, carta.py, reconhecimento.py
│   │   ├── schemas/        # carta.py, user.py
│   │   ├── services/       # auth_service.py, carta_service.py, recognition_service.py
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/app/
    │   ├── components/     # dashboard, login, catalogo, perfil, bottom-nav
    │   ├── guards/         # auth.guard.ts
    │   ├── interceptors/   # auth.interceptor.fn.ts
    │   ├── models/         # carta.model.ts
    │   ├── services/       # api.service.ts, auth.service.ts, carta.service.ts
    │   └── app.routes.ts
    ├── angular.json
    └── package.json

fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
pymongo==4.4.1
email-validator==2.0.0
bcrypt==3.2.0
pillow==10.4.0
imagehash==4.3.1
requests==2.32.3
opencv-python-headless==4.10.0.84

Gabriel Brito - GitHub

