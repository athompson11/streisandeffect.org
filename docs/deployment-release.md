# Kubernetes static-byte release

Released: 2026-09-07
Release ID: `20260907T194559Z`
Scope: live static site bytes on the existing `streisandeffect-documents` Longhorn PVC only.

## Outcome

The reviewed current working tree was built and its non-document static output was published to the existing PVC. This was a PVC-hosted static-byte update, not an image rollout, Git push, Argo sync, manifest change, DNS change, firewall change, or Cloudflare configuration change.

The existing `streisandeffect-web` Deployment remained generation 1/revision 1 on `nginxinc/nginx-unprivileged:1.29-alpine`. Its existing pod `streisandeffect-web-7fd6c9c647-mq6nw` remained Ready (`1/1`), on `k8s-worker-02`, with zero restarts. No Nginx restart was required: the existing process served the replaced mounted files.

## Source and build baseline

- Git `HEAD`: `199a3a0c570b165345cd1a08d19f50fb456c55ea`.
- The release intentionally included the current uncommitted and untracked reviewed implementation, rather than only `HEAD`.
- Tracked working-tree binary diff SHA-256: `f0c341e7a367b15624fd726d650c15b6a2f215e5d7ca88e0e6a2812802e4822b`.
- `npm run check`: passed (22 Astro files; 0 errors, warnings, or hints; content validation passed).
- `npm run build`: passed (12 static HTML routes; content validation passed).
- `node --test tests/content-validation/*.test.mjs tests/ui/public-copy.test.mjs`: passed 8/8.
- `git diff --check`: passed before release and after release documentation.

The two archive PDFs were not included in the replacement payload. They were verified locally, on the mounted PVC before/after publication, and over normal public HTTPS and direct origin data paths after publication:

- `a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf`: 353758 bytes; SHA-256 `d11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387`.
- `like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf`: 411751 bytes; SHA-256 `f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f`.

## Backup and publication method

A same-node, restricted maintenance pod mounted the PVC read-write on `k8s-worker-02` while the web pod retained its read-only same-node mount:

- Pod: `streisandeffect-release-maint-20260907t194559z`.
- Created/Ready: 2026-09-07T19:46:27Z / 2026-09-07T19:46:28Z.
- Image: `nginxinc/nginx-unprivileged:1.29-alpine`.
- Security: UID/GID/fsGroup 101, `runAsNonRoot`, RuntimeDefault seccomp, no privilege escalation, all capabilities dropped.
- Local restorable non-document backup: `/home/abbie/Downloads/streisandeffect-release-artifacts/20260907T194559Z/site-root-before-20260907T194559Z.tgz`.
- Backup SHA-256: `69ae1dd77532287084de1989ea76b8a645cac19922ec49c8fe1f58355de36a33` (14091 bytes). It excludes `/documents` and preserves the prior served non-document tree.

The release payload was staged in a hidden PVC directory, verified hash-for-hash against the local build, then published with assets/CSS/sitemaps first and HTML last. Each target was written to a same-directory temporary path and renamed into place; old hashed assets were retained. No whole-root deletion occurred.

- Payload: `/home/abbie/Downloads/streisandeffect-release-artifacts/20260907T194559Z/site-payload-non-documents-20260907T194559Z.tgz`.
- Payload SHA-256: `7487afe4877476d267fb5ac124d2f1fbfd636cadbcd583fb94d6458c7d85ddd3`.
- Exact local/staged/PVC artifact manifests: `/home/abbie/Downloads/streisandeffect-release-artifacts/20260907T194559Z/site-payload-files-bytewise.sha256`, `site-payload-staged-files.sha256`, and `served-non-document-files-after-publish.sha256`.

## Published artifact manifest

```text
cb8bbb223431dea85f25d6b9e7c1dc1ef80911bc0e4cc74485803c6513ded655  ./_astro/BaseLayout.DdffxMpd.css
d3c69aded29eb8fcc764fc91a4a9e7f047b6620f81bcfdd22a93b77f45c11f45  ./about/index.html
e5a884f722571eff772e86bba1b169a0482d9cfdb52d34a6341a8b6d8141f109  ./accessibility/index.html
fcf0d9a796e64e07139d472b0826bd931f5569de605e6496441a510f7209d660  ./amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026/index.html
b80c620839867fe21bff20315f16f1bfdfc01c0ac1c21f8fe4a5ca29f8c53d29  ./amnestyinternational/index.html
3c12e74da19012d91d3d8932056b0970fbfa5290e358c6e9b6f125fcda4b652e  ./amnestyinternational/like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026/index.html
657d7133ce79b2c1be087c9a4434e98fdf8dc65b416e4a4f6864274acd7502e2  ./collections/index.html
1b37c843805fab6f2a8a87ce4241b47388619efd2f9e8fdba934e0601972edda  ./favicon.svg
6031419d765fcf872d976ec19292435b1c3d0f9e58957310b3f63c607bf2fc8a  ./index.html
f43661353686f041025b347b669f511e850a0b4e6864c7bf513c39b8e421281f  ./legal/index.html
622c5651bdf0afeb9ac3dd0c7c7c110a4678491f8ea057dfc47a31a6ea8912e2  ./privacy/index.html
b3f5848729e8902da4bbc2552fc20c52475be89f97050fd5becf44fbe60d2381  ./robots.txt
c062a43ee4b8f8799004ad8c70933a9be2107a2e7812f8719a7f2192cf6657ad  ./sitemap-0.xml
7f84d1304e5bb756edf37dfc5cdcd7bdea1e88faf6b5c56d52b9008523b46fa5  ./sitemap-index.xml
0704537173eb240200b433739035359fa668f7038e26652eeaa252ce02453a4b  ./social-preview.svg
cf10f5c403c26c5eaf949ac786838d88e7127946a815498ceebe98c0b4ae2460  ./submit/index.html
d3fc2c4c5190ef4dbd467433ba3d26c80f48298942a17b91474581872c4c366b  ./transparency/index.html
bd824a21f87dc217fe8681b324a7fb516305920de7ed6041f6ac97b826dcaec4  ./verify/index.html
```

## Live verification

- All 12 generated HTML routes returned normal public HTTPS 200: `/`, `/collections/`, `/amnestyinternational/`, both document records, `/about/`, `/accessibility/`, `/legal/`, `/privacy/`, `/submit/`, `/transparency/`, and `/verify/`.
- The direct Traefik origin data path (`10.10.0.100` with the public Host/SNI) returned HTTP 200 and byte-matched the built output for all 12 routes. Its certificate did not cover `streisandeffect.org` when contacted directly, so this direct check used an insecure TLS client solely to verify origin bytes. Normal public HTTPS verified successfully.
- Normal public HTTPS returned both PDFs with `application/pdf`, valid TLS, expected size, and the SHA-256 values above. Same-origin local links, CSS, favicon, pages, and PDF URLs returned 200 in the release audit.
- Latest theme/copy/TOC/no-card markers passed: home heading, Privacy and submission headings, record `On this page` navigation, and absence of `document-card`, `metadata-panel`, and `status-banner` selectors. The public stylesheet matched the release SHA-256 above. `no-referrer` was present on all 12 pages.
- Public checks confirmed no owner-facing placeholder phrases and no standalone `AI`/`LLM` copy in the generated site.
- Internal-only paths returned 404 after cleanup: `/docs/editorial-review.md`, `/qa-artifacts/deploy-manager/preflight.json`, `/.release-stage-20260907T194559Z/index.html`, and `/site-root-before-20260907T194559Z.tgz`.

## Edge caveat and follow-up boundary

The PVC/origin site bytes are exact. The browser-visible public edge response is not byte-identical to the static build because Cloudflare injects its external `https://static.cloudflareinsights.com/beacon.min.js/v31edd6df95cf4e85bb4c19e7a9bdbcba1788362987495` beacon on all reviewed pages. Cloudflare also applies same-origin email-obfuscation resources to `/accessibility/`, `/legal/`, and `/submit/`; their visible text comparison differs for that edge transform only. This release therefore does not pass a no-third-party-request/privacy gate and does not claim public HTML byte identity.

The separate targeted edge-analytics follow-up is `t_2ba42222`. It is outside this release: no DNS, WAF, Cloudflare, or unrelated homelab change was attempted here.

## Cleanup and rollback

The hidden staging directory and maintenance pod were deleted. The final resource check returned `NotFound` for the maintenance pod. The original web pod and Deployment remained healthy.

Rollback is a bounded PVC restore: schedule a same-node restricted maintenance pod, copy `/home/abbie/Downloads/streisandeffect-release-artifacts/20260907T194559Z/site-root-before-20260907T194559Z.tgz` into its temporary filesystem, and extract it at `/usr/share/nginx/html` while excluding `/documents`. Restore only paths listed by `served-non-document-files-before.txt`; do not overwrite `/documents` or unknown operator-added files. The backup, manifest, live specs, verification JSON, and cleanup evidence remain under `/home/abbie/Downloads/streisandeffect-release-artifacts/20260907T194559Z/`.
