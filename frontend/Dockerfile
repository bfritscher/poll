# Multi-stage build for Quasar app
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine
LABEL org.opencontainers.image.source=https://github.com/bfritscher/poll
# Copy built app to nginx html directory
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
