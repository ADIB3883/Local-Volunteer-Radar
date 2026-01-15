# Deployment Guide

This guide explains how to deploy the Local Volunteer Radar application to a live server.

## Prerequisites

- A server with Node.js 14+ installed
- Git installed on the server
- A domain name (optional but recommended)
- SSL certificate for HTTPS (highly recommended for production)

## Deployment Options

### Option 1: Deploying Backend and Frontend on the Same Server

#### Step 1: Clone the Repository

```bash
git clone https://github.com/ADIB3883/Local-Volunteer-Radar.git
cd Local-Volunteer-Radar
```

#### Step 2: Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
JWT_SECRET=$(openssl rand -base64 32)
EOF

# Start the backend server (use PM2 for production)
npm install -g pm2
pm2 start server.js --name "volunteer-radar-backend"
pm2 save
pm2 startup
```

#### Step 3: Set Up Frontend

```bash
cd ../Local-Volunteer-Radar/Frontend

# Install dependencies
npm install

# Create .env file for production API URL
cat > .env << EOF
VITE_API_URL=http://your-server-ip:5000/api
EOF

# Build for production
npm run build

# Serve the built files (using serve or nginx)
npm install -g serve
serve -s dist -l 3000

# Or use PM2
pm2 serve dist 3000 --name "volunteer-radar-frontend"
pm2 save
```

#### Step 4: Configure Nginx (Recommended)

```nginx
# /etc/nginx/sites-available/volunteer-radar

# Backend API proxy
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /path/to/Local-Volunteer-Radar/Local-Volunteer-Radar/Frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the sites:
```bash
sudo ln -s /etc/nginx/sites-available/volunteer-radar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 5: Set Up SSL with Let's Encrypt (Recommended)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

#### Step 6: Update Frontend Environment

After setting up the domain, update the frontend .env:

```bash
cd Local-Volunteer-Radar/Frontend
cat > .env << EOF
VITE_API_URL=https://api.yourdomain.com/api
EOF

# Rebuild
npm run build
```

### Option 2: Deploying to Cloud Platforms

#### Heroku Deployment

**Backend:**

```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a your-app-name-backend
git push heroku main
```

**Frontend:**

```bash
cd Local-Volunteer-Radar/Frontend

# Update .env
cat > .env << EOF
VITE_API_URL=https://your-app-name-backend.herokuapp.com/api
EOF

# Build
npm run build

# Deploy to Netlify, Vercel, or similar
# For Netlify:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Vercel Deployment

**Frontend:**

```bash
cd Local-Volunteer-Radar/Frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow the prompts and set VITE_API_URL as an environment variable
```

**Backend:**

Deploy backend to Railway, Render, or similar Node.js hosting platforms.

#### Railway Deployment

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add backend directory as a service
5. Set environment variables:
   - `PORT` (Railway sets this automatically)
   - `JWT_SECRET` (generate a secure random string)
6. Deploy

### Option 3: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile:**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

**Frontend Dockerfile:**

```dockerfile
# Local-Volunteer-Radar/Frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./Local-Volunteer-Radar/Frontend
      args:
        VITE_API_URL: http://localhost:5000/api
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

**Deploy:**

```bash
# Create .env file
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env

# Build and run
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Backend server is running and accessible
- [ ] Frontend can communicate with backend API
- [ ] HTTPS is enabled (SSL certificate installed)
- [ ] Environment variables are set correctly
- [ ] JWT_SECRET is secure and not exposed
- [ ] Data directory has proper permissions
- [ ] Server logs are being monitored
- [ ] Automatic restarts are configured (PM2, systemd, or Docker)
- [ ] Backups are scheduled for data files
- [ ] Firewall rules are configured correctly

## Troubleshooting

### Issue: "Cannot connect to API"

**Solution:** 
- Check if backend server is running: `pm2 status` or `curl http://localhost:5000/api/health`
- Verify VITE_API_URL in frontend .env matches your backend URL
- Check CORS settings in backend if frontend and backend are on different domains

### Issue: "Authentication not working"

**Solution:**
- Verify JWT_SECRET is set in backend environment
- Check browser console for CORS errors
- Verify tokens are being sent in requests

### Issue: "Data not persisting"

**Solution:**
- Check backend/data directory exists and has write permissions
- Verify backend process has permission to write files
- Check disk space

## Security Recommendations

1. **Always use HTTPS in production**
2. **Set a strong JWT_SECRET** (minimum 32 characters, random)
3. **Keep dependencies updated**: Run `npm audit` regularly
4. **Use environment variables** for sensitive data
5. **Enable rate limiting** to prevent abuse
6. **Regular backups** of the data directory
7. **Monitor logs** for suspicious activity
8. **Use a reverse proxy** (nginx/Apache) for additional security

## Monitoring

Set up monitoring with:
- PM2 monitoring: `pm2 monit`
- Log aggregation: Use services like Loggly, Papertrail, or CloudWatch
- Uptime monitoring: Use services like UptimeRobot or Pingdom
- Error tracking: Use services like Sentry

## Backup Strategy

```bash
# Create a backup script
cat > /path/to/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/data_backup_$DATE.tar.gz /path/to/backend/data/
# Keep only last 7 days of backups
find $BACKUP_DIR -name "data_backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x /path/to/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
```

## Support

For issues or questions:
1. Check the README.md files in backend and frontend directories
2. Review server logs: `pm2 logs` or check backend/logs/
3. Open an issue on GitHub
