# Deployment Runbook

## Goals

- Serve a static site with no required origin compute.
- Use Cloudflare for DNS/CDN/WAF/DDoS protection where possible.
- Keep downloads and deployment portable enough to survive provider action or false complaints.

## Recommended v1 topology

1. Registrar outside Cloudflare.
2. Cloudflare authoritative DNS and proxied public records.
3. Static site deployment target: Cloudflare Pages or any static host.
4. Download storage: S3-compatible bucket with public CDN URL.
5. Secondary mirror storage outside the primary provider.

## Build

```fish
cd ~/Documents/git/streisandeffect.org
npm ci
npm run build
```

The static artifact is `dist/`.

## Cloudflare baseline

- Proxy all public `A`, `AAAA`, or `CNAME` web records through Cloudflare.
- Enable WAF managed rules.
- Add rate limits for any future dynamic endpoints.
- Cache static assets aggressively.
- Cache collection pages unless a legal emergency requires instant invalidation.
- Keep origin hostnames and bucket endpoints private where practical.

## Download storage requirements

Every available document must have:

- SHA-256 checksum in public metadata.
- File size in public metadata.
- Primary download URL.
- Mirror URL when possible.
- Immutable object key; replace by publishing a new object/key, not by mutating the old bytes.

## Pre-launch checklist

- [ ] Legal contact address configured.
- [ ] `/legal` reviewed.
- [ ] `/transparency` reviewed.
- [ ] Cloudflare account protected with hardware-key MFA.
- [ ] Registrar protected with hardware-key MFA.
- [ ] Storage provider protected with hardware-key MFA.
- [ ] Deploy tokens scoped to this project only.
- [ ] Static build tested with `npm run build`.
- [ ] Download checksums verified from the public URL.
