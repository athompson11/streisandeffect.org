# Production edge-privacy baseline

Date: 2026-09-07
Scope: `https://streisandeffect.org/` and the 12 public HTML routes emitted by the current local build.

## Observed state

Cloudflare is automatically injecting the Cloudflare Web Analytics/RUM beacon into every tested public HTML response. The public DOM contained a module script loaded from `https://static.cloudflareinsights.com/beacon.min.js/...`; it then made a same-origin request to `/cdn-cgi/rum`.

Cloudflare's authoritative Web Analytics documentation identifies that exact script and endpoint as its Web Analytics beacon for proxied sites. It documents that a proxied site whose Web Analytics automatic setup is enabled has this snippet injected at the edge, and that selecting **Disable** in **Web Analytics > Manage site** stops injection.

No beacon script or RUM request exists in the site source/build baseline documented in `docs/privacy-review.md`; this is an edge-only change in the response path.

## Route audit

`prechange-public-page-audit.json` is the machine-readable record. It covers all 12 emitted HTML routes. Results:

- HTTPS: 12/12
- Beacon script present: 12/12
- Same-origin `/cdn-cgi/rum` resource: 12/12
- Third-party browser resource: 12/12, only `https://static.cloudflareinsights.com`
- `meta[name="referrer"]` = `no-referrer`: 12/12
- Theme control present: 12/12
- No `card`/`panel` class marker returned by the route audit: 12/12
- Cloudflare email-obfuscation script: 0/12

The browser result is a direct refutation of the local-only privacy baseline for production: local source has no analytics, but production currently receives an edge-injected browser analytics script.

## Relevant configuration state to preserve

- Cloudflare account-level product: **Web Analytics**
- Site: `streisandeffect.org`
- Feature: **Automatic setup**
- Before state: enabled automatic JS-snippet injection (observed from 12/12 page responses); the exact dashboard selector could not be read because this worker has no usable authenticated dashboard/API session.
- Intended after state: **Disable** for this site only. This must disable automatic injection; it must not alter DNS proxying, TLS, WAF, DDoS protection, or other zones.
- No zone-setting API mutation was attempted. Cloudflare's generic zone-settings API is not evidence of the correct Web Analytics product setting.

## PDF integrity baseline

The live downloads matched the archived source bytes:

| PDF | Bytes | SHA-256 |
| --- | ---: | --- |
| `a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf` | 353758 | `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387` |
| `like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf` | 411751 | `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f` |

## Email obfuscation

No edge-injected Cloudflare email-obfuscation script was observed. Therefore no no-JavaScript email accessibility regression was identified in this scope.

## Authoritative documentation

- https://developers.cloudflare.com/web-analytics/get-started/
- https://developers.cloudflare.com/speed/observatory/rum-beacon/
- https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/
- https://developers.cloudflare.com/web-analytics/faq/
