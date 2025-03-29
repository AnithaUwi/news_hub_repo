
#News Hub - Scalable News Aggregation Platform

A high-performance, zero-dependency web app that:

Aggregates 100+ news sources in real-time via NewsAPI

Filters content by category/keyword with vanilla JS

Deploys across load-balanced servers (Nginx + PM2)

Demonstrates core engineering principles:

REST API integration

Horizontal scaling

Process management

#Table of Contents
- [Technical Overview]
- [Key Features]
- [System Requirements]
- [Local Development]
- [Production Deployment]
- [Demo]
- [Troubleshooting]
  

# Technical Overview
| Component           | Technology Stack                 |
|---------------------|----------------------------------|
| *Frontend*        | Vanilla JavaScript (ES6), CSS3 Grid |HTML5
| *Backend*         | Node.js 16, Express              |
| *Infrastructure* | Nginx, PM2, Ubuntu 20.04 LTS     |
| *API*             | NewsAPI (REST)                   |

# Key Features
- *Real-time News Aggregation*  
  - 100+ sources via NewsAPI
  - Client-side caching (localStorage)
- *Zero-Dependency Architecture* 
  - No frameworks (demonstrates core competency)
- *Enterprise-Grade Deployment*  
  - Load-balanced (Nginx upstream)  
  - Persistent process management (PM2)  

# System Requirements
- **Development**  
  ```bash
  Node.js >= 16.x
  npm >= 8.x
  VS Code (with Live Server extension)
  ```
- **Production**  
  ```bash
  Ubuntu 20.04+
  2GB RAM (per server)
  SSH access to web01/web02/lb01
  ```

# Local Development
# 1. Environment Setup
```bash
git clone https://github.com/myusername/news-hub-repo.git
cd news-hub-repo/backend
npm install
echo"my_api= mykey">.env
```

# 2. Run Services
| Service        | Command                | Access             |
|---------------|------------------------|--------------------|
| Backend       | `npm start`            | http://localhost:3001 |
| Frontend      | Open `index.html` with Live Server | http://localhost:5000 |

# Production Deployment
# Web Servers (web01/web02)
```bash
# Install dependencies
sudo apt update && sudo apt install -y nodejs npm nginx

# Deploy app
git clone https://github.com/myusername/news-hub-repo.git
cd news-hub-repo/backend
npm install --production
pm2 start server.js --name "news-api"

# Configure Nginx
sudo nano /etc/nginx/sites-available/news-hub
```
```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
    }
}
```

### Load Balancer (lb01)
```nginx
upstream news_cluster {
    server web01_IP:3001;
    server web02_IP:3001;
    keepalive 32;
}

server {
    listen 80;
    location / {
        proxy_pass http://news_hub;
        proxy_next_upstream error timeout http_502;
    }
}
```

# Demo   
the video is on loom 
https://www.loom.com/share/7b08485bfe2f44b5ae481947b7a920d7

# Troubleshooting
| Symptom                  | Resolution                          |
|--------------------------|-------------------------------------|
| `Failed to fetch`        | 1. Verify CORS middleware <br> 2. Check LB IP in `app.js` |
| `502 Bad Gateway`        | `pm2 restart news-api` on web servers |
| `ERR_CONNECTION_REFUSED` | `sudo ufw allow 3001/tcp`          |

 



