# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate || true

# Build TypeScript
RUN npm run dev


# -------- Stage 2: Production --------
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port (Render / Docker will override)
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]

 