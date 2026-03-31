# Pokémon TCG API

API para catálogo de cartas Pokémon com autenticação JWT e integração com MongoDB Atlas.

## 🚀 Tecnologias

- **FastAPI** - Framework web Python
- **MongoDB Atlas** - Banco de dados NoSQL
- **JWT** - Autenticação
- **PyMongo** - Driver MongoDB
- **Render** - Hospedagem

## 📋 Pré-requisitos

- Python 3.11
- MongoDB Atlas (ou local)
- Git

## 🔧 Configuração

Clone o repositório: `git clone https://github.com/gbritoalves88/pok_tcg.git` e entre na pasta `cd pok_tcg/backend`. Crie e ative o ambiente virtual com `python -m venv venv` e ative com `venv\Scripts\activate` (Windows) ou `source venv/bin/activate` (Linux/Mac). Instale as dependências com `pip install -r requirements.txt`. Copie o arquivo de exemplo com `cp .env.example .env` e edite com suas credenciais: `MONGODB_URL`, `DATABASE_NAME`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` e `PORT`. Execute a aplicação com `uvicorn app.main:app --reload --port 8000`.

## 🌐 Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/registrar` | Registrar novo usuário |
| POST | `/auth/login` | Login e obtenção de token |
| GET | `/health` | Verificar saúde do serviço |
| GET | `/docs` | Documentação Swagger |

**Registrar usuário:** `POST http://localhost:8000/auth/registrar` com body `{"email": "usuario@email.com", "nome": "Treinador", "senha": "123456"}`. **Login:** `POST http://localhost:8000/auth/login` com body `{"email": "usuario@email.com", "senha": "123456"}`. Resposta: `{"access_token": "eyJhbGciOiJIUzI1NiIs...", "token_type": "bearer"}`.

## 🗄️ Estrutura do Projeto
backend/
├── app/
│ ├── core/ # Conexão com banco e segurança
│ ├── models/ # Modelos MongoDB
│ ├── routers/ # Rotas da API
│ ├── schemas/ # Schemas Pydantic
│ ├── services/ # Lógica de negócio
│ ├── config.py # Configurações
│ └── main.py # Ponto de entrada
├── requirements.txt # Dependências
├── .env.example # Exemplo de variáveis
└── README.md # Documentação

text

## 🚀 Deploy no Render

Crie uma conta em [render.com](https://render.com), conecte seu repositório GitHub e crie um **Web Service** com Root Directory `backend`, Build Command `pip install -r requirements.txt`, Start Command `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Adicione as variáveis de ambiente no painel e clique em **"Deploy"**.

## 🔒 Segurança

As senhas são armazenadas com bcrypt, autenticação via JWT, variáveis sensíveis no `.env` (não versionado) e logs com senhas mascaradas.

## 📄 Licença

MIT

## 👨‍💻 Autor

Gabriel Brito