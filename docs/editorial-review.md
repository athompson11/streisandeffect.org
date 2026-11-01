# Final editorial and acceptance review

Reviewed: 2026-09-07
Candidate: local production build at `http://localhost:4321/`
Baseline: commit `199a3a0`
Status: accepted as a local review candidate; not deployed

## Verdict

The improved site meets the agreed local acceptance gate. It is now a coherent, contemporary editorial archive rather than a set of content cards, while retaining direct static HTML, ordinary links, no-JavaScript reading access, the warm paper/ink/red identity, and a privacy-minimal operating model.

No release-blocking defect remains in the reviewed local build. The prior blockers were rechecked: filled record actions in Dark now use dark ink on the coral fill at 7.199:1 contrast, and desktop H1 text is capped at 3.2rem (51.2px at a 1280px viewport). The headings remain prominent but no longer function as 4rem billboard headings. Fresh Light and existing Dark desktop/mobile views showed no clipping, overlap, card regression, or horizontal overflow.

This is not a production-deployment approval. No commit, push, deployment, DNS, hosting, mail, or infrastructure work was performed or verified.

## Completed work accepted

- Replaced rounded, fully bordered, shaded, and shadowed content cards/panels with open editorial entries, definition lists, tables, horizontal rules, and notices using a single side rule.
- Applied one responsive visual system across the homepage, collection index, collection, both document records, and all informational pages.
- Added CSS-native System theming plus an explicit System/Light/Dark selector. Only explicit Light/Dark choices write `localStorage['se-theme']` as `light` or `dark`; System removes the key.
- Added restrained interaction transitions, a reduced-motion override, visible focus states, same-page current-section enhancement, and readable mobile navigation without turning the static site into an application.
- Exposed named document-record links earlier on the homepage and collection route while keeping publisher/withdrawal context ahead of collection-page records and all raw download links.
- Added breadcrumbs, stable section anchors, compact “On this page” navigation, and sticky-header-safe fragment offsets.
- Added selectable citation and SHA-256 values with progressive Copy controls, explicit success/failure status, and manual-selection fallback.
- Added print treatment that omits navigation, theme and copy controls while retaining record title, publisher status, provenance, download URL, and checksum.
- Hardened local content validation to compare hosted PDF size and SHA-256 bytes with metadata and to reject missing, mismatched, non-regular, escaped, or unsafe local paths. Remote URLs are explicitly warned as unverified rather than fetched.
- Replaced the blanket “Verified events” presentation with “Documented and reported events,” removed an unsupported future-source promise from rendered output, and retained uncertainty in existing data.
- Rewrote owner-facing legal and submission workflow copy as visitor-facing explanations. Removed unsupported public counters/process guarantees and the unverified PDF accessibility assertion.
- Added `no-referrer` metadata and accurate privacy text for theme storage, explicit clipboard use, email, and possible hosting/network logs.
- Preserved the user’s original homepage deletion: “How to read this archive” and its editorial-position paragraph remain absent and were not paraphrased back onto the homepage.
- Preserved `public/**`, the two PDF byte streams, `content/**`, YAML metadata, canonical HTML routes, and PDF paths relative to `199a3a0`.

## Independent verification

### Repository and automated checks

- `npm run check`
  - Passed.
  - Astro checked 22 files with 0 errors, 0 warnings, and 0 hints.
  - Real content validation passed.
- `npm run build`
  - Passed.
  - Astro emitted 12 static pages.
  - Post-build content validation passed.
- `node --test tests/content-validation/*.test.mjs tests/ui/public-copy.test.mjs`
  - Passed 8/8.
  - Covered matching bytes, missing local PDF, correct-format wrong SHA-256, wrong byte size, unsafe local path, retained schema diagnostics, explicit remote-URL warning behavior, and built public-copy regression.
- `git diff --check`
  - Passed.
- `git diff --quiet 199a3a0 -- public content`
  - Passed; no public asset/PDF or archive-content/YAML changes.
- Source and built-output searches found no `AI`, `LLM`, deleted homepage block, known owner-directed legal checklist, future-source promise, or launch/configuration placeholder wording.

### Rendered route and link checks

Chromium reviewed all 12 unique public HTML routes:

- `/`
- `/collections/`
- `/amnestyinternational/`
- both `/amnestyinternational/<document>/` records
- `/about/`
- `/accessibility/`
- `/legal/`
- `/privacy/`
- `/submit/`
- `/transparency/`
- `/verify/`

Across those routes, the final computed-style/DOM audit found:

- zero card-like main content containers;
- zero missing local fragment targets;
- zero horizontal-overflow routes at 1280px;
- `no-referrer` on all 12 pages;
- zero automatic external runtime resources;
- zero known owner-directed/placeholder phrases;
- correct active global/footer navigation, including Privacy and Accessibility;
- H1 computed at the corrected 51.2px desktop maximum.

All 14 local targets (12 HTML routes and two PDFs) returned HTTP 200. Both PDFs returned `application/pdf` and their expected bytes:

- `a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf`
  - 353758 bytes
  - SHA-256 `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387`
- `like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf`
  - 411751 bytes
  - SHA-256 `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f`

### Interaction, accessibility, privacy, and print checks

On a real document record in Chromium:

- Explicit Dark stored `se-theme=dark`; explicit Light stored `se-theme=light`; System removed the key and removed the explicit theme attribute.
- Denied storage still applied the chosen live theme and left the page usable.
- The Dark download action computed to `rgb(27, 27, 29)` on `rgb(242, 139, 130)`, 7.199:1 contrast.
- Copy SHA-256 sent the exact displayed 64-character hash and announced “Copied to your clipboard.”
- Simulated clipboard rejection announced the manual-copy fallback while leaving citation text visible and selectable.
- The TOC scroll handler selected `#verification` when that section crossed the current-section guide; plain fragment anchors exist without enhancement.
- Reduced-motion emulation changed smooth scrolling to `auto` and collapsed transition duration to 0.01ms.
- Print media hid the header, footer, theme selector, TOC, and both copy buttons while retaining the title, provenance table, withdrawal notice, download link, and checksum.
- With JavaScript disabled, the breadcrumb, seven TOC links, PDF download, 281-character citation, full 64-character checksum, and theme select remained in the static document.
- Existing 320px Dark evidence confirms the corrected 33.6px record heading, no horizontal overflow, readable navigation, and no content-card treatment.

## Editorial evaluation

The strongest improvement is hierarchy: records are now discoverable before secondary archive commentary, and status, provenance, verification, downloads, archive interpretation, and external context are visibly distinct. The publisher-withdrawal notice remains directly before the download action, while the checksum explanation correctly limits its claim to byte equality rather than authorship or authenticity.

The full-site presentation is coherent in Light and Dark, with deliberate typography, spacing, rules, compact labels, link states, and square controls. It reads as an independent publication rather than a generic SaaS interface or retro novelty skin. The intentionally narrow reading measure leaves substantial whitespace on wide screens and can make long record titles or the TOC wrap; this is a bounded compositional refinement, not a usability failure. The current two-record catalogue does not justify search, filters, or a larger application shell.

Public prose now consistently addresses visitors. It makes the personal, independent, pro-trans position explicit without implying affiliation, staff, guaranteed response, institutional process, anonymity, complete logs, or publisher endorsement. Existing uncertain claims remain labelled as reported or unresolved rather than being silently strengthened.

## Remaining risks and limits

- Production hosting/CDN/DNS/security logs, response headers, cache behavior, external-link behavior, and infrastructure were not reviewed. Repeat privacy and link checks after deployment.
- The listed legal, submission, and accessibility email addresses were not delivery-tested. Mail routing and operator capacity should be confirmed before public publication; the local candidate does not claim they were verified.
- The archive’s existing event descriptions and publisher-context claims were not independently re-researched in this implementation review. Any attempt to strengthen them needs direct sources; unresolved litigation/removal-timing claims should remain qualified.
- No PDF accessibility assessment was completed. The public accessibility page states this limitation accurately.
- Physical printing across multiple browser/OS printer drivers was not tested; Chromium print-media computed styles passed.
- Clipboard behavior was exercised with deterministic browser shims, not every browser’s real permission UI.
- The local preview is ephemeral. It is a review endpoint, not evidence of a deployed production site.

## Ranked next ideas beyond this tranche

These are not part of the accepted candidate and must not be represented as completed.

### Priority 1 — editorial/source approval required

1. Review every “Documented and reported events” item against direct sources. Remove, source, or more specifically label the approximate removal timing and reported litigation/political-response claims. This is the highest trust benefit and should precede catalogue expansion.
2. Decide whether the archive can support a genuinely dated public change log. Build it only with a durable source of truth and an operator commitment to maintain it; do not restore unsupported zero counters.
3. Verify the public contact mailboxes and settle retention/response capacity before expanding submission or correction promises.

### Priority 2 — content/schema decision required

1. Generalise the single hard-coded Amnesty loader and publisher-specific templates only when a second real collection is ready and a publisher-neutral schema/migration has been agreed.
2. Add explicit timeline-to-document relationships, then show record-specific events rather than collection-wide context. This requires sourced relationships in data, not template inference.
3. Add a simple document index once the catalogue grows beyond the current two records. Prefer an accessible static index before search or filtering.

### Priority 3 — research, rights, privacy, or infrastructure approval required

1. Offer full text/OCR only after rights review, versioned provenance, accessibility design, and explicit OCR-error labelling. Derived text must not be presented as publisher-original.
2. Publish machine-readable manifests only after agreeing a stable schema and version/generated-at semantics. A manifest should describe archive bytes, not certify original-file authenticity.
3. Add independent mirrors only after verifying each mirror and deciding who will maintain availability, rights, and privacy checks.
4. Consider search or advanced filtering only after catalogue growth demonstrates a real discovery problem; it is unnecessary for two records.

## Local review candidate

From `/home/abbie/Documents/git/streisandeffect.org`:

```sh
npm run build
npm run preview -- --host localhost --port 4321
```

Preview URL: `http://localhost:4321/`

At the time of final review, the preview returned HTTP 200. No production deployment is claimed.
