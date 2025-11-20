# Multi-stage Dockerfile for ShadowMaster
# Stage 1: Frontend Build
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY web/ui/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY web/ui/ ./

# Build frontend
RUN npm run build

# Stage 2: Backend Build
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app

# Install git for version extraction (if using git tags)
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build arguments for version info
ARG VERSION=dev
ARG BUILD_TIME
ARG GIT_COMMIT

# Build the binary with version information
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo \
    -ldflags "-s -w -X main.Version=${VERSION} -X main.BuildTime=${BUILD_TIME} -X main.GitCommit=${GIT_COMMIT}" \
    -o shadowmaster-server ./cmd/shadowmaster-server

# Stage 3: Runtime
FROM alpine:latest

# Install ca-certificates and wget for health checks
RUN apk --no-cache add ca-certificates tzdata wget

# Create non-root user
RUN addgroup -g 1000 shadowmaster && \
    adduser -D -u 1000 -G shadowmaster shadowmaster

WORKDIR /app

# Copy binary from backend builder
COPY --from=backend-builder /app/shadowmaster-server .

# Copy frontend static files from frontend builder
# Vite builds to ../static relative to web/ui, which becomes /static in the container
COPY --from=frontend-builder /static ./web/static

# Create data directory with proper permissions
RUN mkdir -p /data && \
    chown -R shadowmaster:shadowmaster /data /app

# Switch to non-root user
USER shadowmaster

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the server
CMD ["./shadowmaster-server", "-port", "8080", "-data", "/data", "-web", "./web/static"]

