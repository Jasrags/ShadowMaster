# ADR-012.deployment: HTTPS Reverse Proxy with Caddy

## Decision

The system MUST use **Caddy** as a reverse proxy to provide HTTPS support for the Shadow Master application in production deployments. SSL certificates are obtained via **Let's Encrypt** using the **Cloudflare DNS-01 challenge** to support non-standard ports.

Configuration:

- **HTTPS Port**: 2075 (the year the Sixth World begins in Shadowrun)
- **Domain**: `home.jasrags.net`
- **Certificate Provider**: Let's Encrypt via DNS-01 challenge
- **DNS Provider**: Cloudflare (free tier)
- **HTTP**: Disabled in production (HTTPS-only)

## Context

Shadow Master is deployed on a home server where ports 80 and 443 are blocked at the firewall. This prevents traditional HTTP-01 challenges used by most ACME clients to obtain SSL certificates.

The requirements are:

- **Automated SSL**: Certificates must renew automatically without manual intervention.
- **Non-Standard Ports**: HTTPS must work on port 2075 since standard ports are blocked.
- **Security Headers**: Modern security headers (HSTS, X-Frame-Options) must be applied.
- **Minimal Infrastructure**: No additional databases or complex certificate management.
- **HTTPS-Only**: No HTTP endpoint in production; local development uses HTTP.

## Architecture

```
Internet (port 2075)
        |
        v
+--------------------------------------------------+
|  Caddy (caddy-cloudflaredns image)               |
|  - DNS-01 challenge via Cloudflare API           |
|  - HTTPS on :2075                                |
|  - Security headers (HSTS, X-Frame-Options)      |
+----------------------------+---------------------+
                             | (internal: port 3000)
                             v
+--------------------------------------------------+
|  shadow-master (Next.js app)                     |
|  - Port 3000 (internal only)                     |
+--------------------------------------------------+
```

## Deployment Models

| Environment  | Compose File                   | Protocol | Port |
| ------------ | ------------------------------ | -------- | ---- |
| Local dev    | `pnpm dev`                     | HTTP     | 3000 |
| Local Docker | `docker-compose.yml`           | HTTP     | 3000 |
| Production   | `docker-compose.portainer.yml` | HTTPS    | 2075 |

## Consequences

### Positive

- **Automated Certificates**: Caddy handles certificate acquisition and renewal automatically.
- **DNS-01 Bypass**: Works regardless of firewall port restrictions on 80/443.
- **Security Headers**: Standardized security headers applied at the proxy layer.
- **Self-Contained Config**: Caddyfile embedded in docker-compose, no external files needed.
- **HTTPS-Only**: Simplified security model with no HTTP fallback.
- **Thematic Port**: Port 2075 references the Shadowrun setting year.

### Negative

- **Cloudflare Dependency**: Requires Cloudflare as DNS provider (free tier sufficient).
- **API Token Management**: Cloudflare API token must be securely stored and managed.
- **Nameserver Migration**: One-time migration from registrar nameservers to Cloudflare.

## Security Headers

| Header                      | Value                                 | Purpose                    |
| --------------------------- | ------------------------------------- | -------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS for 1 year     |
| `X-Frame-Options`           | `SAMEORIGIN`                          | Prevent clickjacking       |
| `X-Content-Type-Options`    | `nosniff`                             | Prevent MIME type sniffing |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     | Control referrer info      |

## Prerequisites

### Cloudflare Setup (One-Time)

1. Create free Cloudflare account at cloudflare.com
2. Add `jasrags.net` domain to Cloudflare
3. At registrar: change nameservers to Cloudflare's (provided during setup)
4. In Cloudflare: create A record for `home.jasrags.net` pointing to public IP
5. Create API token with Zone:DNS:Edit permission for `jasrags.net`

### Router/Firewall Configuration

Forward port 2075 from router to server:2075

## Environment Variables

| Variable       | Required | Default            | Purpose                         |
| -------------- | -------- | ------------------ | ------------------------------- |
| `CF_API_TOKEN` | Yes      | -                  | Cloudflare API token for DNS-01 |
| `DOMAIN`       | No       | `home.jasrags.net` | Domain name for the application |
| `HTTPS_PORT`   | No       | `2075`             | External HTTPS port             |

## Verification

```bash
# Check certificate acquisition
docker logs caddy-proxy 2>&1 | grep -i "certificate\|tls"

# Test HTTPS endpoint
curl -I https://home.jasrags.net:2075

# Verify security headers
curl -I https://home.jasrags.net:2075 | grep -E "Strict-Transport|X-Frame|X-Content"

# Health check
curl https://home.jasrags.net:2075/api/health
```

## Alternatives Considered

- **acme.sh + Namecheap API**: Rejected. Namecheap API requires expensive business tier. Cloudflare offers DNS API on free tier.

- **Self-Signed Certificates**: Rejected. Causes browser warnings, requires manual trust configuration, and must be manually renewed.

- **Cloudflare Tunnel (Argo)**: Rejected. Routes all traffic through Cloudflare servers, adding latency and dependency. Preferred for scenarios requiring DDoS protection, but overkill for a home application.

- **Traefik**: Rejected. More complex configuration than Caddy for similar functionality. Caddy's automatic HTTPS and simple syntax are better suited for this use case.

- **nginx + certbot**: Rejected. Requires separate certificate management process. Caddy provides integrated certificate management with simpler configuration.

- **HTTP fallback**: Rejected. HTTPS-only simplifies security model and avoids mixed-content issues.

## Related ADRs

- ADR-006: File-Based Persistence (storage approach)
- ADR-008: Cookie-Based Sessions (affected by HTTPS secure flag)
