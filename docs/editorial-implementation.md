# Editorial implementation handoff

## Implemented

- Replaced the public-site boxed card/panel treatment with open editorial entries, horizontal rules, tables, definition lists, and single-side-rule notices. The shared presentation now has contemporary light/dark tokens, a responsive masthead, focused link/control states, and reduced-motion handling without external fonts, services, or tracking.
- Added an explicit System/Light/Dark selector. System uses CSS `prefers-color-scheme`; only explicit Light/Dark choices attempt local storage under `se-theme`, and System removes it. Storage failure leaves the page usable.
- Added `no-referrer` metadata, readable mobile navigation, and truthful privacy text for the local theme setting and explicit clipboard actions.
- Moved document discovery forward on the homepage and collection page. Collection publisher context precedes the document list, record links do not expose download URLs, and longer timeline/source/editorial material follows the records.
- Added breadcrumbs, stable section IDs, compact on-page anchors, header-safe fragment offsets, and a client-side current-section indicator that leaves plain anchors fully functional without JavaScript.
- Reworked document records into labelled open sections; preserved publisher status before each download, provenance uncertainty, and the SHA-256 authenticity caveat. Collection-wide chronology is linked rather than repeated as document-specific.
- Added selectable citation and checksum values plus progressive Copy citation/Copy SHA-256 controls with accessible success and failure announcements. Citation uses the stored title, publisher, known publication date, canonical record URL, and withdrawn-copy qualifier.
- Added print rules that omit navigation and action controls but retain record content, provenance, URLs, and checksum values.
- Applied presentation-only evidence fixes: the timeline is now labelled “Documented and reported events,” not “Verified events,” and a dynamic future-source promise is not rendered. No YAML facts or PDFs were edited.
- Rewrote the public legal page from owner-facing workflow instructions into visitor-facing request information. Removed unsupported public change-log counts/promises and the unverified PDF-tagging assertion. Added a rendered-HTML regression test for known owner-directed/placeholder phrases.

## Files changed

- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/scripts/archive-ui.ts`
- `src/pages/index.astro`
- `src/pages/collections/index.astro`
- `src/pages/[collectionSlug].astro`
- `src/pages/[collectionSlug]/[documentSlug].astro`
- `src/pages/about.astro`
- `src/pages/accessibility.astro`
- `src/pages/legal.astro`
- `src/pages/privacy.astro`
- `src/pages/submit.astro`
- `src/pages/transparency.astro`
- `src/pages/verify.astro`
- `tests/ui/public-copy.test.mjs`

## Verification

- `npm run check` — passed: Astro reported 0 errors, 0 warnings, 0 hints; content validation passed.
- `npm run build` — passed: 12 static pages built; content validation passed.
- `node --test tests/ui/public-copy.test.mjs` — passed: built public HTML contains none of the focused known owner-directed/placeholder phrases.
- `git diff --check` — passed.
- Local browser smoke against `npm run preview` — all 12 rendered public routes and both hosted PDFs returned HTTP 200.
- Browser checks confirmed no-card computed styles on homepage and document entries: transparent backgrounds, zero radius/shadow, horizontal rules only; notices have only a left rule. The document record exposes breadcrumbs, seven plain TOC anchors, both copy tools, the full selectable citation/checksum, the download-adjacent withdrawal status, and `meta[name=referrer]` set to `no-referrer`.
- Browser interaction checks confirmed explicit Dark stores `se-theme=dark`, System removes it, copy success announces success, simulated clipboard failure announces manual-selection guidance, 320px record layout has no horizontal overflow, print CSS hides header/action tools while retaining the 64-character checksum, and disabling JavaScript leaves citation, checksum, TOC anchors, and theme select readable.

## Public-copy review

Read the shared layout, every static page, collection output, and record output. The remaining visitor-directed language is limited to legitimate actions such as submitting a correction, avoiding sensitive email attachments, or verifying a checksum. The archived PDF bytes were not altered.

## Caveats for downstream QA

- The browser harness did not permit programmatic document scrolling during this implementation run, so the visual scroll transition of the TOC indicator needs independent browser QA. The client script uses both `IntersectionObserver` and passive scroll/resize updates; fragment anchors themselves remain plain HTML links.
- The separate browser/security/review lanes still own exhaustive visual/theme/request/storage/print acceptance and final release review. This is a local built candidate only; no deployment was performed.
