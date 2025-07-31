# PulsePoint News Finder Application

A beautiful, containerized web application that fetches and displays 
real-time news headlines using the NewsAPI. Built with Node.js and Nginx 
on Ubuntu containers, this project demonstrates container orchestration, 
load balancing, and SSL termination using HAProxy.

---

##  Features

* REST API integration with [NewsAPI](https://newsapi.org/)
* Deployed on two Ubuntu-based Docker containers
* Nginx used to serve static files and proxy API calls
* Load balancing with HAProxy using the Round-robin algorithm
* HTTPS enforced through SSL termination at the web server level
* Custom response headers for testing load balancing behavior

---

## Deployment Overview

The application consists of:

* **web-01** and **web-02**: Identical Ubuntu-based containers serving the 
app
* **lb-01**: Load balancer container using HAProxy to distribute traffic

Deployment was achieved by:

* Creating a Dockerfile that installs Node.js, Nginx, and SSH
* Writing a docker-compose.yml to orchestrate the services
* Configuring HAProxy to use Round-robin and include custom headers
* Installing SSL certs and configuring Nginx for HTTPS termination

---

## Image Details

* **Docker Hub URL**: `https://hub.docker.com/r/denzel147/pulsepoint`
* **Image Name**: `pulsepoint`
* **Tags**: `latest`, `v1.0`

---

## Build Instructions

To build locally:

```bash
# For web-01 and web-02 (run from project root)
docker build -t pulsepoint:latest .

# For load balancer (inside ./lb folder)
docker build -t pulsepoint-lb:latest ./lb
```

---

## Run Instructions

Using Docker Compose:

```bash
docker-compose up -d
```

Access points:

* Web 1: [http://localhost:8080](http://localhost:8080)
* Web 2: [http://localhost:8081](http://localhost:8081)
* Load Balancer: [https://localhost:8082](https://localhost:8082)

SSH Access:

```bash
ssh ubuntu@localhost -p 2211 # web-01
ssh ubuntu@localhost -p 2212 # web-02
ssh ubuntu@localhost -p 2210 # lb-01
```

Password: `pass123`

---

## Load Balancer Configuration (HAProxy)

`haproxy.cfg` snippet:

```haproxy
defaults
    mode http
    timeout connect 5000ms
    timeout client  50000ms
    timeout server  50000ms

frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance roundrobin
    option forwardfor
    http-request set-header X-Served-By-Servername %[env(HOSTNAME)]
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
```

To reload HAProxy:

```bash
docker exec -it lb-01 service haproxy reload
```

---

## Testing Load Balancing

Tested with:

```bash
curl -I http://localhost:8082
```

Look for alternating values in the response header:

```
X-Served-By-Servername: web-01
X-Served-By-Servername: web-02
```

Repeated requests confirmed round-robin behavior.

---

##  APIs Used

This project uses 
[NewsAPI](https://newsapi.org/docs/endpoints/top-headlines):

* `GET 
/v2/top-headlines?country=us&apiKey=5fd477b06b4f44c09ea92e0c41a6bb6f`

**Credits:** Thanks to the developers of NewsAPI for providing an 
excellent news data service.

---

## ️ Handling Secrets (Hardening)

To avoid baking secrets into images:

* Use Docker environment variables:

```bash
docker run -e NEWS_API_KEY=5fd477b06b4f44c09ea92e0c41a6bb6f pulsepoint
```

* Or mount a `.env` file using Docker Compose:

```yaml
environment:
  - NEWS_API_KEY=${NEWS_API_KEY}
```

---

## ️ Development Challenges

Initially, I intended to build a book finder app, but I lost interest in 
its UI layout. After re-evaluating my goals, I pivoted to building a news 
app using NewsAPI. I also faced issues with serving static files via 
Nginx, which I resolved by carefully configuring the `location /` block 
and confirming file paths.

---

##  Resources & Credits

* [NewsAPI Documentation](https://newsapi.org/docs)
* [HAProxy Documentation](https://www.haproxy.org/)
* [Docker Docs](https://docs.docker.com/)
* [Nginx Docs](https://nginx.org/en/docs/)
* [SSL Setup Guide](https://letsencrypt.org/)

---

## Future Improvements

* Add a front-end framework (React/Vue) for UI enhancements
* Integrate pagination and category filters
* Add user authentication and preferences storage

---

## Step6 screenshot
<img width="1440" height="900" alt="Screenshot 2025-07-31 at 19 38 43" src="https://github.com/user-attachments/assets/9097cd7a-f185-49e6-a91f-a5a795d5bfa5" />


Built with passion by Oladimeji 

