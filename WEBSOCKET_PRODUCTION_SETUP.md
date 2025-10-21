# WebSocket Production Setup Guide

## Issues Fixed in Code ✅

1. **Added CORS configuration to WebSocket Gateway**
2. **Added polling fallback transport** (websocket + polling)
3. **Configured Fastify adapter for Socket.IO**

---

## Additional Production Configuration Required

### 1. Nginx/Reverse Proxy Configuration

If you're using nginx in production (highly likely), you **MUST** add WebSocket upgrade headers.

Create or update your nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Regular HTTP requests
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket connections - CRITICAL!
    location /socket.io/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Important timeouts for long-lived connections
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
}
```

**For HTTPS (Production):**

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Same location blocks as above
    location /api { ... }
    location /socket.io/ { ... }
}
```

---

### 2. Docker Network Configuration

Your current Docker setup might be blocking WebSocket connections. Update your docker-compose or docker run command:

**Option 1: Update docker run command in GitHub Actions**

```yaml
# In .github/workflows/main.yaml
- name: Run docker container
  script: |
    docker stop snazzy-fit-server-container || true
    docker rm snazzy-fit-server-container || true
    docker run -d \
      --name snazzy-fit-server-container \
      --network host \  # Add this for better networking
      -p 8000:8000 \
      snazzy-fit-server:latest
```

**Option 2: Create docker-compose.yml (Recommended)**

```yaml
version: '3.8'

services:
  app:
    image: snazzy-fit-server:latest
    container_name: snazzy-fit-server-container
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

### 3. Environment Variables for Production

Add these to your `.env.gpg` (encrypted env file):

```bash
# Production WebSocket Configuration
NODE_ENV=production
PORT=8000

# For secure cookie handling in production
COOKIE_SECRET=your-secure-secret-here

# JWT Secret
ACCESS_TOKEN_SECRET=your-jwt-secret-here

# If behind a proxy
TRUST_PROXY=true
```

---

### 4. Client-Side Connection Configuration

Update your frontend Socket.IO client configuration:

**Development:**
```javascript
const socket = io('http://localhost:8000/chat', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});
```

**Production:**
```javascript
const socket = io('https://your-domain.com/chat', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  secure: true,  // Important for HTTPS
  rejectUnauthorized: false  // Only if using self-signed certs (not recommended for production)
});
```

---

### 5. Firewall Configuration

Ensure your server firewall allows WebSocket connections:

```bash
# If using UFW
sudo ufw allow 8000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If using iptables
sudo iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

---

### 6. Cookie Configuration for HTTPS

Update your cookie setup in `src/main.ts` for production:

```typescript
await app.register(fastifyCookie as any, {
  secret: configService.get<string>('COOKIE_SECRET') || 'default_secret',
  parseOptions: {
    httpOnly: true,
    secure: configService.get<string>('NODE_ENV') === 'production', // HTTPS only in prod
    sameSite: configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
    domain: configService.get<string>('COOKIE_DOMAIN'), // e.g., '.your-domain.com'
  },
});
```

---

## Testing WebSocket Connection

### 1. Check if WebSocket endpoint is accessible:

```bash
# From your server
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: test" \
  http://localhost:8000/socket.io/
```

### 2. Check Docker logs:

```bash
docker logs -f snazzy-fit-server-container
```

Look for:
- "WebSocket server initialized"
- Connection attempts
- Any CORS errors

### 3. Browser DevTools:

Open your frontend, go to Network tab → WS (WebSocket), and check for:
- Status 101 (Switching Protocols) ✅
- Status 400/403/502 (Connection Failed) ❌

---

## Common Production Issues & Solutions

| Issue | Solution |
|-------|----------|
| **403 Forbidden** | Check CORS configuration, ensure credentials are enabled |
| **502 Bad Gateway** | Nginx not configured for WebSocket upgrades |
| **Connection timeout** | Increase proxy timeouts in nginx |
| **Cookie not sent** | Set `withCredentials: true` on client, `credentials: true` on server |
| **Mixed content error** | Use WSS (secure WebSocket) on HTTPS sites |
| **Connection works locally but not production** | Check firewall, nginx config, and Docker networking |

---

## Next Steps

1. ✅ Code changes are complete
2. ⚠️ Set up nginx reverse proxy with WebSocket support
3. ⚠️ Update environment variables for production
4. ⚠️ Configure firewall rules
5. ⚠️ Update client-side connection code
6. ⚠️ Deploy and test

---

## Verification Checklist

- [ ] Can establish WebSocket connection from browser
- [ ] Cookies are being sent with requests
- [ ] JWT authentication works
- [ ] Messages can be sent and received
- [ ] Connection persists without timeouts
- [ ] Works over HTTPS/WSS
- [ ] CORS headers present in response
- [ ] No errors in server logs

