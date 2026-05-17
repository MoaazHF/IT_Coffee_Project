# Daily Grind Coffee - Production Upgrade

Production-ready full-stack monorepo for a coffee shop application.

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Payments: Stripe Checkout (test mode)
- Deployment: Docker Compose + Nginx reverse proxy
- Quality gates: ESLint, TypeScript, Vitest, Playwright, Lighthouse, npm audit

## Repository Layout
```text
apps/
  web/   React frontend (responsive UI, routing, auth/cart/checkout flows)
  api/   Express API (auth, products, cart, checkout, webhooks, orders)
infra/
  nginx/ reverse-proxy config
src/
  legacy static project preserved for migration reference
```

## API Surface (`/api/v1`)
- `GET /health`
- `GET /products`
- `GET /products/:slug`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `POST /checkout/session` (`Idempotency-Key` header required)
- `POST /webhooks/stripe`
- `GET /orders/:id`

## Environment
Copy `.env.example` to `.env` and set values.

Required for local API run:
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Optional for checkout integration:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## Local Development
1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL:
```bash
docker compose up -d postgres
```

3. Run migration and seed:
```bash
npm run db:migrate -w apps/api
npm run db:seed -w apps/api
```

4. Start backend and frontend (two terminals):
```bash
npm run dev:api
npm run dev:web
```

## Quality Commands
```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e -w apps/web
npm run lhci -w apps/web
npm audit --audit-level=high
```

## Docker Deployment
```bash
docker compose --env-file .env up -d --build
```

Services:
- `http://localhost` -> Nginx -> Web/API
- `http://localhost/api/v1/health` -> API health endpoint

## Migration Strategy Implemented
- Legacy static pages remain under `src/` for reference.
- New app routes include compatibility redirects from old `.html` paths.
- Product duplication replaced by a single product route (`/products/:slug`) driven by catalog data.
