# Multi-stage build for better optimization
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm ci --only=development

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production
LABEL org.opencontainers.image.source=https://github.com/bfritscher/poll

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 3033

# Define default command
CMD ["npm", "start"]
