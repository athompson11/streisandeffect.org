# Site evaluation and prioritised improvements

## Scope and evidence

This is an audit only. It preserves the user's uncommitted deletion of the homepage section headed “How to read this archive” in `src/pages/index.astro`; that section must not return in another form on the homepage.

Evidence reviewed:

- The manager-owned contract in `docs/site-improvement-brief.md`.
- All public Astro pages, the shared layout and stylesheet, and the Amnesty YAML loader/data at `src/data/archive.ts` and `content/collections/amnestyinternational/archive.yaml`.
- A locally built and served candidate at `http://localhost:4321/`: homepage, collection, one document record, About, and Verify were inspected in a browser. The two document records share one template; this is not a claim that their PDF contents were inspected.
- At a 320px viewport, the document page had no horizontal overflow (`documentElement.scrollWidth` and `body.scrollWidth` were both 320px); header and footer navigation controls rendered at 44px minimum height. The skip link became visible when focused. Existing section headings have no useful anchors and have `scroll-margin-top: 0`.

This audit does not validate PDF bytes, file sizes, PDF accessibility tags, or external claims. That work belongs to the platform/browser lanes described in the brief.

## Summary

The site has a coherent paper/ink/red starting point, concise route structure, semantic landmarks, visible focus styling, wrapped long strings, and a clear integrity/authenticity distinction. It still renders its central collection and record content as rounded, bordered, shaded cards. Collection context is thoughtful but delays the two actual documents; the record page repeats collection-wide timeline material and leaves no local wayfinding. The data labels successfully distinguish several source types, but “Verified events” currently includes explicitly uncertain or uncited assertions, undermining the promised evidence boundary.

The fixed first tranche is appropriate. It can be implemented without schema or product choices by converting the existing templates to open editorial sections, adding fixed anchors/breadcrumbs, moving the existing document list earlier, and adding small progressive client enhancements for record-copy tools, a theme selector, and current-section indication. The modern-design direction should update the whole site through coherent tokens and interactions, not turn the archive into a retro skin or an analytics-driven application.

## Findings and safe corrections

### 1. Content-card styling remains the primary UX and contract failure

Evidence:

- The homepage and both collection listings render each collection as `article.document-card` (`src/pages/index.astro:24-49`, `src/pages/collections/index.astro:16-42`), and the collection page uses the same card for both documents (`src/pages/[collectionSlug].astro:91-123`).
- The browser confirmed a 1px full border, 12px radius, white surface background, and shadow on each document card.
- Record provenance, verification, and download sections are three separate `metadata-panel` boxes (`src/pages/[collectionSlug]/[documentSlug].astro:70-127`). The browser confirmed each has a full border, 12px radius, and shaded background.
- Warnings, publisher statements, editorial notes, content notes, and status notices are also boxed classes in the templates and stylesheet (`src/pages/[collectionSlug].astro:42-66,85-89`; `src/pages/[collectionSlug]/[documentSlug].astro:48-68,109-118,146-171`; `src/styles/global.css:291-317,497-565,634-645`).
- About and Verify retain a responsive `.grid` of `.card` items (`src/pages/about.astro:23-49`, `src/pages/verify.astro:13-27`; `src/styles/global.css:250-254`). The current `.card` itself is visually open, but a tile grid remains contrary to the editorial-layout direction.

Safe correction for the coder:

- Remove the full-box treatment rather than restyling it subtly: no surface background, full border, radius, or shadow for document entries, metadata, editorial text, or warnings.
- Use stacked `article`/`section` content separated by horizontal rules. Use ordinary `dl`/table rows for status and provenance. Retain real button appearance for actual buttons only.
- Render withdrawal/status warnings as a text-labelled `aside` with one accent or warning side rule, not a panel. Keep the withdrawal notice immediately before every download link.
- Convert the About inclusion criteria and Verify operating-system commands to ordinary stacked lists or definition lists; do not replace the grid with differently styled tiles.
- Keep `overflow-wrap:anywhere` for URLs, filenames, and hashes, but remove the shaded/radius “code chip” treatment from checksums (`src/styles/global.css:398-411,634-645`).

Priority: Now. Benefit: high; effort: medium; prerequisite: none.

### 2. The two documents are less discoverable than the surrounding context

Evidence:

- On the collection route, the reader passes the hero/status, content warning, publisher statement, full six-event timeline, and archive editorial note before reaching Documents (`src/pages/[collectionSlug].astro:37-93`).
- On the homepage and `/collections/`, readers can only open the collection, not either named document (`src/pages/index.astro:24-49`, `src/pages/collections/index.astro:16-42`).
- The current data contains one collection and two documents, so large-catalogue treatments such as search, filters, or a dominant “browse” interface would add complexity without reader benefit.

Safe correction for the coder:

- Homepage: after the short archive introduction, show the existing collection as an open editorial entry and name/link its two document records directly. Keep the collection link as context, not a mandatory intermediate step.
- Collection: retain the publisher/withdrawal status before the document list, then place the two document entries before timeline, archive analysis, source material, and external response. Do not put raw download links in that list; link only to record pages.
- Each short document entry needs only title, known publication date, publisher/withdrawal status, one neutral sentence, and a “View record” prose link. Move long hash/provenance material to the record page.
- Do not reinstate or paraphrase the deleted homepage editorial-position block.

Priority: Now. Benefit: high; effort: small to medium; prerequisite: card-removal pass.

### 3. Breadcrumbs, section anchors, and a local table of contents are missing

Evidence:

- Collection and record pages do not render breadcrumb navigation (`src/pages/[collectionSlug].astro`, `src/pages/[collectionSlug]/[documentSlug].astro`).
- Most sections have no IDs. The collection has only `timeline-heading`, `documents-heading`, and `sources-heading`; the record has only `timeline-heading` (`src/pages/[collectionSlug].astro:68-92,125-127`; `src/pages/[collectionSlug]/[documentSlug].astro:129-131`).
- Current headings have no scroll margin. On desktop the shared header is sticky (`src/styles/global.css:84-90`), so added fragment links would otherwise land beneath it.

Safe correction for the coder:

- Add a semantic breadcrumb `<nav aria-label="Breadcrumb">`: `Home / Collections / [collection]` on collections and `Home / Collections / [collection] / [document]` on records. Use canonical existing paths only.
- Give meaningful major record sections stable IDs: `status`, `publisher-statement`, `provenance`, `verification`, `downloads`, `timeline`, `archive-note`, `sources`, and `corrections`. Use a compact inline “On this page” list immediately after the record summary; it should link only to present sections.
- Give collection sections similarly meaningful IDs, but keep its contents list compact because it has only two documents.
- Apply a desktop `scroll-margin-top` that clears the sticky header; leave mobile compatible with the existing static header at 720px and below. Do not add decorative anchor glyphs or duplicate headings.

Priority: Now. Benefit: high for long records and deep links; effort: small; prerequisite: final section order.

### 4. Record trust information is useful, but its hierarchy and duplication dilute the most important notice

Evidence:

- The record shows status in the opening box, then repeats it in a second box immediately above Download (`src/pages/[collectionSlug]/[documentSlug].astro:48-57,106-118`). The second placement is necessary; the first need not be a separate panel.
- Publisher context is before Downloads, and the checksum caveat accurately says a matching hash only verifies bytes against this archive copy, not authorship/authenticity (`src/pages/[collectionSlug]/[documentSlug].astro:60-68,101-103`). These must be preserved.
- The record repeats the full collection-wide timeline, including the other report’s May publication, for every document (`src/pages/[collectionSlug]/[documentSlug].astro:129-144`).
- A missing original publisher URL and missing verified Internet Archive capture are transparently disclosed in the provenance table (`src/pages/[collectionSlug]/[documentSlug].astro:83-84`); that is stronger than substituting an inferred URL.

Safe correction for the coder:

- Use one concise opening withdrawal/status line and a second, adjacent single-rule withdrawal notice immediately before the actual download control. The download-adjacent notice is the non-negotiable one.
- Keep publisher statement, provenance, verification, and archive analysis visibly labelled as different evidence layers, but make each an open section rather than a panel.
- On a document record, either show only timeline entries directly tied to that document after data support exists, or replace the repeated collection timeline with a link to the collection’s full timeline. Do not silently claim per-record event relationships without data.
- Keep the existing checksum authenticity caveat verbatim in meaning; make the actual hash selectable as plain text even before any JS enhancement.

Priority: Now. Benefit: high; effort: medium; prerequisite: section anchors and final document/collection ordering.

### 5. Evidence labels overclaim certainty in the current timeline and some publisher-context prose

Evidence:

- The label “Verified events” wraps all six entries (`src/pages/[collectionSlug].astro:68-83`; record repetition at `src/pages/[collectionSlug]/[documentSlug].astro:129-144`).
- “July report removed soon after publication” says the timing was “reported” and approximate unless a dated capture or primary source is linked, but supplies neither source URL nor source label (`content/collections/amnestyinternational/archive.yaml:56-60`). It is not presently a verified event.
- “Complaints, threatened litigation, and political responses followed publication” says direct reporting of threatened litigation has not yet been verified (`archive.yaml:61-69`). Its linked Amnesty statement supports concerns raised, not the full heading or all of its asserted responses.
- `amnesty_position` says withdrawal occurred “after public complaints and reported threatened legal action,” then later disclaims sole-cause attribution (`archive.yaml:81-86`). The temporal/causal framing is stronger than the cited publisher statement as represented in this data.
- “Archive copies obtained and added” describes an operator-local-file action without an external source (`archive.yaml:77-80`). It belongs in archive provenance, not a list headed Verified events.

Safe correction for the content owner, once source review is available:

- Rename the timeline section to “Documented and reported events” and label each item by basis, or split it into “Documented events”, “Publisher statement”, “Archive provenance”, and “Reported/uncertain events”. Do not retain “Verified” as a blanket label.
- Move the unlinked 48-hour removal assertion and unverified litigation/political-response assertion out of documented events until a direct, relevant source URL is added. If retained as context, label them “reported; source not yet linked” without adding a false citation.
- Rephrase the collection publisher summary to separate facts: Amnesty withdrew the reports; Amnesty acknowledges concerns; the archive has not established whether any legal pressure caused withdrawal. Avoid “after” unless chronology is explicitly sourced.
- Move the operator-obtained date to provenance/archive status. It is a useful self-described fact, but it is not external verification.

Priority: Now. Benefit: high for credibility; effort: small; prerequisite: editorial/source decision. No new facts should be invented to fill the gaps.

### 6. Some copy promises ongoing institutional process without an observable record

Evidence:

- “The archive will add [links] when direct source URLs are verified” promises a future process despite there being no additional public source (`archive.yaml:93-96`).
- About promises that changes and file replacements “are dated and recorded” and that files are not silently replaced (`src/pages/about.astro:62-66`); Legal makes the same operational commitments (`src/pages/legal.astro:56-64`).
- Transparency reports zero requests, open requests, replaced files, and disabled downloads, but there is no public log data source in the repository; it is static copy (`src/pages/transparency.astro:14-24`).
- The accessibility page says PDFs “report as tagged in local metadata inspection” (`src/pages/accessibility.astro:25-29`), but this audit intentionally did not validate those PDF claims.

Safe correction for the content owner:

- State only currently visible facts. For example, replace the forward-looking additional-reporting sentence with “No additional independently verified reporting, criticism, or rebuttal links are listed here.”
- Before a dated, versioned public change log exists, describe correction/version practices as an intention or remove guarantees. Replace the numeric transparency summary with “No public log entries are currently listed” unless a durable source of truth supports the counts.
- Remove or qualify the PDF tagged-metadata statement until a reproducible accessibility inspection result is published or linked. Do not make the page assert a PDF accessibility property merely because the HTML shell is accessible.

Priority: Next (copy correction can be done alongside Now); benefit: medium-high; effort: small; prerequisite: operator decision on what public commitments can be supported.

### 7. Accessibility baseline is sound, but reader tools and print path are absent

Evidence:

- The shared layout supplies a skip link, landmarked header/nav/main/footer, and current-page state (`src/layouts/BaseLayout.astro:62-92`); global CSS supplies a visible focus outline and underlined prose links (`src/styles/global.css:53-67`).
- Local 320px inspection found no horizontal overflow, and long values are intentionally allowed to wrap (`src/styles/global.css:624-632`).
- No `@media print` rule exists in the stylesheet. There are no `button` elements or client scripts on record pages, so Copy citation and Copy SHA-256 do not yet exist (`src/pages/[collectionSlug]/[documentSlug].astro`).
- Header and footer navigation have 44px targets, as does the download button. Conventional inline links do not have 44px minimum height, which is acceptable for prose but means any new action control must be a real, adequately sized button.

Safe correction for the coder:

- Add visible, keyboard-operable real buttons for “Copy citation” and “Copy SHA-256”. Keep the citation and hash in selectable text regardless of JS; on clipboard failure, report a concise status without hiding the value or blocking selection.
- Generate citation text from existing fields only: title, publisher, known date as stored (keep May 2026 as month precision), canonical record URL, and the withdrawn-preserved-copy wording only where status supports it. Do not introduce a review date into the citation.
- Add print CSS that hides site navigation, skip link, footer navigation, and action controls while retaining record title, publisher/withdrawal status, provenance, record URL, download URL, and full checksum. Avoid fixed-height/overflow rules that clip table cells or hashes.
- Browser QA should test no-JS reading, keyboard focus/order, success and clipboard-failure paths, 320/375px plus desktop, 200% zoom, and printed output after implementation.

Priority: Now. Benefit: high for research use and accessibility; effort: medium; prerequisite: final record section structure.

### 8. Modern design, theming, motion, and privacy need a bounded shared implementation

Evidence:

- The current shared CSS is light-only (`:root { color-scheme: light; }` in `src/styles/global.css:1-29`) and has no theme-switching model, `prefers-color-scheme` media rule, or component control.
- There is no client script in the layout or record template for a theme choice, current TOC section, or copy feedback (`src/layouts/BaseLayout.astro:42-94`, `src/pages/[collectionSlug]/[documentSlug].astro:40-180`).
- The layout does not declare a `referrer` meta policy (`src/layouts/BaseLayout.astro:44-60`). Its static HTML and local CSS make no explicit third-party runtime request, but browser QA must check the final build rather than infer request behavior from source alone.
- Privacy currently accurately distinguishes the static site from possible hosting/network logs (`src/pages/privacy.astro:14-25`), but it does not describe a stored theme preference or explicit clipboard actions because neither exists yet.

Safe correction for the coder:

- Treat the existing warm paper/ink/red values as a starting point, not frozen brand constraints. Establish a compact light/dark token set, including adequate text/link/focus/status contrast in both themes. Use `prefers-color-scheme` so System works entirely in CSS before JS loads.
- Add one compact, accessible System/Light/Dark control in the shared masthead or another consistent shared location. It must be ordinary semantic controls, support keyboard operation, and never become a decorative pill cluster. Only an explicit Light or Dark selection may write `localStorage['se-theme']` as `light` or `dark`; System removes that key. Storage errors must leave the page readable and controls usable.
- Keep all informational routes within the same responsive editorial system: a clean masthead, deliberate type/spacing/color hierarchy, modern hover/focus states, and open alignment grids where useful. This permits a 2026 visual refresh without card grids, oversized billboard type, gradients/glass, remote fonts, or a faux-retro interface.
- Add short, reduced-motion-safe transitions only to helpful interactive states. Disable non-essential transitions and smooth scrolling under `prefers-reduced-motion`; do not add scroll hijacking, parallax, autoplay, reveal-gated prose, or view-transition dependencies.
- Implement the current-section state only for the local record/collection TOC with a lightweight observer. Plain fragment anchors must remain correct without JS, and the observer must not collect reading state.
- Add `<meta name="referrer" content="no-referrer">` in the shared layout. Do not add preconnect, prefetch, third-party embeds, analytics, remote fonts, tracking, accounts, or remote APIs. Copy actions must write to the clipboard only after an explicit button click.
- Update Privacy only after the feature exists: state the exact local theme key/value behavior and that explicit copy actions use the browser clipboard, retain the hosting/network-log caveat, and do not promise anonymity or zero logs. Any changed privacy-page date must be set from the actual current date at implementation time, not fabricated here.

Priority: Now. Benefit: high for a coherent current design without surveillance; effort: medium; prerequisite: shared layout/CSS ownership and browser verification of storage, requests, no-JS, themes, and reduced motion.

### 9. Current loader/data shape is intentionally single-publisher and should remain so in this tranche

Evidence:

- `loadCollections()` reads exactly `content/collections/amnestyinternational/archive.yaml` and returns a one-item array (`src/data/archive.ts:104-116`).
- The collection template embeds Amnesty-specific text and a hard-coded publisher statement URL (`src/pages/[collectionSlug].astro:61-66`); the document template does the same (`src/pages/[collectionSlug]/[documentSlug].astro:60-68`).

Safe correction now:

- Do not generalize the loader or templates during the UI tranche. Keep current URLs and YAML schema unchanged.
- Avoid repeating the hard-coded Amnesty copy in new components; pass through existing collection/document values where possible so the eventual generic-template work has a smaller migration surface.

Priority: Next. Benefit: high only when a second collection/publisher is ready; effort: medium-high; prerequisite: a settled publisher-neutral data model and content migration plan.

## Fixed first tranche: implementation-ready checklist

The coder can implement the manager’s decisions without new product choices by doing the following in this order:

1. Establish a modern shared editorial system in `src/styles/global.css` and `BaseLayout`: light/dark/system-capable color tokens, coherent type/space hierarchy, reading widths, open alignment grids, section rules, compact labels, open document rows, an allowed one-side-rule notice, visible focus/hover states, wrapped long values, action controls, anchors, and print rules. Delete/rework full card/panel/tile-grid rules rather than layering overrides.
2. Rework `src/pages/index.astro`, `src/pages/collections/index.astro`, and `src/pages/[collectionSlug].astro` into named open document entries. Put the two document links early, with collection publisher/withdrawal context ahead of the collection-page list and no raw download links there.
3. Add breadcrumbs, stable section IDs, compact `On this page` links, and sticky-header-safe fragment offsets to collection and document templates.
4. Rework the document template into labelled open sections. Preserve the publisher context, download-adjacent withdrawal notice, missing-original-URL disclosure, and checksum/authenticity caveat. Avoid repeating a collection-wide timeline as if it were document-specific.
5. Add progressively enhanced Copy citation and Copy SHA-256 controls, with native selectable fallbacks and accessible success/failure messaging. Add a keyboard-accessible System/Light/Dark theme selector with the exact explicit-choice `se-theme` storage rule, no-referrer meta policy, a current-TOC-section indicator, reduced-motion-safe interactions, and print CSS in the shared stylesheet. Update Privacy only for the implemented local theme/clipboard behavior.
6. Do not edit YAML, PDF files, canonical routes, the existing validation scripts, or the user’s homepage deletion in this UI lane. Coordinate the evidence-label corrections with the content owner and byte checks with the platform lane.

## Ranked roadmap beyond the fixed tranche

### Now

1. Full-site modern editorial presentation, system/light/dark themes, privacy-preserving progressive interactions, early document links, breadcrumbs/anchors, reader-copy tools, and print CSS.
   - Benefit: high. Makes the existing two-document catalogue current, readable, trustworthy, navigable, and research-ready without surveillance.
   - Effort: medium.
   - Prerequisites: none beyond the fixed decisions; preserve the current data/routes.

2. Correct the “Verified events” and unsupported-process wording.
   - Benefit: high. Clear uncertainty labels are the archive’s strongest trust signal.
   - Effort: small.
   - Prerequisites: content/editorial owner must decide whether to remove, relabel, or source the uncertain assertions. No invented citations.

3. Platform byte validation and focused fixture tests.
   - Benefit: high. Turns currently syntax-only hash checking into a real local-file integrity guard.
   - Effort: medium.
   - Prerequisites: platform lane ownership; no network dependency and no mutation of real PDFs in tests.

### Next

1. Publisher-neutral collection discovery and templates.
   - Benefit: high once there is a second real collection; prevents hard-coded Amnesty behavior from spreading.
   - Effort: medium-high.
   - Prerequisites: settled YAML schema, migration plan, and at least one additional supported publisher/collection. Do not do it speculatively now.

2. A small-catalogue document index, before search.
   - Benefit: medium now, high after several collections. An alphabetic/date/status index provides a simple direct route to records without a misleading search UI.
   - Effort: small-medium.
   - Prerequisites: more than the present two-document catalogue and a decision on which existing metadata is safe to index.

3. A genuinely dated public change log.
   - Benefit: medium-high for version/provenance trust.
   - Effort: medium.
   - Prerequisites: operator commitment to maintain it, a durable source of truth, privacy/safety rules for disclosure, and a correction/version schema. Do not retain numeric zero counters without that source.

4. Per-record timeline filtering.
   - Benefit: medium. It stops unrelated event repetition and makes individual records shorter.
   - Effort: medium.
   - Prerequisites: explicit, sourced data relationships from timeline items to document slugs and an editorial decision for collection-level events.

5. Safer correction/submission workflow refinement.
   - Benefit: medium. The current email-first route communicates risks well; improvements should not accidentally promise anonymity or response times.
   - Effort: medium.
   - Prerequisites: privacy/retention policy and operator capacity decision; no external form/service by default.

### Later

1. Full-text/OCR with provenance.
   - Benefit: potentially high for accessibility and research.
   - Effort: high.
   - Prerequisites: rights assessment, source/PDF version control, explicit OCR-error labelling, accessible presentation, and a decision about whether derived text may be hosted. It must not be represented as publisher-original text.

2. Downloadable machine-readable manifests.
   - Benefit: medium for reproducibility and reuse.
   - Effort: medium-high.
   - Prerequisites: stable public schema, clear generated-at/version semantics, local byte validation, and a privacy/security review of fields exposed. It should describe archive bytes, not assert original-file authenticity.

3. Additional independently verified mirrors.
   - Benefit: conditional resilience value.
   - Effort: high and ongoing.
   - Prerequisites: rights/legal/privacy review, a documented verification policy, source attribution, and an operator decision to maintain links. Do not call a link an independent mirror until it is actually verified.

4. Search, expansive filtering, or other large-archive affordances.
   - Benefit: low for two records.
   - Effort: variable.
   - Prerequisites: a larger, stable catalogue and a demonstrated discovery problem. The next useful step is a small index, not a generic search stack.

## Verification completed for this audit

- `npm run check` — passed: Astro check reported 0 errors, 0 warnings, 0 hints; `validate-content` reported “Content validation passed.”
- `npm run build` — passed as part of the local preview launch: Astro built 12 pages and content validation passed.
- Local built-site inspection completed at desktop and 320px for the routes named in Scope and evidence.
- Working-tree inspection confirmed the preserved user edit removes only the homepage “How to read this archive” section in `src/pages/index.astro`. This audit added only `docs/site-evaluation.md`; other shared-workspace changes are outside this task.

The audit was updated after the operator's contract update: modern, dynamic, privacy-preserving full-site design; light/dark/system themes; local-TOC indication; reduced-motion-safe interactions; no-referrer; and accurate privacy copy are now Now-scope implementation criteria. This replaces the earlier conservative palette/no-animation framing, while preserving every evidence, no-card, no-deployment, no-surveillance, and no-JS-reading constraint.

Remaining verification owned elsewhere: exact PDF byte size/SHA-256 validation, PDF accessibility inspection, no-JS/clipboard/print/theme/TOC behavior after implementation, actual storage and same-origin-request checks, reduced-motion behavior, complete public-route browser QA, and final review of changed content against cited external sources.
