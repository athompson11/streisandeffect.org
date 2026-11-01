# Privacy review — modern reader interactions

Date: 2026-09-07
Scope: local production build only; no deployment or external-service probing.

## Result

Pass. The reviewed static build satisfies the reader-privacy contract for local behavior:

- No analytics, pixels, fingerprinting, remote font/runtime resources, embeds, preconnect/prefetch, automatic external API requests, visitor identifiers, reading history, cookies, or tracking banner were found.
- Fresh browsing and navigation without a choice left `se-theme` absent. Browser resource timings showed same-origin CSS/favicon only, and hooks for fetch, XHR, WebSocket, EventSource, beacon, and Permissions API observed zero calls.
- Explicit Light/Dark persisted only `se-theme=light|dark`; System removed the key and returned to CSS system theming. Denied local storage did not break reading or the selector.
- Clipboard writes occur in explicit copy-button handlers only; no clipboard-read code exists. Success and failure feedback behaved as intended with a test shim.
- Every one of 12 emitted HTML pages has `<meta name="referrer" content="no-referrer">`. External Amnesty URLs are ordinary anchors and were not loaded or followed by the site.
- The privacy notice accurately discloses static browsing, possible hosting/network logs, the exact local theme setting, explicit clipboard actions, and email risks without unsupported anonymity/no-log claims. Legal copy is visitor-facing rather than owner-directed instruction.

## Evidence

- Full local behavior record: `qa-artifacts/privacy-review/behavior-evidence.md`
- Machine-readable built-output scan: `qa-artifacts/privacy-review/build-scan.json`
- Reproducible scanner: `qa-artifacts/privacy-review/build-scan.mjs`
- `npm run build` passed: Astro check had 0 errors, warnings, and hints; 12 pages built; content validation passed.
- `node --check qa-artifacts/privacy-review/build-scan.mjs && node qa-artifacts/privacy-review/build-scan.mjs` passed; the scan found no external runtime resource mechanism and no emitted `dist/docs` directory.

## Scope limitations

This does not certify production CDN/host/DNS/security/email logging, response headers, or external-link behavior after deployment. No external service was contacted during the audit. Re-run the review after changes to client code, dependencies, third-party assets, privacy copy, or hosting policy.
