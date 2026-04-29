# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to maximize Docker layer caching
COPY package.json ./
COPY yarn.lock* package-lock.json* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy application source
COPY . .

# Vite environment variables must be present at build time because they are
# inlined into the static bundle. They're passed in via docker-compose so
# they track whatever API_PORT the user has configured.
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=${VITE_API_URL} \
    VITE_WS_URL=${VITE_WS_URL}

# Build the static bundle. We pipe through grep to suppress the noisy
# "exceeding the limit" warnings from vite-plugin-pwa, but we preserve a
# non-zero exit code on real failures by checking the pipe status.
RUN set -o pipefail 2>/dev/null || true; \
    npx vite build 2>&1 | (grep -v "exceeding the limit" || true)

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
