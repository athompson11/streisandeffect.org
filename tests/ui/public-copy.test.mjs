import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const distRoot = join(process.cwd(), 'dist');
const forbiddenPhrases = [
  'Acknowledge receipt when practical',
  'Preserve the request, cited URLs',
  'Check whether the request identifies',
  'Decide whether to correct metadata',
  'or seek counsel',
  'will add them when direct source URLs are verified',
  'before launch',
  'configure this',
  'replace this'
];

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}

test('built public pages do not include known owner-directed or placeholder copy', () => {
  assert.ok(existsSync(distRoot), 'Build the site before running this rendered-public-copy check.');
  const pages = htmlFiles(distRoot);
  assert.ok(pages.length > 0, 'Expected built public HTML pages.');

  const failures = pages.flatMap((page) => {
    const html = readFileSync(page, 'utf8').toLowerCase();
    return forbiddenPhrases
      .filter((phrase) => html.includes(phrase.toLowerCase()))
      .map((phrase) => `${page}: ${phrase}`);
  });

  assert.deepEqual(failures, []);
});
