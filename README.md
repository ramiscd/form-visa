# Form Visa

Sistema web para coleta, acompanhamento e processamento de formulários de visto, com foco em um fluxo semelhante ao DS-160, integração com autenticação JWT, upload de documentos, etapas condicionais de formulário, área administrativa e webhook de pagamento via Asaas.

## Visão geral

Este projeto é dividido em dois aplicativos dentro de um monorepo:

* `back/`: API em Ruby on Rails 7.1
* `front/`: frontend em Next.js

A ideia central é permitir que um cliente:

1. Crie uma conta ou entre no sistema
2. Acesse o formulário do visto
3. Preencha perguntas por etapas
4. Envie documentos obrigatórios
5. Tenha o progresso acompanhado pela aplicação
6. Receba um e-mail automático quando um pagamento for confirmado na Asaas

O sistema também prevê um fluxo administrativo para consulta das aplicações enviadas.

## Estrutura do repositório

```text
form-visa/
├── back/
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/
│   │   ├── models/
│   │   ├── mailers/
│   │   └── jobs/
│   ├── config/
│   ├── db/
│   │   ├── migrate/
│   │   └── seeds.rb
│   ├── storage/
│   ├── public/
│   ├── Gemfile
│   └── Dockerfile
├── front/
│   ├── app/
│   │   ├── (client)/
│   │   ├── (admin)/
│   │   ├── login/
│   │   └── set-password/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── public/
│   └── package.json
└── README.md
```

## Arquitetura geral

### Backend

O backend é uma API Rails com:

* autenticação por JWT
* modelos para usuários, formulários, seções, perguntas, respostas, aplicações e documentos
* upload de documentos com Active Storage
* endpoints para o cliente e para o admin
* webhook para receber eventos da Asaas
* envio de e-mails por Action Mailer

### Frontend

O frontend é um app Next.js com:

* página de login
* página de cadastro
* dashboard do cliente
* fluxo de formulário em etapas
* tela de upload de documentos
* área administrativa para consulta de aplicações
* camada de serviços para comunicação com a API
* hooks de consulta e mutação, possivelmente com React Query

## Fluxo funcional do sistema

### 1. Cadastro e login

O usuário entra pelo frontend, cria conta ou faz login. O backend retorna um token JWT, que é salvo no `localStorage` pelo frontend.

### 2. Carregamento da aplicação atual

Ao entrar no sistema, o frontend chama o endpoint de aplicação atual. O backend busca ou cria a aplicação vinculada ao usuário logado.

### 3. Formulário por etapas

O formulário é estruturado em seções e perguntas. Algumas perguntas têm condições lógicas, ou seja, só aparecem dependendo da resposta anterior.

### 4. Respostas

As respostas são persistidas no backend, vinculadas a uma aplicação e a uma pergunta específica.

### 5. Documentos

O cliente envia documentos como passaporte, foto e outros anexos. O upload é feito via `multipart/form-data` e o arquivo é armazenado com Active Storage.

### 6. Pagamento e e-mail

A cobrança é criada fora da aplicação, diretamente na Asaas. Quando a Asaas envia um webhook confirmando o pagamento, o backend dispara um e-mail com o link do formulário, por exemplo o link de cadastro ou onboarding.

## Stack tecnológica

### Backend

* Ruby on Rails 7.1
* PostgreSQL
* JWT para autenticação
* Active Storage para upload de arquivos
* Action Mailer para e-mails
* Active Job para tarefas assíncronas
* Rack CORS para comunicação com o frontend

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* Sonner para notificações
* Possivelmente React Query para cache e mutations

## Domínio de dados

## Users

Representa a conta de acesso ao sistema.

Campos observados no projeto:

* `name`
* `email`
* `password_digest`
* `role`

Relações:

* `has_many :applications`

## Applications

Representa a solicitação do usuário dentro do sistema.

Campos observados:

* `user_id`
* `form_id`
* `status`

Status conhecidos:

* `in_progress`
* `completed`
* `submitted`

Relações:

* pertence a um usuário
* pertence a um formulário
* possui várias respostas
* possui vários documentos

## Forms

Representa o formulário principal do processo de visto.

Relações esperadas:

* possui várias seções

Observação importante: no estado atual do projeto, o model `Form` pode não possuir coluna `description`. Se essa coluna não existir, o seed e a UI devem evitar esse atributo ou a migration precisa ser criada.

## Sections

Representa as etapas do formulário.

Exemplos de seções usadas no seed:

* Dados Pessoais
* Informações da Viagem
* Acompanhantes de Viagem
* Informações Familiares
* Atuação Profissional/Educação
* Informações Adicionais
* Segurança e Antecedentes

Cada seção possui várias perguntas.

## Questions

Representa as perguntas do formulário.

Campos observados no seed e no frontend:

* `label`
* `field_type`
* `required`
* `position`
* `placeholder`
* `condition`

Tipos de campo usados:

* `text`
* `date`
* `boolean`
* `select`
* `textarea`

## Answers

Representa a resposta de uma pergunta em uma aplicação específica.

Relações:

* pertence a uma aplicação
* pertence a uma pergunta

## Documents

Representa os documentos enviados pelo cliente.

Campos observados:

* `application_id`
* `doc_type`
* `file_name`
* `file_url`
* `status`

Também existe suporte para Active Storage com `has_one_attached :file`.

Status usados:

* `pending`
* `approved`
* `rejected`

## Autenticação

A autenticação é feita com JWT.

### Login

O endpoint recebe email e senha, valida com `has_secure_password` e retorna:

* token JWT
* dados do usuário

### Cadastro

O endpoint de registro cria o usuário, define role padrão como `client` e também retorna token JWT.

### Armazenamento do token

O frontend salva o token no `localStorage`.

## Upload de documentos

O fluxo de upload foi desenhado para funcionar com Active Storage.

### Desenvolvimento

No desenvolvimento, o serviço padrão pode ser `local`, salvando arquivos na pasta `storage/`.

### Produção

Na produção, o ideal é trocar para um serviço persistente como S3 ou equivalente.

### Requisição correta

Upload de arquivo deve ser enviado como `multipart/form-data`.

Isso significa:

* o arquivo não vai em JSON
* o frontend deve usar `FormData`
* o backend deve ler `params[:file]`

## Integração com Asaas

A cobrança não é gerenciada dentro da aplicação.

O fluxo esperado é:

1. O link de pagamento é criado manualmente no painel da Asaas
2. A Asaas envia um webhook quando o pagamento é confirmado
3. O backend recebe o webhook
4. O backend dispara um e-mail automático para o cliente
5. O e-mail contém o link do formulário, como `http://localhost:3000/register` em desenvolvimento

## Endpoints da API

Os endpoints observados no projeto são estes.

### Auth

* `POST /api/login`
* `POST /api/register`

### Usuário

* `GET /api/me`

### Aplicações

* `GET /api/application`
* `GET /api/applications/current`
* `GET /api/applications`
* `GET /api/applications/:id`

### Formulário

* `GET /api/form_structure`

### Respostas

* `GET /api/answers`
* `POST /api/answers`

### Documentos

* `GET /api/applications/current/documents`
* `POST /api/applications/current/documents`
* `DELETE /api/documents/:id`

### Webhook

* `POST /webhooks/asaas`

## Setup do projeto

## Pré-requisitos

* Ruby 3.2.x
* Rails 7.1.x
* Node.js compatível com o frontend
* PostgreSQL
* Yarn ou npm

## Backend

### Instalação

```bash
cd back
bundle install
```

### Banco de dados

```bash
rails db:create
rails db:migrate
rails db:seed
```

Se quiser recriar tudo do zero:

```bash
rails db:reset
```

### Servidor

```bash
rails s -p 3001
```

### Active Storage

Se ainda não estiver instalado:

```bash
bin/rails active_storage:install
rails db:migrate
```

## Frontend

### Instalação

```bash
cd front
npm install
```

### Servidor

```bash
npm run dev
```

## Variáveis de ambiente

## Backend

Sugestão de arquivo:

```env
# back/.env
FRONTEND_FORM_URL=http://localhost:3000/register
ASAAS_WEBHOOK_TOKEN=sua_chave_secreta
RAILS_MASTER_KEY=...
```

Se o projeto usar credenciais do Rails em vez de `.env`, ajuste de acordo com o setup local.

## Frontend

```env
# front/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Seeds

O seed atual tenta criar uma estrutura de formulário próxima ao DS-160, com perguntas reais e condicionais.

### Inclui

* usuários admin e cliente
* formulário principal
* seções com etapas do processo
* perguntas condicionais
* uma aplicação de exemplo
* respostas fictícias para teste

### Observações importantes sobre o seed

O seed deve ser alinhado com o schema real do banco.

No estado atual do projeto, já houve sinais de que:

* o model `Form` pode não ter `description`
* alguns atributos podem divergir do que o seed assume
* o `belongs_to :form` em `Application` está exigindo form obrigatório

Se o seed falhar, o primeiro passo é conferir as migrations e os atributos reais de cada tabela.

## Estrutura do frontend

## `app/(client)`

Área do cliente.

Páginas vistas no projeto:

* dashboard
* documentos
* formulário

## `app/(admin)`

Área administrativa.

Páginas vistas no projeto:

* listagem de aplicações
* detalhe da aplicação

## `services/`

Camada que centraliza chamadas de API.

Exemplos observados:

* `authService`
* `applicationService`

## `hooks/`

Hooks customizados para consumir a API e organizar estado assíncrono.

Exemplos observados:

* `useAuth`
* `useDocuments`
* `useUploadDocument`
* `useDeleteDocument`

## `types/`

Tipos TypeScript compartilhados entre componentes e serviços.

## Pontos de atenção já identificados no desenvolvimento

## 1. IDs numéricos no backend

O backend retorna IDs numéricos para documentos e possivelmente para outras entidades. O frontend deve refletir isso nos tipos.

## 2. Upload com FormData

Não pode ser enviado como JSON. O client deve usar `FormData`.

## 3. Application sem Form

Se o sistema tentar criar uma aplicação sem `form_id`, a validação falhará.

## 4. Campos que existem ou não existem

O seed e o backend precisam ser consistentes com os atributos reais do schema.

## 5. URLs de documentos

Durante desenvolvimento, pode funcionar com URL local. Em produção, o ideal é storage persistente.

## 6. Webhook da Asaas

O endpoint deve ser público e protegido com token de validação.

## 7. E-mails

O envio deve usar Action Mailer e idealmente `deliver_later`.

## Comportamentos esperados da aplicação

* usuário se cadastra ou entra
* aplicação atual é carregada automaticamente
* formulário é exibido em etapas
* perguntas condicionais dependem de respostas anteriores
* documentos podem ser enviados e removidos
* admin vê aplicações enviadas
* pagamento confirmado pela Asaas dispara e-mail automático

## Recomendações para evolução

### Curto prazo

* estabilizar o seed do formulário
* garantir que a aplicação atual sempre tenha form associado
* padronizar tipos do frontend com o backend
* finalizar upload real de documentos

### Médio prazo

* criar persistência segura dos documentos em produção
* melhorar regras de perguntas condicionais
* adicionar validação mais forte no formulário
* criar telas administrativas mais completas

### Longo prazo

* multi-formulários
* múltiplos fluxos de visto
* trilhas por país ou categoria de visto
* histórico de revisões de documentos
* trilha de auditoria e status de aprovação

## Troubleshooting

### `Validation failed: Form must exist`

A aplicação está sendo criada sem `form_id`. Garanta que existe pelo menos um `Form` no banco e que ele é associado à `Application`.

### `param is missing or the value is empty: file`

O frontend está enviando JSON em vez de `FormData`. Para upload, o request precisa ser `multipart/form-data`.

### `undefined method description=`

O seed ou código está tentando usar um atributo que não existe na tabela. Verifique a migration de `forms`.

### `Argument of type 'number' is not assignable to parameter of type 'string'`

Os tipos TypeScript do frontend estão desatualizados em relação ao backend. Ajuste os tipos para usar IDs numéricos quando necessário.

### `syntax error, unexpected end`

Há um bloco Ruby incompleto no seed ou em outro arquivo. Verifique `{}`, `do/end` e a ordem dos `end`.

## Ambiente local

Valores comuns durante desenvolvimento:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:3001`
* Form link usado no e-mail: `http://localhost:3000/register`

## Licença

Este projeto ainda não possui licença definida.

## Próximos passos sugeridos

* validar e finalizar as migrations
* consolidar o seed DS-160
* criar uma camada clara para fluxos de formulário por etapa
* finalizar a integração com Asaas via webhook
* trocar o storage local por um serviço de produção
