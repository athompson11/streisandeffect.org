# streisandeffect.org

A static-first public-interest archive site for explaining, contextualizing, and preserving deleted or suppressed documents.

## Current status

MVP scaffold. The site currently includes:

- Static Astro site shell.
- Public routes for mission, about, collections, legal/takedown process, transparency, and verification instructions.
- Initial `/amnestyinternational` collection page without live document downloads yet.
- Typed archive data model.
- Document ingestion helper for checksums and metadata stubs.
- Content validation script.
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

## Add a document metadata stub

```fish
npm run ingest:document -- \
  --file /path/to/document.pdf \
  --collection amnestyinternational \
  --title "Document title" \
  --original-url "https://publisher.example/original.pdf"
```

The script computes SHA-256 and file size, then writes a YAML metadata stub under `content/collections/<collection>/documents/`.

## Deployment posture

The site is designed to be deployable to any static host. Cloudflare can sit in front for DNS/CDN/WAF/DDoS protection, but the repository and downloadable files should remain portable so a false DMCA or provider-side abuse action does not become a single point of failure.
