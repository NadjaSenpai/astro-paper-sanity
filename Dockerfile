# 依存だけキャッシュ用ステージ
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci

# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV SANITY_PROJECT_ID=bwyjt9uz
ENV SANITY_DATASET=production
ENV SANITY_API_VERSION=2025-05-03

RUN npm run build

# 最終的に Wrangler 用に dist と functions をパッケージ
FROM scratch AS export-stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/functions/api /app/functions/api