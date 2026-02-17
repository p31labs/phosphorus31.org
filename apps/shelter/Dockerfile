# P31 Shelter (The Buffer) — LAUNCH-06
# Communication processing layer. Node 18, SQLite + optional Redis.
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json tsconfig.server.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4000
ENV ACCOMMODATION_DB_DIR=/app/data

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost:4000/health || exit 1

USER node
CMD ["node", "dist/index.js"]
