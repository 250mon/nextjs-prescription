# Docker Setup for Next.js Prescription App

This document provides instructions for running the Next.js prescription app using Docker with pnpm.

## Prerequisites

- Docker
- Docker Compose
- pnpm (for local development)

## Available Docker Compose Profiles

### Development Mode
```bash
docker-compose --profile dev up
```
This will:
- Build the app in development mode
- Mount the source code as a volume for hot reloading
- Mount the uploads directory for persistent overlay storage
- Run on port 13204
- Enable file watching and automatic restarts

### Production Mode (Standalone)
```bash
docker-compose --profile prod up
```
This will:
- Build the app for production
- Run the optimized standalone build
- Mount the uploads directory for persistent overlay storage
- Run on port 13204
- Use minimal resources

### Production Mode with Nginx
```bash
docker-compose --profile prod-nginx up
```
This will:
- Build the app for production
- Mount the uploads directory for persistent overlay storage
- Run with nginx reverse proxy
- Access via port 8081 (nginx)
- Includes gzip compression and security headers

## Building and Running

### Development
```bash
# Start development server
docker-compose --profile dev up

# Build and start in detached mode
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev
```

### Production
```bash
# Start production server
docker-compose --profile prod up

# Start with nginx
docker-compose --profile prod-nginx up

# Build and start in detached mode
docker-compose --profile prod up -d
```

## Docker Commands

### Build the image
```bash
docker build -t nextjs-prescription .
```

### Run the container
```bash
# Development
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules nextjs-prescription pnpm run dev

# Production
docker run -p 3000:3000 nextjs-prescription
```

## Environment Variables

You can set environment variables in the docker-compose.yml file or create a `.env` file:

```bash
# .env file
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific profile
docker-compose --profile dev down
```

## Troubleshooting

### Clear Docker cache
```bash
docker system prune -a
```

### Rebuild without cache
```bash
docker-compose build --no-cache
```

### View container logs
```bash
docker-compose logs -f [service-name]
```

## File Structure

- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Docker Compose configuration with profiles
- `.dockerignore` - Files to exclude from Docker build context
- `nginx.conf` - Nginx configuration for production setup

## Volume Mapping

The Docker setup includes volume mapping for persistent storage:

- **Uploads Directory**: `./uploads:/app/public/uploads`
  - Maps the local `uploads` directory to the container's public uploads folder
  - Ensures overlay images persist between container restarts
  - Automatically created if it doesn't exist

### Directory Structure
```
uploads/
└── overlays/
    ├── overlay-1703123456789-abc123def.jpg
    ├── overlay-1703123456790-xyz789ghi.png
    └── ...
```

## Performance Notes

- The production build uses Next.js standalone output for optimal performance
- Nginx setup includes gzip compression and security headers
- Development mode includes volume mounting for hot reloading
- Uploads directory is excluded from git via `.gitignore`
- All builds use Alpine Linux for smaller image sizes
