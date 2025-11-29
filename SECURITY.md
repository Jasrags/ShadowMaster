# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in ShadowMaster, please follow these steps:

1. **Do not** open a public issue on GitHub
2. **Do not** disclose the vulnerability publicly until it has been addressed
3. Email security details to: [INSERT YOUR SECURITY EMAIL HERE]
   - If you don't have a dedicated security email, you can use GitHub's security advisory feature

### What to Include

When reporting a vulnerability, please include:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- We will acknowledge receipt of your report within 48 hours
- We will provide a detailed response to your report within 7 days
- We will keep you informed of our progress toward a fix
- We will notify you when the vulnerability is fixed

### Responsible Disclosure

We ask that you:

- Allow us a reasonable amount of time to fix the vulnerability before making it public
- Act in good faith to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Not exploit a security vulnerability you discover for any reason

### Recognition

Contributors who report security vulnerabilities in a responsible manner may be acknowledged in release notes (unless they prefer to remain anonymous).

## Security Best Practices for Users

- Always use a strong `SESSION_SECRET` in production (generate a random string, at least 32 characters)
- Keep ShadowMaster and its dependencies up to date
- Run ShadowMaster with least-privilege user accounts
- Do not expose ShadowMaster to the public internet unless you have properly secured it
- Review and follow the deployment documentation for your specific environment

## Known Security Considerations

- ShadowMaster uses bcrypt for password hashing
- Session cookies are HTTP-only and should be used over HTTPS in production
- User-generated data (users, campaigns, characters) should be excluded from version control (see `.gitignore`)

