# Provider Failover Runbook

Use this when Cloudflare, Traefik/ingress, the Kubernetes cluster, Longhorn, or another vendor disables service after a false DMCA, abuse report, policy dispute, or outage.

## Keep ready before an incident

- Domain registrar login outside Cloudflare.
- Exported DNS zone file or documented records.
- Latest container image tag and static `dist/` build artifact.
- Longhorn backups for the documents PVC.
- Local/offsite copies of every hosted file.
- Checksums and document metadata in Git.
- A standby static/container host option.

## If Cloudflare is unavailable but registrar still works

1. Build the static site and image:

   ```fish
   npm run build
   docker build -t streisandeffect.org:failover .
   ```

2. Deploy to a standby host or CDN.
3. Restore/copy documents from Longhorn backup or local copies to the standby document path.
4. Change registrar nameservers or DNS records to the standby provider.
5. Publish a transparency entry describing provider impact and mitigation.

## If Longhorn or the Kubernetes cluster is unavailable

1. Confirm whether Cloudflare cache still serves existing documents.
2. Restore documents from Longhorn backup or local offsite copy.
3. Deploy the container image and restored documents to a standby host.
4. Verify document checksums before announcing recovery.
5. Publish a transparency entry.

## If a legal notice targets specific documents

1. Save the notice and exact timestamp.
2. Snapshot affected public pages and current metadata.
3. Consult counsel when needed.
4. If risk requires temporary action, disable only the targeted download links or remove only targeted files from the mounted document store; keep context pages online when possible.
5. Record the final outcome in `/transparency`.

## Recovery verification

- [ ] Home page loads from the active host.
- [ ] `/collections` loads.
- [ ] `/submit` loads.
- [ ] Each affected collection page loads.
- [ ] At least one download URL works for every available document.
- [ ] Downloaded checksums match published SHA-256 values.
