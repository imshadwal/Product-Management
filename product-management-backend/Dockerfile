# ---------- 1. Build Stage ----------
FROM node:18-bullseye AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build NestJS
RUN npm run build

# ---------- 2. Run Stage ----------
FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# Generate Prisma client at container start, then start app
CMD npx prisma generate && npm run start:prod
