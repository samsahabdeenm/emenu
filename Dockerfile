# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# OpenSSL required by Prisma
RUN apk add --no-cache openssl

COPY server/package*.json ./
RUN npm ci

COPY server/ ./
COPY app.html ./app.html

RUN npx prisma generate
RUN npm run build

# ─── Stage 2: Production runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# OpenSSL required by Prisma at runtime
RUN apk add --no-cache openssl

RUN addgroup -S emenu && adduser -S emenu -G emenu

COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma       ./prisma
COPY --from=builder /app/app.html     ./app.html
COPY server/package*.json             ./

# Give emenu user full ownership of /app (fixes Prisma engine write error)
RUN mkdir -p uploads && chown -R emenu:emenu /app

USER emenu

EXPOSE ${PORT:-4000}

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
