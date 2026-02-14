# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install build tools needed for better-sqlite3
RUN apk add --no-cache python3 make g++ wget

# Create necessary directories
RUN mkdir -p /app/client/dist /app/data

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm ci --production

# Copy server source code
COPY server/ ./

# Copy built frontend from build stage
COPY --from=frontend-build /app/client/dist/ /app/client/dist/

# Environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Seed the database then start the server
CMD node db/seed.js; node server.js