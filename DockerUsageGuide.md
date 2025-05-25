# Docker Deployment Guide

This guide provides instructions for deploying the TaskFlow application using Docker and Docker Compose.

## Quick Start

1. **Clone the repository and navigate to the project root**

2. **Set up environment variables for the backend and the frontend using the .env.example files**

3. **Build and start the application**
   ```bash
   # Build and start all services
   docker compose up -d --build
   
   # Or for development with logs
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - API Documentation: http://localhost/api/docs

## Docker Commands

### Basic Operations

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend

# Restart services
docker compose restart

# Rebuild and restart
docker compose up -d --build
```

### Database Management

```bash
# Access backend container
docker compose exec backend bash

# View database location (inside container)
ls -la /app/data/

# Backup database
docker compose exec backend cp /app/data/todo.db /app/data/todo.db.backup

# Copy database to host
docker cp taskflow-backend:/app/data/todo.db ./backup/
```

### Monitoring and Debugging

```bash
# Check service status
docker compose ps

# Check resource usage
docker stats

# Inspect service configuration
docker compose config

# View service health
docker compose exec backend curl http://localhost:8000/health
docker compose exec frontend curl http://localhost/health
```

### Cleanup

```bash
# Stop and remove containers, networks
docker compose down

# Stop and remove containers, networks, volumes
docker compose down -v

# Remove unused Docker resources
docker system prune -f

# Remove all project-related images
docker compose down --rmi all
```

## Production Deployment

### Security Considerations

1. **Change default ports** if deploying on a public server
2. **Use HTTPS** with a reverse proxy like Traefik or additional Nginx
3. **Set strong API keys** and keep them secure
4. **Regular database backups**
5. **Monitor logs** for security issues

### Performance Optimization

1. **Resource Limits**: Add resource limits to compose.yml
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

2. **Database Optimization**: Consider using PostgreSQL for production
3. **Caching**: Implement Redis for session management if needed

### SSL/HTTPS Setup

For production, add SSL termination:

```yaml
# Add to compose.yml
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    # Additional SSL configuration
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tlnp | grep :80
   netstat -tlnp | grep :8000
   ```

2. **Permission issues with database**
   ```bash
   # Fix permissions
   docker compose exec backend chown -R appuser:appuser /app/data
   ```

3. **Out of disk space**
   ```bash
   # Clean up Docker resources
   docker system prune -a
   ```

4. **Network connectivity issues**
   ```bash
   # Recreate network
   docker compose down
   docker network prune
   docker compose up -d
   ```

### Health Checks

Both services include health checks:
- Backend: `curl http://localhost:8000/health`
- Frontend: `curl http://localhost/health`

### Logs Analysis

```bash
# Check application startup
docker compose logs backend | grep -i "started\|error\|warning"

# Monitor real-time logs
docker compose logs -f --tail=100

# Export logs for analysis
docker compose logs > deployment.log 2>&1
```

## Development vs Production

### Development Mode
- Use `docker compose up` (without -d) to see logs
- Mount source code as volumes for hot reloading
- Use development environment variables

### Production Mode
- Use `docker compose up -d` for daemon mode
- Implement proper logging strategy
- Set up monitoring and alerting
- Use production environment variables
- Implement backup strategies

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker compose exec backend sqlite3 /app/data/todo.db ".dump" > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker compose exec -T backend sqlite3 /app/data/todo.db < backup_20241225_120000.sql
```

### Full System Backup
```bash
# Backup volumes
docker run --rm -v taskflow_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/taskflow_backup_$(date +%Y%m%d).tar.gz /data
```

## Monitoring

Consider adding monitoring services:
- Prometheus for metrics
- Grafana for dashboards
- Loki for log aggregation

This can be added to your compose.yml as additional services.