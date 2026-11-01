# Final CSS correction verification

## Scope

Only `src/styles/global.css` was changed for this correction. It adds the theme-aware `--accent-action-ink` token and changes the desktop H1 clamp maximum from `4rem` to `3.2rem`.

## Primary-action contrast

The document-record `a.button` was inspected at `http://localhost:4321/amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026/` using browser computed styles. The normal fills/text were:

| Theme | State | Fill | Text | WCAG contrast |
| --- | --- | --- | --- | --- |
| Light | normal/focus-visible | `#9b2721` (`rgb(155, 39, 33)`) | `#fff` (`rgb(255, 255, 255)`) | 7.761:1 |
| Light | hover | `#701b17` | `#fff` | 11.302:1 |
| Dark | normal/focus-visible | `#f28b82` (`rgb(242, 139, 130)`) | `#1b1b1d` (`rgb(27, 27, 29)`) | 7.199:1 |
| Dark | hover | `#ffb3aa` | `#1b1b1d` | 10.057:1 |

The browser inspection confirmed that `.button:hover` uses `var(--accent-hover)` and `var(--accent-action-ink)`. Focus-visible retains the normal filled-action colors and adds the existing visible focus outline; it therefore has the same fill/text contrast as the normal state. Ratios were calculated in browser JavaScript with WCAG relative luminance (`sRGB` linearization and `(L1 + 0.05) / (L2 + 0.05)`). Every normal, hover, and focus-visible fill/text pair exceeds the 4.5:1 normal-text requirement.

## Heading and visual regression

- Desktop record H1 computed at 1280px: `51.2px` (3.2rem), within the 3.25rem ceiling.
- Narrow Dark record H1 computed at 320px: `33.6px` (2.1rem); `scrollWidth` and `innerWidth` were both 320px, so there was no horizontal overflow.
- Visual review at 1280 × 633 found modest editorial headings with no clipping or overlap on Home, Collection, and Record. The H1s no longer read as billboard headings. The record action remains square-cornered and distinct.
- Dark 320px record view remained readable with no clipping or card-like content box.
- Computed-style no-card regression inspected Home, Collection, Record, and Legal: 25 targeted `.document-entry`, `.record-entry`, `.editorial-section`, `.notice`, `.timeline`, and `.source-list` elements had zero card-like cases (no opaque fill, nonzero radius, or shadow).

Screenshots:

- `home-1280-dark.png`
- `collection-1280-dark.png`
- `record-1280-dark.png`
- `record-320-dark.png`

## Commands

- `npm run check` — passed: Astro 0 errors, 0 warnings, 0 hints; content validation passed.
- `node --test tests/content-validation/*.test.mjs tests/ui/public-copy.test.mjs` — passed: 8/8 tests.
- `npm run build` — passed: 12 static pages built; content validation passed.
- `git diff --check` — passed.

No content, public PDF, or YAML files changed relative to `199a3a0`.
