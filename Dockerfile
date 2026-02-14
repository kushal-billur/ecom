cat > Dockerfile << 'EOF'
# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Install frontend dependencies
COPY client/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install build tools and dependencies
RUN apk add --no-cache python3 make g++

# Create necessary directories
RUN mkdir -p /app/client/dist /app/data

# Copy server files
COPY server/package*.json ./
RUN npm ci --production

# Copy server source
COPY server/ ./

# Copy built frontend from builder
COPY --from=frontend-build /app/dist/ /app/client/dist/

# Environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
EOF