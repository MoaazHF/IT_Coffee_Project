FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm install

COPY tsconfig.base.json ./
COPY apps/web ./apps/web
RUN npm run build -w apps/web

EXPOSE 4173
CMD ["npm", "run", "preview", "-w", "apps/web", "--", "--host", "0.0.0.0", "--port", "4173"]
