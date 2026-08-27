# Provider Failover Runbook

Use this when Cloudflare, the static host, the storage provider, or another vendor disables service after a false DMCA, abuse report, policy dispute, or outage.

## Keep ready before an incident

- Domain registrar login outside Cloudflare.
- Exported DNS zone file or documented records.
- At least one alternate static hosting target.
- At least one alternate document storage provider.
- Local copy of `dist/` from the latest known-good build.
- Local/offsite copies of every hosted file.
- Checksums and document metadata in Git.

## If Cloudflare is unavailable but registrar still works

1. Build the static site:

   ```fish
   npm run build
   ```

2. Deploy `dist/` to the standby static host.
3. Promote non-Cloudflare document mirror URLs if Cloudflare-proxied downloads are broken.
4. Change registrar nameservers or DNS records to the standby provider.
5. Publish a transparency entry describing provider impact and mitigation.

## If primary object storage is unavailable

1. Confirm whether CDN cache still serves existing documents.
2. Promote mirror URLs in document metadata.
3. Rebuild and redeploy the static site.
4. Invalidate CDN cache for affected document pages.
5. Add a transparency log entry.

## If a legal notice targets specific documents

1. Save the notice and exact timestamp.
2. Snapshot affected public pages and current metadata.
3. Consult counsel when needed.
4. If risk requires a temporary action, disable only the targeted download links; keep context pages online when possible.
5. Record the final outcome in `/transparency`.

## Recovery verification

- [ ] Home page loads from the new host.
- [ ] `/collections` loads.
- [ ] Each affected collection page loads.
- [ ] At least one download URL works for every available document.
- [ ] Downloaded checksums match published SHA-256 values.
