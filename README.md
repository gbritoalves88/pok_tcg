# 🃏 Pokémon TCG — Catálogo e Coleção de Cartas

Sistema para consulta, reconhecimento e gerenciamento de cartas Pokémon Trading Card Game (TCG).

A aplicação permite que usuários identifiquem cartas a partir de imagens, consultem um catálogo, criem suas próprias coleções e controlem a quantidade de cópias de cada carta.

O projeto é dividido em uma API REST desenvolvida com Python e FastAPI e uma aplicação frontend desenvolvida com Angular.

**Repositório:** https://github.com/gbritoalves88/pok_tcg

**Site:** https://pok-tcg.onrender.com/

**Usuario:** teste@gmail.com

**senha:** 123asd
---

## ✨ Funcionalidades

### Reconhecimento de cartas por imagem
- Captura ou seleção de imagens de cartas.
- Envio da imagem para reconhecimento pela API.
- Cálculo de hash perceptual (pHash).
- Comparação com os hashes das cartas cadastradas no catálogo.
- Identificação da melhor correspondência.
- Retorno de uma estimativa de confiança baseada na distância entre hashes.

### Catálogo de cartas
- Consulta das cartas disponíveis.
- Exibição de nome, coleção, identificador e imagem.
- Pesquisa e filtragem de cartas.
- Integração com a API pública Pokémon TCG para obtenção dos dados.

### Coleção pessoal
- Adição de cartas à coleção do usuário.
- Controle de quantidade de cópias.
- Registro da condição da carta.
- Campo para observações.
- Consulta das cartas cadastradas.
- Incremento e decremento de quantidades.
- Remoção de cartas da coleção.

### Usuários e autenticação
- Cadastro de usuários.
- Login com e-mail e senha.
- Autenticação baseada em JWT.
- Proteção de funcionalidades que exigem autenticação.
- Consulta e validação de token.
- Controle de usuários ativos e inativos.
- Funcionalidade administrativa para gerenciamento do status de usuários.
- Fluxo de atualização de senha.

### Interface
- Aplicação responsiva com abordagem mobile-first.
- Dashboard da coleção pessoal.
- Catálogo de cartas.
- Telas de login e cadastro.
- Recuperação/atualização de senha.
- Perfil do usuário.
- Navegação inferior entre as principais áreas.
- Interceptor HTTP para envio do token.
- Guard para proteção de rotas.

---

## 🏗️ Arquitetura

O projeto está organizado em dois módulos independentes:

| Módulo | Responsabilidade | Tecnologia |
|---|---|---|
| `backend` | API, autenticação, reconhecimento e persistência | Python / FastAPI |
| `frontend` | Interface e experiência do usuário | Angular / TypeScript |

O backend concentra as regras de negócio, a comunicação com o MongoDB e o processamento das imagens. O frontend consome os endpoints da API por meio de serviços Angular.

### Estrutura do projeto

```text
pok_tcg/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── popular_hashes.py
│   │   │
│   │   ├── models/
│   │   │   ├── carta.py
│   │   │   └── usuario.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── carta.py
│   │   │   └── reconhecimento.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── carta.py
│   │   │   ├── token.py
│   │   │   └── usuario.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── carta_service.py
│   │   │   └── recognition_service.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── runtime.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── bottom-nav/
│   │   │   │   ├── catalogo/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── login/
│   │   │   │   ├── perfil/
│   │   │   │   ├── registro/
│   │   │   │   └── resete/
│   │   │   │
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   │
│   │   ├── environment/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   │
│   ├── angular.json
│   └── package.json
│
├── package-lock.json
└── README.md
```

---

## 🧰 Tecnologias

### Backend

| Tecnologia | Utilização |
|---|---|
| Python 3.11 | Linguagem principal |
| FastAPI 0.104 | Framework para API REST |
| Uvicorn | Servidor ASGI |
| Pydantic 2 | Validação e estruturação de dados |
| Pydantic Settings | Configuração por variáveis de ambiente |
| PyMongo | Integração com MongoDB |
| MongoDB Atlas | Persistência de dados |
| Python-JOSE | Geração e validação de JWT |
| Passlib / Bcrypt | Hash e verificação de senhas |
| Pillow | Manipulação de imagens |
| ImageHash | Cálculo de hash perceptual |
| OpenCV | Recursos de processamento de imagens |
| Requests | Requisições HTTP externas |

### Frontend

| Tecnologia | Utilização |
|---|---|
| Angular 21 | Framework frontend |
| TypeScript 5.9 | Linguagem principal |
| RxJS 7.8 | Programação reativa |
| Angular Router | Navegação |
| Angular HTTP Client | Comunicação com a API |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização |

### Infraestrutura e serviços externos

- MongoDB Atlas — banco de dados.
- Render — hospedagem da API e aplicação.
- Pokémon TCG API — fonte externa de informações e imagens das cartas.

---

## 🧠 Como funciona o reconhecimento de cartas

O reconhecimento utiliza **hash perceptual (pHash)** para comparar visualmente a imagem enviada pelo usuário com as imagens previamente cadastradas no catálogo.

Não é um modelo de inteligência artificial baseado em embeddings: a identificação é feita por comparação de características visuais representadas por hashes.

### Fluxo de reconhecimento

1. O sistema recebe uma imagem codificada em Base64.
2. A API converte a imagem para bytes.
3. A imagem é aberta e redimensionada para 256 × 256 pixels.
4. O processamento converte a imagem para RGB, quando necessário.
5. O algoritmo pHash calcula o hash perceptual.
6. O hash calculado é comparado com os hashes armazenados no catálogo.
7. A distância de Hamming é utilizada para encontrar a correspondência mais próxima.
8. A API verifica se a distância está dentro do limite aceito.
9. O resultado retorna a carta identificada, a distância e uma classificação de confiança.

### Classificação de confiança

| Distância entre hashes | Classificação |
|---|---|
| Até 5 | Excelente |
| De 6 a 12 | Boa |
| De 13 a 15 | Média |
| Acima de 15 | Sem correspondência |

Essas classificações são critérios definidos pela aplicação, não probabilidades estatísticas de acerto.

---

## 🗄️ Banco de dados

O projeto utiliza MongoDB, com coleções separadas para usuários, catálogo e coleções pessoais.

| Coleção | Finalidade |
|---|---|
| `usuarios` | Dados cadastrais e autenticação |
| `cartas_catalogo` | Cartas disponíveis para consulta e reconhecimento |
| `usuarios_cartas` | Cartas pertencentes a cada usuário |

### Dados do catálogo

Cada carta cadastrada no catálogo possui informações como:

- Identificador da carta.
- Nome.
- Identificador e nome da coleção (*set*).
- Hash perceptual.
- URL da imagem.

### Coleção pessoal

Os registros individuais de cada usuário armazenam:

- Identificador do usuário.
- Identificador da carta.
- Quantidade de cópias.
- Condição da carta.
- Observações.
- Data de inclusão.

Os dados do catálogo são utilizados para complementar a exibição das cartas na coleção pessoal.

---

## 🚀 Configuração e execução

### Pré-requisitos

- Python 3.11.
- Node.js e npm.
- MongoDB local ou MongoDB Atlas.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/gbritoalves88/pok_tcg.git

cd pok_tcg
```

### 2. Configurar o backend

Entre na pasta:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual.

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` a partir do exemplo:

Windows:

```bash
copy .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Configure os valores:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=pokemon_tcg

# JWT
SECRET_KEY=SUBSTITUA_POR_UMA_CHAVE_FORTE
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Servidor
PORT=8000
```

Para utilizar o MongoDB Atlas, informe a connection string correspondente em `MONGODB_URL`.

**Importante:** substitua a chave JWT de exemplo por um segredo forte e exclusivo. Não utilize os valores de exemplo em produção e não versione o arquivo `.env`.

### 3. Executar o backend

Ainda dentro da pasta `backend`:

```bash
uvicorn app.main:app --reload --port 8000
```

A API ficará disponível em:

```text
http://localhost:8000
```

Documentação interativa:

```text
http://localhost:8000/docs
```

Documentação alternativa:

```text
http://localhost:8000/redoc
```

Health check:

```text
http://localhost:8000/health
```

### 4. Executar o frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Confira a configuração de ambiente em:

```text
src/environment/environment.ts
```

Verifique se o endereço configurado para a API corresponde ao backend em execução.

Inicie a aplicação:

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

---

## 📚 API REST

A API disponibiliza endpoints organizados por funcionalidade.

### Autenticação — `/auth`

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/registrar` | Registrar usuário |
| POST | `/auth/token` | Autenticar usuário e obter token |
| PUT | `/auth/atualizar-status` | Atualizar status de usuário (administrativo) |
| PUT | `/auth/atualizar-senha` | Atualizar senha |
| GET | `/auth/buscar-usuario` | Consultar usuário autenticado |
| GET | `/auth/validar-token` | Validar token |

### Cartas — `/carta`

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/carta/adicionar` | Adicionar carta à coleção |
| GET | `/carta/minhas-cartas` | Listar cartas do usuário |
| DELETE | `/carta/remover/{carta_id}` | Remover ou decrementar uma carta |
| GET | `/carta/catalogo` | Consultar catálogo |

### Reconhecimento — `/reconhecer`

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/reconhecer/carta` | Reconhecer carta a partir de imagem |

### Sistema

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verificar disponibilidade da API |
| GET | `/health` | Health check |

A documentação Swagger em `/docs` apresenta os contratos e parâmetros disponíveis na implementação.

### Autenticação nas requisições

Os endpoints protegidos utilizam o token JWT.

Na implementação atual, o backend recebe o token por meio de um header chamado `bearer`, com o prefixo `Bearer`:

```http
bearer: Bearer SEU_TOKEN
```

O frontend centraliza o envio desse header por meio do interceptor HTTP.

---

## 📦 Exemplos de requisições

### Cadastro

```bash
curl -X POST http://localhost:8000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "email": "treinador@pokemon.com",
    "nome": "Ash",
    "senha": "pikachu123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "treinador@pokemon.com",
    "senha": "pikachu123"
  }'
```

### Adicionar carta à coleção

```bash
curl -X POST http://localhost:8000/carta/adicionar \
  -H "Content-Type: application/json" \
  -H "bearer: Bearer SEU_TOKEN" \
  -d '{
    "carta_id": "me3-3",
    "condicao": "Near Mint",
    "observacao": "Primeira edição",
    "quantidade": 1
  }'
```

### Consultar coleção pessoal

```bash
curl -X GET http://localhost:8000/carta/minhas-cartas \
  -H "bearer: Bearer SEU_TOKEN"
```

### Reconhecer carta

O endpoint recebe a imagem no formato Base64:

```json
{
  "imagem_base64": "DATA_DA_IMAGEM_EM_BASE64"
}
```

A resposta contém o resultado da identificação, a distância entre os hashes e os dados da carta encontrada, quando houver correspondência.

---

## 🔄 Carga inicial do catálogo

O projeto possui um script para popular o catálogo de cartas:

```text
backend/app/core/popular_hashes.py
```

Esse processo:

1. Conecta ao MongoDB.
2. Consulta os três conjuntos mais recentes na Pokémon TCG API.
3. Busca as cartas de cada conjunto.
4. Obtém as imagens das cartas.
5. Calcula o pHash de cada imagem.
6. Persiste os dados no catálogo.

Para executar, a partir da pasta `backend`:

```bash
python -m app.core.popular_hashes
```

<mark>**Atenção:** o script executa uma limpeza do catálogo existente antes de importar os novos dados. Não execute em uma base com dados que precisam ser preservados sem antes avaliar o impacto e garantir um backup.</mark>

A fonte externa utilizada para consulta é:

https://pokemontcg.io/

---

## 🔐 Segurança

O projeto possui mecanismos de segurança para autenticação e controle de acesso:

- Senhas armazenadas com hash Bcrypt.
- Tokens JWT com tempo de expiração configurável.
- Validação de tokens nas operações protegidas.
- Controle de status de usuários.
- Proteção de rotas no frontend.
- Interceptor para envio do token de autenticação.
- Configuração de CORS na API.

Os mecanismos do frontend melhoram o fluxo de navegação, mas a autorização efetiva deve ser aplicada e validada no backend.

As credenciais do MongoDB e o segredo JWT devem permanecer em variáveis de ambiente, nunca em arquivos versionados.

---

## 🧪 Testes e evolução

O frontend possui configuração de testes Angular por meio do comando:

```bash
cd frontend
npm test
```

O backend possui dependências e estrutura para execução da API, mas não há uma suíte de testes automatizados documentada neste README.

---

## ☁️ Publicação

O backend pode ser hospedado em serviços compatíveis com aplicações Python e ASGI, como o Render.

Configurações essenciais para publicação:

- Versão do Python: `3.11.10`, conforme `backend/runtime.txt`.
- Instalação das dependências de `backend/requirements.txt`.
- Comando de inicialização:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

- Variáveis de ambiente configuradas no serviço de hospedagem.
- MongoDB acessível pelo ambiente de produção.
- Origem do frontend autorizada na configuração CORS.

O frontend pode ser compilado para publicação com:

```bash
cd frontend
npm run build
```

A configuração de hospedagem deve apontar para os arquivos gerados pelo build Angular.

---

## 📌 Considerações

Este projeto foi desenvolvido para explorar e implementar recursos de:

- Desenvolvimento de APIs REST com Python e FastAPI.
- Aplicações SPA com Angular e TypeScript.
- Persistência de dados com MongoDB.
- Autenticação e autorização com JWT.
- Processamento e comparação de imagens com pHash.
- Integração com APIs externas.
- Organização de coleções e dados por usuário.

**Pokémon TCG** é uma marca de seus respectivos proprietários. Este projeto é independente e não possui vínculo oficial com Nintendo, The Pokémon Company ou Pokémon.

---

Desenvolvido por [Gabriel Brito](https://github.com/gbritoalves88).
