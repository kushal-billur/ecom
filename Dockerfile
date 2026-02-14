cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app

# Install build tools
RUN apk add --no-cache python3 make g++

# Copy server files
COPY server/package*.json ./
RUN npm ci --production

# Copy server source
COPY server/ ./

# Create data directory
RUN mkdir -p data

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
EOF