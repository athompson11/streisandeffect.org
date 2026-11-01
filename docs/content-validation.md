# Content validation

Run the content validator and its focused regression tests from the repository root:

```fish
npm run test:content-validation
npm run validate:content
npm run check
npm run build
```

`npm run validate:content` retains the existing YAML schema checks. For each document marked `file_type: application/pdf`, it also verifies a hosted local `primary_download_url` against the `file_size_bytes` and `sha256` values in metadata.

A hosted local URL must be an unencoded, single-slash absolute path below `public/`, for example:

```text
/documents/publisher/report.pdf
```

The validator rejects traversal segments, encoded path characters, query strings, fragments, backslashes, and paths that resolve outside `public/`. It also resolves existing files before reading them so a symlink cannot make the validator read a file outside `public/`.

Validation fails with a nonzero exit code when a local PDF is missing, not a regular file, has the wrong byte size, or has a SHA-256 that does not match metadata. It reports both the metadata value and the observed value for size and hash mismatches. Do not repair those failures by changing metadata or PDF bytes without independently establishing which archival record is correct.

HTTP and HTTPS `primary_download_url` values are remote. The validator does not fetch them and emits an explicit warning that their bytes were not verified; a passing local validation result is not evidence that remote bytes were checked.

The node:test suite uses temporary fixture directories and does not modify the archive's YAML or PDFs. It covers matching bytes, missing files, hash and size mismatches, unsafe paths, an existing schema error, and remote-URL handling.
