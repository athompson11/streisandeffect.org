# streisandeffect.org

A pro-trans public-interest archive site for explaining, contextualizing, and preserving deleted or suppressed documents, especially where political pressure campaigns try to bury criticism or accountability reporting.

## Current status

MVP scaffold. The site currently includes:

- Static Astro site shell.
- Public routes for mission, about, collections, submission intake, legal/takedown process, transparency, and verification instructions.
- `/amnestyinternational` collection page with two Amnesty International UK PDF downloads.
- Typed archive data model.
- Document ingestion helper for checksums and metadata stubs.
- Submission-candidate note template for leads that may be worth archiving; submitted files are not automatically stored or hosted.
- Containerized Nginx deployment path.
- Kubernetes manifests for Traefik + Longhorn-backed document storage.
- Provider failover runbook.

## Development

```fish
cd ~/Documents/git/streisandeffect.org
npm install
npm run dev
```

## Verification

```fish
npm run check
npm run build
```

## Container smoke test

```fish
npm run build
docker build -t streisandeffect.org:local .
docker run --rm -p 8080:8080 streisandeffect.org:local
```

Open `http://127.0.0.1:8080/`.

## Add a document metadata stub

```fish
npm run ingest:document -- \
  --file /path/to/document.pdf \
  --collection amnestyinternational \
  --title "Document title" \
  --original-url "https://publisher.example/original.pdf"
```

The script computes SHA-256 and file size, then writes a YAML metadata stub under `content/collections/<collection>/documents/`.

## Submission candidates

Public intake points people to `submissions@streisandeffect.org`, but the site is explicit that submissions are leads only. Do not store or publish every suggestion. Curator notes belong under `content/submission-candidates/` using `templates/submission-candidate.yaml`.

## Deployment posture

The intended deployment is a containerized static site behind Cloudflare and Traefik, with downloadable documents served from a Longhorn-backed Kubernetes PVC mounted at `/usr/share/nginx/html/documents`. Cloudflare provides DNS/CDN/WAF/DDoS protection; Longhorn keeps local archive documents persistent across web image redeploys.
