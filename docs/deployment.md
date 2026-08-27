# Deployment Runbook

## Goals

- Serve a containerized static Astro site.
- Put Cloudflare in front for DNS/CDN/WAF/DDoS protection.
- Store downloadable archive documents on local Kubernetes storage backed by Longhorn.
- Keep the site image and document storage separable so document data can persist across redeploys and image rebuilds.

## Recommended v1 topology

1. Registrar outside Cloudflare.
2. Cloudflare authoritative DNS and proxied public records.
3. Container image built from this repository and served by unprivileged Nginx on port 8080.
4. Kubernetes Deployment with one web replica initially.
5. Longhorn PVC mounted at `/usr/share/nginx/html/documents` for downloadable documents.
6. Traefik Ingress exposes `https://streisandeffect.org`.
7. Future mirrors can be added outside the homelab once the first deployment is stable.

## Why Longhorn for documents

The document files are the durable archive payload. Keeping them on a Longhorn-backed PVC means:

- Documents survive web image redeploys.
- Container images can remain mostly site/app code.
- The archive can be backed up using Longhorn backup targets.
- Documents can be populated locally and served from the same origin path used in metadata, e.g. `/documents/amnestyinternational/file.pdf`.

Live Kubernetes manifests belong in the GitOps repo under `~/Documents/git/homelab-config/apps/streisandeffect/web`; the homelab app-of-apps surfaces them from `~/Documents/git/homelab-config/clusters/homelab/apps`.

## Local build

```fish
cd ~/Documents/git/streisandeffect.org
npm ci
npm run build
```

The static artifact is `dist/`.

## Container build

```fish
npm run build
docker build -t streisandeffect.org:local .
docker run --rm -p 8080:8080 streisandeffect.org:local
```

Then open `http://127.0.0.1:8080/`.

## Longhorn document population

The Argo CD Deployment mounts the Longhorn PVC over `/usr/share/nginx/html/documents`. An init container using the same site image copies `/opt/seed-documents` into the PVC with `cp -an`, so first sync seeds bundled PDFs without overwriting later local additions.

If documents are added directly to Longhorn later, preserve immutable file names and update the site metadata in this repository before publishing links.

After sync, verify public bytes and checksums:

```fish
curl -fsSLO https://streisandeffect.org/documents/amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf
sha256sum a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf
```

The checksum must match the value on the document detail page.

## Cloudflare baseline

- Proxy public web records through Cloudflare.
- Enable WAF managed rules.
- Keep DDoS protection enabled.
- Cache static assets aggressively.
- Cache PDFs if legal/takedown policy allows; otherwise use shorter cache TTLs for `/documents/*` until processes settle.
- Keep origin IP exposure limited through Traefik/OPNsense rather than direct node exposure.

## Download storage requirements

Every available document must have:

- SHA-256 checksum in public metadata.
- File size in public metadata.
- Primary download URL under `/documents/...`.
- Immutable file name/object key; replace by publishing a new file/key, not by mutating old bytes.
- Longhorn backup coverage.
- Mirror URL later when possible.

## Pre-launch checklist

- [ ] `submissions@streisandeffect.org` configured or replaced with the real intake address.
- [ ] Legal contact address configured.
- [ ] `/legal` reviewed.
- [ ] `/transparency` reviewed.
- [ ] Cloudflare account protected with hardware-key MFA.
- [ ] Registrar protected with hardware-key MFA.
- [ ] Argo CD manifests added under `~/Documents/git/homelab-config`.
- [ ] Longhorn backups configured for the documents PVC.
- [ ] Container image built and pushed to the chosen registry.
- [ ] Deployment image tag updated in `homelab-config/apps/streisandeffect/web/deployment.yaml` if not using `latest`.
- [ ] Static build tested with `npm run build`.
- [ ] Container smoke-tested locally.
- [ ] Download checksums verified from the public URL.
