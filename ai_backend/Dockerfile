# -------- Stage 1: Build --------
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL (important for prisma)
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build project (IMPORTANT: use build, not dev)
RUN npm run build


# -------- Stage 2: Production --------
FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]