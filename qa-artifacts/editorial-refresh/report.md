# Browser QA — editorial refresh

Date: 2026-09-07
Candidate: local built Astro site only, `http://localhost:4321/`
Preview handle: existing `astro preview` PID 80991. From the repository, start/restart with `npm run preview -- --host localhost --port 4321` after stopping any existing Astro preview.

## Verdict

Not ready for final acceptance yet. The card-free layout, responsive reading, theme behavior, local resources, route/link integrity, no-JS reading fallback, and byte integrity checks passed. Three bounded corrections were created and linked to the final reviewer:

1. `t_0215edba` — print hides navigation and TOC but incorrectly leaves the theme selector and copy buttons visible.
2. `t_5fdc76a3` — `/privacy/` and `/accessibility/` have no `aria-current="page"` in their only visible navigation (footer).
3. `t_df7840e3` — `/submit/` retains owner-facing “Review checklist” copy, which violates the public-copy release gate.

The final reviewer `t_4c50d86b` is linked to all three fix cards, so it cannot race their verification.

## Commands and build evidence

- `npm run check` — passed: Astro 0 errors, 0 warnings, 0 hints; content validation passed.
- `npm run build` — passed: 12 static HTML routes built; content validation passed.
- `node --test tests/content-validation/*.test.mjs tests/ui/public-copy.test.mjs` — passed: 8/8 tests.
- `sha256sum public/documents/amnestyinternational/*.pdf` and `stat` — both local archive PDFs match served metadata:
  - `a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf`: 353758 bytes; `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387`.
  - `like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf`: 411751 bytes; `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f`.
- Both served PDF URLs returned HTTP 200 with matching `Content-Length` and `application/pdf`.

## Route and public-copy coverage

Rendered desktop DOM, title/description/canonical metadata, internal links, status copy, and public text were reviewed for all built routes:

| Route | Outcome |
| --- | --- |
| `/` | Pass. Direct record links appear early; no “How to read this archive” block or paraphrase found. Independent pro-trans framing and source/evidence separation are present. |
| `/collections/` | Pass. Open collection entry; no content card treatment. |
| `/amnestyinternational/` | Pass with an editorial source-verification caveat: “Documented and reported events” is a better evidence label. The pre-existing report of complaints/legal pressure still needs source-owner review before any stronger claim is made. |
| both record routes | Pass for visible withdrawal status before download, publisher/archive distinction, readable provenance, checksum/authorship caveat, breadcrumbs, section IDs, and plain-text citation/hash fallback. |
| `/about/` | Pass. Visitor-facing personal archive and pro-trans stance; no unsupported institutional claims found. |
| `/accessibility/` | Copy pass; navigation-state defect filed as `t_5fdc76a3`. |
| `/legal/` | Pass. The former owner-directed review-process imperatives are absent; the page now explains visitor requests and limits. |
| `/privacy/` | Copy pass; accurately describes explicit theme storage, clipboard-only-on-action, and host/network log caveat. Navigation-state defect filed as `t_5fdc76a3`. |
| `/submit/` | Fail: owner-directed “Review checklist” remains (`Can the archive identify…`, `Are there legal… risks… before hosting?`). Filed as `t_df7840e3`. Legitimate visitor submission/safety guidance remains appropriate. |
| `/transparency/` | Pass. No fabricated counters or promises; states that no public entries are listed. |
| `/verify/` | Pass. The checksum proves matching archive bytes, not publisher authorship. |

No public AI/LLM wording, launch/setup placeholders, owner legal-consultation advice, or restored homepage block was found outside the `/submit/` defect. A naive substring scan reports `AI` inside ordinary words such as “available”; that is not an AI reference.

## Browser behavior and accessibility

- All 12 public HTML routes loaded successfully in Chromium. A pre-document error/unhandled-rejection collector returned `[]` for each route.
- Every same-origin internal route/fragment link found in the rendered DOM returned HTTP 200 through browser fetch; both PDF links were also independently checked with HTTP HEAD.
- The no-card audit covered home, collections, collection, both records, and every informational route. For every rendered `main article`, `section`, `aside`, and `dl`, computed style had transparent background, zero corner radius, and no shadow. Entries use horizontal rules only; notices use a 4px left rule only. Full data: `runtime-style-link-audit.json`.
- At 320px record view, document/body scroll widths were 305px; 375px widths were 360px; no tested long title, URL, code value, or checksum overflowed. A 640 CSS-pixel / device-scale-factor-2 reflow check (200%-equivalent) had no horizontal overflow.
- Visual evidence: `screenshots/record-desktop-system.png` and `screenshots/record-mobile-320-dark.png`. The mobile view keeps the nav readable, wraps the long record title and metadata, and has no card/panel treatment.
- Breadcrumbs, skip link, TOC anchors, and selectable citation/checksum values are rendered statically. No-JS record inspection still exposed both breadcrumbs, all seven TOC fragment links, the PDF link, citation, and SHA-256 value.
- Explicit keyboard selection of Dark wrote `localStorage['se-theme']='dark'`; explicit System selection removed the key. With `Storage.prototype.setItem` deliberately denied, explicit Dark still changed the live theme and left storage empty.
- Clipboard handler paths were exercised by replacing `navigator.clipboard.writeText`: SHA-256 success announced “Copied to your clipboard.” and received the expected hash; rejected write announced “Could not copy. Select the text above and copy it manually.” with the citation still selectable.
- The real-browser harness does not deliver programmatic wheel/page-key scrolling on these pages. It therefore could not physically click off-screen reader controls or verify scroll-driven TOC observer state. The fallback fragment anchors and control handler paths were independently present/tested; a normal browser should recheck current-TOC indication after scrolling.

## Privacy/runtime resources

- On each rendered page, resource timing listed only the same-origin compiled CSS asset; no external fonts, scripts, embeds, analytics, preconnects, or prefetches were observed.
- Each page contains `<meta name="referrer" content="no-referrer">`.
- External publisher/source links were inspected but not activated; no external request occurred during normal page load.

## Print audit

Print media correctly hides header/footer navigation and the TOC; checksum remains inline and uses `overflow-wrap:anywhere`. It fails the action-chrome requirement: the theme `<select>` computed as `inline-block` and copy buttons as `inline-flex` in print media. This is the basis of `t_0215edba`; no print screenshot/PDF was claimed while this defect remains.

## Artifacts

- `route-audit-desktop.json` — rendered route text, metadata, links, computed editorial styles, and resource URLs.
- `runtime-style-link-audit.json` — focused no-card/same-origin-link/runtime-resource audit.
- `screenshots/record-desktop-system.png`
- `screenshots/record-mobile-320-dark.png`
- `logs/` — reserved for the preview process; candidate remains available at the local URL above.
