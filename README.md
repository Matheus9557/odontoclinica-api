# OdontoClínica API — Backend

Backend REST API desenvolvida para gerenciamento de acompanhamento odontológico, permitindo comunicação entre dentistas e pacientes, registro de avaliações clínicas, acompanhamento da escala de dor e gerenciamento de usuários.

O projeto simula uma plataforma SaaS odontológica com foco em arquitetura escalável, organização de código, testes automatizados e boas práticas de desenvolvimento backend.

---

# 🚀 Tech Stack

## Backend

- Node.js
- TypeScript
- Express.js
- REST API
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.IO
- Swagger / OpenAPI
- Jest
- Supertest
- Docker


---

# 📌 Funcionalidades

## Autenticação

- Cadastro de dentistas
- Cadastro de pacientes
- Login com JWT
- Controle de acesso por perfil:
  - Dentist
  - Patient


## Gestão de pacientes

Dentistas podem:

- Criar pacientes
- Visualizar seus pacientes cadastrados
- Atualizar dados dos pacientes
- Remover pacientes

Cada paciente pertence a apenas um dentista.


## Avaliação odontológica

Permite:

- Criar acompanhamento odontológico
- Definir período de acompanhamento
- Consultar histórico de avaliações


## Escala de dor

Pacientes podem enviar diariamente:

- Escala de dor (1-10)
- Comentários
- Imagens da região acompanhada


Dentistas podem visualizar o histórico para acompanhamento da evolução clínica.


## Comunicação em tempo real

Implementado utilizando Socket.IO para:

- Chat paciente ↔ dentista
- Comunicação bidirecional
- Eventos em tempo real


## Notificações

Sistema de notificações:

- Contagem de mensagens/eventos não lidos
- Marcação de notificações como lidas


## Upload de arquivos

Suporte para:

- Upload de imagens clínicas
- Upload de avatar dos usuários

---

# 📐 Arquitetura

O projeto segue uma arquitetura organizada por responsabilidades:

src
├── controllers # Entrada HTTP e respostas da API
├── routes # Definição dos endpoints
├── services # Regras de negócio
├── repositories # Camada de acesso aos dados
├── middlewares # Autenticação e validações
├── validators # Validações específicas
├── config # Configurações da aplicação
├── lib # Clientes externos (Prisma)
├── utils # Funções auxiliares
├── socket.ts # Comunicação Socket.IO
└── index.ts # Inicialização da aplicação




---

# 🗄️ Banco de Dados

Utiliza PostgreSQL com Prisma ORM.

Principais entidades:

- Dentist
- Patient
- Evaluation
- PainScaleEntry
- Message
- Notification


As migrations são gerenciadas pelo Prisma.


---

# 🔐 Segurança

Implementado:

- JWT Authentication
- Middleware de autenticação
- Controle de permissões por papel
- Proteção de rotas privadas


Exemplo:


Dentist
└── cria e acompanha pacientes

Patient
└── envia registros de evolução




---

# 🧪 Testes

A aplicação possui testes automatizados utilizando:

- Jest
- Supertest


Cobertura atual:

- Auth integration tests
- Dentist integration tests
- Patient integration tests
- Evaluation integration tests
- Pain Scale integration tests
- Middleware unit tests
- Service unit tests


Executar testes:

```bash
npm test


📚 Documentação da API

A API possui documentação Swagger/OpenAPI.

Após iniciar o projeto: 

npm run dev

acesse:

http://localhost:3000/api-docs


🐳 Executando localmente

Instalar dependências
npm install
Configurar ambiente

Criar arquivo:

.env

com:

DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=

Executar migrations
npx prisma migrate dev
Iniciar aplicação
npm run dev


📦 Scripts
npm run dev     # Ambiente de desenvolvimento

npm run build   # Build TypeScript

npm test        # Executa testes


📡 API Overview

Principais recursos:

/auth

/dentists

/patients

/evaluations

/pain-scale

/messages

/notifications

/upload


🧠 Conceitos aplicados

Clean Code
SOLID
REST API Design
Separation of Concerns
Domain-driven organization
API-first development
Automated testing
Event-driven communication
Database modeling

📄 License

Projeto desenvolvido para fins acadêmicos e profissionais.