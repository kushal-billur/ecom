# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --production=false
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy server files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --production

# Copy server source
COPY server/ ./

# Copy frontend build
COPY --from=frontend-build /app/client/dist ../client/dist

# Create data directory for SQLite
RUN mkdir -p /app/server/data

# Seed the database
RUN node db/seed.js

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
