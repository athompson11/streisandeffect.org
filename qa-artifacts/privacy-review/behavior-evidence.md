# Privacy review evidence

## Scope

Local production-build audit of reader privacy for `streisandeffect.org`. This evidence covers the built static candidate served at `http://localhost:4321`; it does not certify the production host, CDN, DNS provider, email provider, or their network/server logs.

## Build and output evidence

| Check | Result |
| --- | --- |
| `npm run build` | Pass. Astro check reported 0 errors, 0 warnings, and 0 hints; 12 static HTML pages built; content validation passed. |
| `node --check qa-artifacts/privacy-review/build-scan.mjs` | Pass. |
| `node qa-artifacts/privacy-review/build-scan.mjs` | Pass. Output saved as `build-scan.json`. |
| `test ! -e dist/docs` | Pass. Repository documentation and QA artifacts are not under the built static output. |

`build-scan.json` recorded 12 HTML pages, no page missing `<meta name="referrer" content="no-referrer">`, and no emitted preconnect, prefetch, remote script, remote stylesheet, or outbound API tokens. The HTTPS URLs it found were canonical/Open Graph/internal document URLs, JSON-LD `https://schema.org`, sitemap namespace declarations, and the ordinary Amnesty source anchor. They are markup values, not evidence of automatically loaded third-party resources.

## Browser instrumentation results

The browser was pointed only to the local preview. Browser-tool setup traffic, the local preview server, and browser automation itself are not site-initiated visitor requests and were excluded.

| Scenario | Observed result |
| --- | --- |
| Clean first load of `/` | Empty localStorage and sessionStorage, empty cookies, `referrer` meta `no-referrer`; resource timings: same-origin CSS and favicon only. |
| Navigate without theme choice to a record page | `se-theme` remained absent; only same-origin CSS appeared in resource timings. |
| Record page containing external Amnesty links | Instrumented `fetch`, XHR, WebSocket, EventSource, `sendBeacon`, and Permissions API arrays were all empty. The page exposed two explicit `https://www.amnesty.org.uk/briefing-review/` anchors, but neither was followed. Resource timings were only same-origin CSS and favicon. |
| Privacy-page navigation | API instrumentation remained empty; storage remained empty; cookies remained empty; only same-origin CSS appeared in resource timings. |
| Explicit Dark then reload | Selector, document theme, and `se-theme` were all `dark` before and after reload. |
| Explicit Light then navigation | Selector, document theme, and `se-theme` were all `light` before and after navigation. |
| Explicit System | Selector became `system`, no explicit `data-theme` remained, and `se-theme` was removed. |
| Clipboard success | A test-only in-memory `navigator.clipboard.writeText` shim recorded one write of the generated citation after the citation button handler ran; status became `Copied to your clipboard.` |
| Clipboard failure | A rejecting test-only write shim recorded one attempted write; status became `Could not copy. Select the text above and copy it manually.` |
| Storage denied before page scripts | Initial page remained readable with System theme; selecting Light applied the current-page visual theme while storage writes threw and were caught; reload returned safely to System. |

The storage-denial probe observed two initial `getItem` attempts: the inline anti-flash read in `BaseLayout.astro` and `storedTheme()` in `archive-ui.ts`. Both only inspect `se-theme`; no value is written on a clean load. The automation helper appears to dispatch the select change twice under the denial shim, so its two failed `setItem` attempts should not be interpreted as two site persistence features. No storage value survived because every storage operation threw.

## Source review

- `src/layouts/BaseLayout.astro:48` emits the no-referrer policy. Lines 62–67 only read `se-theme` and only apply `light` or `dark` as a document data attribute.
- `src/scripts/archive-ui.ts:13-31` limits storage to `se-theme`; invalid/missing values use System and all storage exceptions are caught. Lines 41–45 write only after the theme selector's change event; System removes the key.
- `src/scripts/archive-ui.ts:48-65` attaches clipboard writing only inside copy-button click handlers, uses `navigator.clipboard.writeText`, and contains no clipboard-read operation. The remaining client code implements local TOC highlighting from DOM position only; it has no requests or persistence.
- The source scan found no fetch/XHR/WebSocket/EventSource/beacon code, no service worker/cache/indexedDB/sessionStorage/cookie use, no remote font or runtime embed, and no preconnect/prefetch declarations. `package.json` lists Astro, Astro check/sitemap, TypeScript, and YAML only; no analytics SDK is declared.
- `src/pages/privacy.astro:15-38` accurately describes absence of analytics/tracking cookies, local theme storage with exact key/value scope, explicit clipboard writes, hosting/network log caveats, and email risk. It does not promise anonymity or no logs.
- `src/pages/legal.astro:13-52` is visitor-facing request information. It contains no owner/developer publishing checklist, placeholder, or advice to seek legal counsel.

## Referrer and disclosure conclusion

The built pages consistently use `no-referrer`. No external navigation was performed because this audit explicitly avoided active probing of external services. The document's Amnesty URL is an ordinary visitor-activated anchor, and the policy is correctly declared in the generated HTML; production response headers/CDN behavior remain outside this local audit.

## Verdict

PASS for the local static candidate. Reading and ordinary same-origin navigation produced only same-origin static asset requests, no cookies or stored reading identity/history, and no instrumented network/permission calls. The only site-owned persistent state observed is the documented `se-theme` preference after a theme choice. Clipboard behavior is explicit-action-only with a usable failure fallback.

## Remaining limitations

- Production CDN/hosting/DNS/security/email logging, response headers, and any future deployment configuration were not inspected and cannot be certified by a local build.
- Physical browser clipboard permission and external-navigation referrer behavior were not exercised against external services; source/event-handler review and local behavior establish the intended contract without making external requests.
- The privacy conclusion applies to the reviewed source and generated build. Rebuild and rerun this evidence after any client-script, layout, dependency, analytics, font, embed, or hosting-policy change.
