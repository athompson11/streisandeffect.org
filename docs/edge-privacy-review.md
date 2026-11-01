# Production edge-privacy review

Date: 2026-09-07
Status: blocked before configuration change — no authenticated Cloudflare dashboard or API session was available to this worker.

## Finding

Production is injecting Cloudflare Web Analytics/Real User Monitoring (RUM) into HTML responses even though the static site source and built output contain no analytics. A real browser found `https://static.cloudflareinsights.com/beacon.min.js/...` and a subsequent `https://streisandeffect.org/cdn-cgi/rum` request on every one of the 12 public HTML routes.

Cloudflare's current documentation identifies this exact external script and same-origin endpoint as Web Analytics on a proxied zone. Its documented control is account-level **Web Analytics > Manage site > Automatic setup**. For `streisandeffect.org`, the intended narrowly scoped result is **Disable**: Cloudflare states that the JavaScript snippet will not be injected and is disabled.

This is not a source, Kubernetes, DNS, proxy, TLS, WAF, DDoS, cache-purge, or CSP issue. No such settings were changed.

## Required operator action

Using the Cloudflare account that owns `streisandeffect.org`:

1. Open **Web Analytics** (account level).
2. Locate the `streisandeffect.org` site and select **Manage site**.
3. Change **Automatic setup** to **Disable** (not the EU-exclusion or manual-snippet alternatives).
4. Save the state and retain the before/after selector state in the Cloudflare audit history or a private operator note.

Do not change the zone's DNS proxy status, TLS, WAF, DDoS protection, security logging, rules, or any other domain. To roll back, return to the same site and select the previous automatic-setup enabled mode.

## Evidence and expected verification

Baseline detail is stored under `qa-artifacts/edge-privacy/`:

- `prechange-public-page-audit.json`: browser audit of all 12 public HTML routes.
- `prechange-summary.md`: current observed injection, configuration target, source baseline, PDF byte checks, and documentation links.

After the operator action, re-run the route audit against ordinary URLs (no cache-busting query): all 12 HTML responses must lack both `static.cloudflareinsights.com/beacon.min.js` and `/cdn-cgi/rum`; a representative browser waterfall must have no third-party request; HTTPS, theme selector, no-card result, and both PDF byte hashes must remain intact.

## Limits

The dashboard browser session reached Cloudflare's security-verification page and did not expose an authenticated product session. No usable API session was available to this worker, and no credentials were sought from unrelated locations. Consequently, the exact dashboard-side site identifier and the post-change condition cannot be asserted here.

No Cloudflare email-obfuscation script appeared on any audited public route, so no concrete no-JavaScript email accessibility issue was found.

## Sources

- https://developers.cloudflare.com/web-analytics/get-started/
- https://developers.cloudflare.com/speed/observatory/rum-beacon/
- https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/
- https://developers.cloudflare.com/web-analytics/faq/
