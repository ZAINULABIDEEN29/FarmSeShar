# Docker Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Environment variables configured (see `.env.example`)

## Quick Start

1. **Create `.env` file** (copy from `.env.example` and fill in values):
```bash
cp .env.example .env
```

2. **Build and start all services**:
```bash
docker-compose up --build
```

3. **Access the application**:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:8000/api
   - MongoDB: localhost:27017

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose build server
docker-compose build client
```

### View logs
```bash
docker-compose logs -f
docker-compose logs -f server
docker-compose logs -f client
```

### Execute commands in container
```bash
docker-compose exec server sh
docker-compose exec client sh
```

## Multi-Stage Builds

Both `client` and `server` use multi-stage builds:

### Client Dockerfile Stages:
1. **deps**: Installs all dependencies
2. **builder**: Builds the React application
3. **runner**: Runs the preview server with production build

### Server Dockerfile Stages:
1. **deps**: Installs all dependencies
2. **builder**: Compiles TypeScript to JavaScript
3. **runner**: Runs the server with production dependencies only

## Environment Variables

Required variables (must be set in `.env`):
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

Optional variables (see `.env.example` for full list):
- Email configuration (SMTP or Resend)
- Stripe keys
- Cloudinary credentials
- Client URL

## Troubleshooting

### Network connectivity issues during build
If you encounter `ECONNRESET` or network errors during `npm ci`:
1. **Check your internet connection**
2. **Retry the build** (Dockerfiles include retry logic):
   ```bash
   docker-compose build --no-cache
   ```
3. **Use Docker build with network mode**:
   ```bash
   docker-compose build --network=host
   ```
4. **Check Docker Desktop network settings**:
   - Open Docker Desktop → Settings → Resources → Network
   - Ensure DNS is configured properly

### Port already in use
If ports 8000, 4173, or 27017 are already in use, change them in `docker-compose.yml`

### MongoDB connection issues
Ensure MongoDB container is running:
```bash
docker-compose ps
```

### Rebuild after dependency changes
```bash
docker-compose build --no-cache
docker-compose up
```

### Clear all Docker data
```bash
docker-compose down -v
docker system prune -a
```

### npm registry timeout
If npm registry is slow, you can configure a different registry in Dockerfile or use a proxy:
```dockerfile
RUN npm config set registry https://registry.npmjs.org/
```

