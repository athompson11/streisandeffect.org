# Live release verification

Checked: 2026-09-07T15:01:20-05:00
Target: `https://streisandeffect.org` over normal public HTTPS, using fresh browser contexts and ordinary canonical URLs.
Release compared: `20260907T194559Z` from `docs/deployment-release.md`.

## Verdict: static release live; production privacy gate fails

The reviewed archive redesign and both protected PDF files are live. The 12 expected HTML routes all return public HTTPS `200`, the published stylesheet matches the release manifest, the live theme and copy controls work, and both downloaded PDFs exactly match the unchanged expected bytes.

The site does **not** pass the requested no-automatic-third-party-runtime privacy gate. Cloudflare injects `https://static.cloudflareinsights.com/beacon.min.js/v31edd6df95cf4e85bb4c19e7a9bdbcba1788362987495` into each inspected normal public HTML response and the browser makes a request to it. It also loads same-origin Cloudflare `/cdn-cgi/rum` resources. This is an edge/CDN behavior absent from the static build, not evidence that the PVC-hosted release bytes failed to publish. Edge Analytics follow-up `t_2ba42222` is already open; no Cloudflare or deployment change was made here.

## Public HTTPS and static-byte checks

All 12 expected public HTML routes returned `200 text/html`:

- `/`
- `/collections/`
- `/amnestyinternational/`
- `/amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026/`
- `/amnestyinternational/like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026/`
- `/about/`, `/accessibility/`, `/legal/`, `/privacy/`, `/submit/`, `/transparency/`, `/verify/`

The linked production stylesheet `/_astro/BaseLayout.DdffxMpd.css` returned `200 text/css`, 9,903 bytes, SHA-256 `cb8bbb223431dea85f25d6b9e7c1dc1ef80911bc0e4cc74485803c6513ded655`, exactly matching the release manifest. The referenced injected Cloudflare beacon returned `200 text/javascript` (30,294-byte response).

The following internal/release-only paths correctly returned `404`:

- `/docs/editorial-review.md`
- `/qa-artifacts/deploy-manager/preflight.json`
- `/.release-stage-20260907T194559Z/index.html`
- `/site-root-before-20260907T194559Z.tgz`

## PDFs: downloaded and verified

| Public URL | MIME type | Bytes | SHA-256 | Result |
| --- | --- | ---: | --- | --- |
| `/documents/amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf` | `application/pdf` | 353758 | `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387` | matches release metadata |
| `/documents/amnestyinternational/like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf` | `application/pdf` | 411751 | `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f` | matches release metadata |

Downloaded verification copies are held locally in this non-served QA directory. They were not published or changed.

## Browser and interaction checks

- Fresh browser inspection found `meta[name="referrer"]` set to `no-referrer` on every one of the 12 routes.
- All 12 routes had the expected current redesign heading, no card/panel/banner class, no configured/launch/pending placeholder phrase, and no captured window errors or unhandled rejections.
- Computed styles on required home, collection, record, and legal main-content surfaces are transparent with no box shadow and 0px border radius. The live pages are not presenting the prior rounded/shaded card surface.
- On the document-record theme chooser, native keyboard selection set Light to `data-theme="light"`, `localStorage['se-theme']='light'`, and a light `rgb(247, 244, 236)` background; it set Dark to `data-theme="dark"`, `localStorage['se-theme']='dark'`, and a dark `rgb(21, 21, 22)` background.
- A physical pointer activation of **Copy SHA-256** focused the control and displayed `Copied to your clipboard.` The copied/visible checksum was the expected 64-character first-PDF hash.
- At a 375px viewport on `/legal/`, `documentElement.scrollWidth` equalled `innerWidth` (375): no horizontal overflow. The visible mobile layout retained readable navigation and the open editorial/rule treatment.

## Privacy and edge evidence

This is the only release-blocking finding.

- Each public page’s DOM included the external `static.cloudflareinsights.com` beacon script. Browser resource timing also recorded `https://streisandeffect.org/cdn-cgi/speculation`, `https://static.cloudflareinsights.com/beacon.min.js/...`, and `https://streisandeffect.org/cdn-cgi/rum?`.
- On `/accessibility/`, `/legal/`, and `/submit/`, browser timing also recorded Cloudflare's same-origin email-decoding script. This is a CDN transform, distinct from the external beacon.
- Thus `no-referrer` correctly ships in the site HTML, but no-referrer does not remove the Cloudflare-generated third-party beacon. Origin/static-byte publication, cached CSS delivery, and browser-visible edge response must be treated separately.

## Screenshots

- `qa-artifacts/live-release/screenshots/live-record-dark-desktop.jpg`
- `qa-artifacts/live-release/screenshots/live-legal-mobile.jpg`

## Known limits

No mailbox delivery test was performed. PDF accessibility was not assessed; that is an acknowledged public limitation, not a verification pass. CDN analytics removal requires authenticated Cloudflare access and is explicitly outside this read-only verification task.

## Fresh production recheck: 2026-09-07T15:08:00-05:00

This fresh browser context was run after the prior report because the task was requeued while the Cloudflare correction remains blocked. It did not use a localhost preview or cache-busting-only URL.

- All 12 canonical HTML routes again returned public HTTPS `200 text/html` over normal canonical URLs.
- Fresh browser navigation of every route again found `meta[name="referrer"]="no-referrer"`, the Cloudflare beacon element, a loaded request to the external beacon, and a loaded same-origin `/cdn-cgi/rum` request.
- The external script remains `https://static.cloudflareinsights.com/beacon.min.js/v31edd6df95cf4e85bb4c19e7a9bdbcba1788362987495`; therefore the required no-automatic-third-party-runtime privacy gate still fails.
- Both PDFs were downloaded again into `qa-artifacts/live-release/recheck-20260907T1506Z/` and retained their exact expected byte sizes and SHA-256 values: 353758 / `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387`; 411751 / `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f`.
- Evidence: `qa-artifacts/live-release/recheck-20260907T1506Z/home-fresh-context.png` and the downloaded PDF copies in that same non-served directory.

The public static release and document bytes remain healthy. This is an unresolved edge configuration condition, not a PVC static-publication defect. The exact remediation is already assigned to `t_2ba42222`, which is blocked pending Cloudflare account access.
