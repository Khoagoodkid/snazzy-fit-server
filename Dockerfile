# ---- Stage 1: Build ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY prisma ./prisma
    COPY .env .env
    
    RUN echo "Checking .env file..." && cat .env
    RUN npx prisma generate --schema=./prisma/schema.prisma
    
    COPY . .
    RUN npm run build
    # ---- Stage 2: Runtime ----
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Copy only production deps
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Copy built files and Prisma schema
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma

    # ✅ Copy the generated Prisma client from builder
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/.env ./.env
    

    # Expose NestJS port
    EXPOSE 8000
    
    # Environment variable (you can override in docker-compose)
    ENV NODE_ENV=production
    
    # Start the server (no watch mode)
    CMD ["node", "dist/main.js"]
    