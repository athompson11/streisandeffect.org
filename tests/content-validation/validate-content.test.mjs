import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import { validateContent } from '../../scripts/content-validation.mjs';

const pdfBytes = Buffer.from('%PDF-1.4\nfixture document\n%%EOF\n', 'utf8');
const pdfHash = createHash('sha256').update(pdfBytes).digest('hex');

function makeDocument(overrides = {}) {
  return {
    slug: 'fixture-document',
    title: 'Fixture document',
    publisher: 'Fixture publisher',
    publisher_status: 'Withdrawn',
    archive_status: 'Preserved copy available',
    removal_status: 'Withdrawn by publisher',
    summary: 'Fixture summary.',
    neutral_description: 'Fixture neutral description.',
    publisher_current_position: 'Fixture publisher position.',
    why_hosted: 'Fixture archival rationale.',
    archive_obtained_date: '2026-01-01',
    copy_obtained_how: 'Fixture copy source.',
    file_name: 'fixture.pdf',
    file_type: 'application/pdf',
    primary_download_url: '/documents/fixture.pdf',
    last_reviewed: '2026-01-02',
    original_url_note: 'No original URL is available.',
    archived_original_url_note: 'No archived original URL is available.',
    best_known_publication_date: '2026-01',
    page_count: 1,
    file_size_bytes: pdfBytes.length,
    sha256: pdfHash,
    content_warnings: ['Fixture warning.'],
    sources: [{ label: 'Fixture source', url: 'https://example.test/source' }],
    mirror_urls: [],
    ...overrides
  };
}

function createFixture(documentOverrides = {}, { createFile = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'streisand-content-validation-'));
  const collectionDir = join(root, 'content', 'collections', 'fixture');
  const publicDir = join(root, 'public', 'documents');
  mkdirSync(collectionDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  const document = makeDocument(documentOverrides);
  const archive = {
    slug: 'fixture',
    title: 'Fixture collection',
    short_title: 'Fixture',
    publisher: 'Fixture publisher',
    status: 'Withdrawn',
    summary: 'Fixture collection summary.',
    editorial_note: 'Fixture editorial note.',
    archive_started: '2026-01-01',
    last_reviewed: '2026-01-02',
    publisher_status: 'Withdrawn',
    archive_status: 'Preserved copy available',
    amnesty_position: 'Fixture publisher position.',
    archive_interpretation: 'Fixture archival interpretation.',
    topics: ['fixture'],
    sources: [{ label: 'Fixture source', url: 'https://example.test/source' }],
    verified_events: [{ date: '2026-01-01', label: 'Fixture event', description: 'Fixture event description.' }],
    documents: [document]
  };

  writeFileSync(join(collectionDir, 'archive.yaml'), YAML.stringify(archive), 'utf8');
  const filePath = join(publicDir, 'fixture.pdf');
  if (createFile) writeFileSync(filePath, pdfBytes);

  return { root, filePath };
}

function withFixture(t, overrides, options = {}) {
  const fixture = createFixture(overrides, options);
  t.after(() => rmSync(fixture.root, { recursive: true, force: true }));
  return fixture;
}

test('accepts a hosted local PDF whose bytes match metadata', (t) => {
  const { root } = withFixture(t, {});
  const result = validateContent(root);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});

test('reports a missing hosted local PDF', (t) => {
  const { root } = withFixture(t, {}, { createFile: false });
  const result = validateContent(root);

  assert.ok(result.errors.some((error) => error.includes('hosted local PDF is missing')));
});

test('reports a correct-format but incorrect SHA-256', (t) => {
  const { root } = withFixture(t, { sha256: 'a'.repeat(64) });
  const result = validateContent(root);

  assert.ok(result.errors.some((error) => error.includes('SHA-256 mismatch')));
});

test('reports a wrong hosted local PDF size', (t) => {
  const { root } = withFixture(t, { file_size_bytes: pdfBytes.length + 1 });
  const result = validateContent(root);

  assert.ok(result.errors.some((error) => error.includes('byte-size mismatch')));
});

test('rejects an unsafe local download path', (t) => {
  const { root } = withFixture(t, { primary_download_url: '/documents/../secret.pdf' });
  const result = validateContent(root);

  assert.ok(result.errors.some((error) => error.includes('unsafe local primary_download_url')));
});

test('retains existing schema diagnostics', (t) => {
  const { root } = withFixture(t, { sha256: 'not-a-valid-sha256' });
  const result = validateContent(root);

  assert.ok(result.errors.some((error) => error.includes('sha256 must be 64 hex characters')));
});

test('does not claim remote primary downloads were byte-verified', (t) => {
  const { root } = withFixture(t, { primary_download_url: 'https://example.test/fixture.pdf' });
  const result = validateContent(root);

  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.includes('remote primary download was not byte-verified')));
});
