FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install

COPY tsconfig.base.json ./
COPY apps/api ./apps/api

RUN npm run build -w apps/api

EXPOSE 4000
CMD ["npm", "run", "start", "-w", "apps/api"]
