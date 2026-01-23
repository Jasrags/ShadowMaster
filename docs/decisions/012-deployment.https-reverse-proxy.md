# ADR-012.deployment: HTTPS Reverse Proxy with Caddy

## Decision

The system MUST use **Caddy** as a reverse proxy to provide HTTPS support for the Shadow Master application. SSL certificates are obtained via **Let's Encrypt** using the **Cloudflare DNS-01 challenge** to support non-standard ports.

Configuration:

- **HTTPS Port**: 9443 (external)
- **HTTP Port**: 3000 (optional, configurable)
- **Domain**: `home.jasrags.net`
- **Certificate Provider**: Let's Encrypt via DNS-01 challenge
- **DNS Provider**: Cloudflare (free tier)

## Context

Shadow Master is deployed on a home server where ISP blocks ports 80 and 443 (common residential restrictions). This prevents traditional HTTP-01 challenges used by most ACME clients to obtain SSL certificates.

The requirements are:

- **Automated SSL**: Certificates must renew automatically without manual intervention.
- **Non-Standard Ports**: HTTPS must work on port 9443 since 443 is blocked.
- **Security Headers**: Modern security headers (HSTS, X-Frame-Options) must be applied.
- **Minimal Infrastructure**: No additional databases or complex certificate management.
- **Migration Path**: Support for eventual HTTPS-only deployment.

## Architecture

```
Internet (port 9443)
        |
        v
+--------------------------------------------------+
|  Caddy (caddy-dns/cloudflare build)              |
|  - DNS-01 challenge via Cloudflare API           |
|  - HTTPS on :9443                                |
|  - Optional HTTP proxy on :3000                  |
|  - Security headers (HSTS, X-Frame-Options)      |
+----------------------------+---------------------+
                             | (internal: port 3000)
                             v
+--------------------------------------------------+
|  shadow-master (Next.js app)                     |
|  - Port 3000 (internal only)                     |
+--------------------------------------------------+
```

## Consequences

### Positive

- **Automated Certificates**: Caddy handles certificate acquisition and renewal automatically.
- **DNS-01 Bypass**: Works regardless of ISP port restrictions on 80/443.
- **Security Headers**: Standardized security headers applied at the proxy layer.
- **Simple Configuration**: Single Caddyfile for all proxy rules.
- **Future Migration**: Easy to switch to HTTPS-only by removing HTTP block.

### Negative

- **Cloudflare Dependency**: Requires Cloudflare as DNS provider (free tier sufficient).
- **Custom Caddy Build**: Requires Caddy built with the cloudflare DNS plugin.
- **API Token Management**: Cloudflare API token must be securely stored and managed.
- **Nameserver Migration**: One-time migration from Namecheap nameservers to Cloudflare.

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
3. At Namecheap: change nameservers to Cloudflare's (provided during setup)
4. In Cloudflare: create A record for `home.jasrags.net` pointing to public IP
5. Create API token with Zone:DNS:Edit permission for `jasrags.net`

### Router Configuration

Forward port 9443 from router to server:9443

## Alternatives Considered

- **acme.sh + Namecheap API**: Rejected. Namecheap API requires expensive business tier. Cloudflare offers DNS API on free tier.

- **Self-Signed Certificates**: Rejected. Causes browser warnings, requires manual trust configuration, and must be manually renewed.

- **Cloudflare Tunnel (Argo)**: Rejected. Routes all traffic through Cloudflare servers, adding latency and dependency. Preferred for scenarios requiring DDoS protection, but overkill for a home application.

- **Traefik**: Rejected. More complex configuration than Caddy for similar functionality. Caddy's automatic HTTPS and simple syntax are better suited for this use case.

- **nginx + certbot**: Rejected. Requires separate certificate management process. Caddy provides integrated certificate management with simpler configuration.

## Files Created

| File                       | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `Caddyfile`                | Caddy reverse proxy configuration             |
| `docker-compose.https.yml` | Production compose with Caddy + HTTPS         |
| `Dockerfile.caddy`         | Custom Caddy build with Cloudflare DNS plugin |

## Environment Variables

| Variable       | Purpose                             | Example            |
| -------------- | ----------------------------------- | ------------------ |
| `CF_API_TOKEN` | Cloudflare API token for DNS-01     | `xxxxxxxxxxxx`     |
| `DOMAIN`       | Domain name for the application     | `home.jasrags.net` |
| `HTTPS_PORT`   | External HTTPS port                 | `9443`             |
| `HTTP_PORT`    | Optional HTTP port (empty=disabled) | `3000`             |
| `HTTPS_ONLY`   | Disable HTTP endpoint               | `false`            |

## Verification

```bash
# Check certificate acquisition
docker logs caddy-proxy 2>&1 | grep -i "certificate\|tls"

# Test HTTPS endpoint
curl -I https://home.jasrags.net:9443

# Verify security headers
curl -I https://home.jasrags.net:9443 | grep -E "Strict-Transport|X-Frame|X-Content"

# Health check
curl https://home.jasrags.net:9443/api/health
```

## Migration to HTTPS-Only

When ready to disable HTTP:

1. Set `HTTPS_ONLY=true` in environment
2. Remove HTTP block from Caddyfile (or rely on conditional)
3. Restart Caddy container
4. Update bookmarks and documentation

## Related ADRs

- ADR-006: File-Based Persistence (storage approach)
- ADR-008: Cookie-Based Sessions (affected by HTTPS secure flag)
