# Next.js Prescription Overlay Tool

A Next.js application for adding overlays to prescription images and downloading them locally.

## Features

- Upload prescription images (PDF, PNG, JPG, etc.)
- Add image overlays to prescriptions
- Add text overlays with custom styling
- Download processed prescriptions
- Docker support for easy deployment

## Prerequisites

- Node.js 20+ (for local development)
- pnpm (package manager)
- Docker and Docker Compose (for containerized deployment)

## Local Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Docker Setup

This project includes Docker configuration for both development and production environments.

### Available Docker Compose Profiles

#### Development Mode

```bash
docker-compose --profile dev up
```

This will:
- Build the app in development mode
- Mount the source code as a volume for hot reloading
- Mount the uploads directory for persistent overlay storage
- Run on port 13204
- Enable file watching with polling (required for hot reload in Docker)
  - `WATCHPACK_POLLING=true` - Enables polling for webpack file watching
  - `CHOKIDAR_USEPOLLING=true` - Enables polling for chokidar file watching

**Note:** File watching polling is enabled by default in Docker to ensure hot reload works correctly. You can override these values by setting environment variables.

#### Production Mode

```bash
docker-compose --profile prod up
```

This will:
- Build the app for production using Next.js standalone output
- Run the optimized standalone build
- Mount the uploads directory for persistent overlay storage
- Run on port 13204
- Use minimal resources with Alpine Linux base image

### Building and Running

#### Development

```bash
# Start development server
docker-compose --profile dev up

# Build and start in detached mode
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev

# Stop the service
docker-compose --profile dev down
```

#### Production

```bash
# Start production server
docker-compose --profile prod up

# Build and start in detached mode
docker-compose --profile prod up -d

# View logs
docker-compose logs -f app

# Stop the service
docker-compose --profile prod down
```

### Direct Docker Commands

#### Build the image

```bash
docker build -t nextjs-prescription .
```

#### Run the container

```bash
# Development
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules nextjs-prescription pnpm run dev

# Production
docker run -p 3000:3000 nextjs-prescription
```

## Environment Variables

You can set environment variables in the `docker-compose.yml` file or create a `.env` file:

```bash
# .env file
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

### Development File Watching

For Docker development, the following environment variables are set by default:
- `WATCHPACK_POLLING=true` - Enables polling for webpack file watching (required in Docker)
- `CHOKIDAR_USEPOLLING=true` - Enables polling for chokidar file watching (required in Docker)

These can be overridden by setting them in your environment or `.env` file.

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific profile
docker-compose --profile dev down
docker-compose --profile prod down
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

### Hot reload not working in Docker

If hot reload isn't working in Docker development mode, ensure that:
1. The file watching environment variables are set (`WATCHPACK_POLLING` and `CHOKIDAR_USEPOLLING`)
2. Volumes are properly mounted
3. Check the container logs for any file watching errors

## Project Structure

```
nextjs-prescription/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── overlays/       # Overlay management endpoints
│   │   └── static/         # Static file serving
│   ├── components/         # React components
│   └── lib/                # Utility functions
├── public/                 # Static assets
│   └── uploads/            # Uploaded overlays
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
└── next.config.ts          # Next.js configuration
```

## Volume Mapping

The Docker setup includes volume mapping for persistent storage:

- **Development**: `./uploads:/app/public/uploads`
  - Maps the local `uploads` directory to the container's public uploads folder
  - Ensures overlay images persist between container restarts
  - Automatically created if it doesn't exist

- **Production**: `uploads_data:/app/public/uploads`
  - Uses a named Docker volume for persistent storage
  - Data persists even if the container is removed

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
- Development mode includes volume mounting for hot reloading
- Uploads directory is excluded from git via `.gitignore`
- All builds use Alpine Linux for smaller image sizes
- Multi-stage Docker builds minimize final image size

## API Endpoints

- `POST /api/overlays/upload` - Upload a new overlay image
- `GET /api/overlays/list` - List all uploaded overlays
- `DELETE /api/overlays/delete` - Delete an overlay
- `GET /api/static/[...path]` - Serve static files from uploads directory

## License

Private project
