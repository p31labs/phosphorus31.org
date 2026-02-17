# Security Checklist

Quick reference checklist for security hardening.

## Pre-Deployment Checklist

### Environment Variables
- [ ] `JWT_SECRET` set (minimum 32 characters)
- [ ] `SESSION_SECRET` set (minimum 32 characters)
- [ ] `ENCRYPTION_KEY` set (minimum 32 characters)
- [ ] `DATABASE_URL` configured securely
- [ ] `REDIS_URL` configured securely
- [ ] All API keys set and rotated
- [ ] No secrets in code or config files

### Authentication & Authorization
- [ ] JWT tokens configured with secure secret
- [ ] Token expiration set appropriately
- [ ] MFA enabled for admin accounts
- [ ] Password requirements enforced (min 12 chars, complexity)
- [ ] Account lockout after failed attempts
- [ ] Secure password reset implemented

### Network Security
- [ ] HTTPS enabled in production
- [ ] SSL/TLS certificates valid
- [ ] CORS configured correctly
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] DDoS protection configured

### Application Security
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Output sanitization implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (CSP, sanitization)
- [ ] CSRF protection enabled
- [ ] Error messages don't leak sensitive info

### Data Security
- [ ] Database encrypted at rest
- [ ] Database connections encrypted (TLS)
- [ ] Sensitive data encrypted (EncryptedBlob)
- [ ] Backups encrypted
- [ ] Logs don't contain sensitive data
- [ ] PII handling compliant

### Dependencies
- [ ] All dependencies updated
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Security patches applied
- [ ] Unused dependencies removed

### Monitoring & Logging
- [ ] Security audit logging enabled
- [ ] Alerts configured for critical events
- [ ] Log retention policy set
- [ ] Log access restricted
- [ ] Security monitoring active

### Access Control
- [ ] Principle of least privilege applied
- [ ] Admin access restricted
- [ ] API keys rotated regularly
- [ ] Service accounts secured
- [ ] No hardcoded credentials

## Runtime Security

### Regular Checks
- [ ] Monitor security audit logs daily
- [ ] Review failed authentication attempts
- [ ] Check for suspicious activity patterns
- [ ] Verify rate limit effectiveness
- [ ] Review access logs weekly

### Updates
- [ ] Security patches applied promptly
- [ ] Dependencies updated monthly
- [ ] Security advisories monitored
- [ ] Vulnerability assessments run quarterly

### Backup & Recovery
- [ ] Backups encrypted and tested
- [ ] Recovery procedures documented
- [ ] Disaster recovery plan current
- [ ] Backup restoration tested

## Incident Response

### Preparedness
- [ ] Incident response plan documented
- [ ] Security contacts identified
- [ ] Escalation procedures defined
- [ ] Communication plan ready

### Response
- [ ] Incident detection procedures
- [ ] Containment procedures
- [ ] Eradication procedures
- [ ] Recovery procedures
- [ ] Post-incident review process

## Compliance

### Data Protection
- [ ] Privacy policy current
- [ ] Data retention policies enforced
- [ ] User data deletion implemented
- [ ] Consent management in place

### Regulatory
- [ ] GDPR compliance (if applicable)
- [ ] CCPA compliance (if applicable)
- [ ] Industry-specific compliance
- [ ] Audit trail maintained

## The Mesh Holds 🔺

Security is continuous. Regular review and updates are essential.

💜 With love and light. As above, so below. 💜
