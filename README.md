# WorldMix360 API

API Express + TypeScript + Prisma, preparada para usar PostgreSQL local ou hospedado.

## Desenvolvimento local

Requisitos: Node.js 20+ e PostgreSQL acessível.

Com Docker Desktop instalado e iniciado:

```bash
docker compose up -d
npm install
npx prisma generate
npm run db:dev
npm run dev
```

A API ficará em `http://localhost:3333` e o Studio em:

```bash
npm run db:studio
```

Se o Docker não estiver disponível, configure o `DATABASE_URL` no `.env` com a URL externa de qualquer PostgreSQL. O código não depende de Docker.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL`: URL do PostgreSQL. Em provedores externos, use a URL pública e `sslmode=require` quando exigido.
- `JWT_SECRET`: segredo forte para as sessões da API.
- `MELI_CLIENT_ID`, `MELI_CLIENT_SECRET` e `MELI_REDIRECT_URI`: credenciais OAuth do Mercado Livre.
- `WEB_URL` e `CORS_ORIGIN`: URL pública do frontend.
- `PRODUCT_SYNC_SECRET`: segredo usado no header `x-sync-token` para sincronizar produtos.

## Produção

O provedor deve executar:

```bash
npm ci
npx prisma generate
npm run db:migrate
npm run build
npm start
```

O servidor usa a variável `PORT` fornecida pelo provedor e, caso ela não exista, usa `3333`.

No Render, o arquivo `render.yaml` já define esses comandos. Em Hostinger ou outro VPS, use os mesmos comandos em um serviço Node, configure as variáveis no painel e aponte `DATABASE_URL` para o PostgreSQL hospedado.

## Endpoints principais

```text
GET  /health
GET  /mercado-livre/authorize
GET  /mercado-livre/callback
GET  /products
POST /products/sync  (header x-sync-token)
```
