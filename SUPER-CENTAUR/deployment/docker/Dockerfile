# SUPER CENTAUR - Docker Container
# 🦄 The Ultimate Legal & Autonomous Agent System
# 💜 With love and light - As above, so below

# Use official Node.js 18 LTS image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --loglevel=error

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create necessary directories
RUN mkdir -p /app/config /app/data /app/logs /app/dist
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Copy application code
COPY --chown=nodejs:nodejs . .

# Build the application
FROM base AS builder
USER root
RUN npm run build
USER nodejs

# Production stage
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create necessary directories
RUN mkdir -p /app/config /app/data /app/logs /app/dist
RUN chown -R nodejs:nodejs /app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app .

# Expose ports
EXPOSE 3002 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002
ENV FRONTEND_PORT=3003

# Start the application
CMD ["npm", "run", "cli", "--", "start", "--port", "3002"]

# Metadata
LABEL maintainer="SUPER CENTAUR Team"
LABEL description="The Ultimate Legal & Autonomous Agent System"
LABEL version="1.0.0"