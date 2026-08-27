import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const contentRoot = join(root, 'content', 'collections');
const errors = [];

function readYaml(path) {
  try {
    return YAML.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: could not parse YAML: ${error.message}`);
    return null;
  }
}

function requireString(object, field, path) {
  if (typeof object?.[field] !== 'string' || object[field].trim() === '') {
    errors.push(`${path}: missing required string field ${field}`);
  }
}

function validateCollection(collectionDir) {
  const archivePath = join(contentRoot, collectionDir, 'archive.yaml');
  if (!existsSync(archivePath)) {
    errors.push(`${collectionDir}: missing archive.yaml`);
    return;
  }

  const archive = readYaml(archivePath);
  if (!archive) return;

  for (const field of ['slug', 'title', 'publisher', 'status', 'summary', 'editorial_note']) {
    requireString(archive, field, archivePath);
  }

  if (archive.slug !== collectionDir) {
    errors.push(`${archivePath}: slug must match directory name (${collectionDir})`);
  }

  if (!Array.isArray(archive.topics) || archive.topics.length === 0) {
    errors.push(`${archivePath}: topics must contain at least one item`);
  }

  const documentsDir = join(contentRoot, collectionDir, 'documents');
  if (!existsSync(documentsDir)) return;

  for (const entry of readdirSync(documentsDir)) {
    if (!entry.endsWith('.yaml') && !entry.endsWith('.yml')) continue;
    validateDocument(join(documentsDir, entry));
  }
}

function validateDocument(path) {
  const document = readYaml(path);
  if (!document) return;

  for (const field of ['slug', 'title', 'publisher', 'status', 'summary', 'why_hosted']) {
    requireString(document, field, path);
  }

  if (document.status === 'available') {
    for (const field of ['sha256', 'file_name', 'file_type', 'primary_download_url']) {
      requireString(document, field, path);
    }

    if (typeof document.file_size_bytes !== 'number' || document.file_size_bytes <= 0) {
      errors.push(`${path}: available documents require positive file_size_bytes`);
    }

    if (typeof document.sha256 === 'string' && !/^[a-f0-9]{64}$/i.test(document.sha256)) {
      errors.push(`${path}: sha256 must be 64 hex characters`);
    }
  }
}

if (!existsSync(contentRoot)) {
  errors.push(`missing content root: ${contentRoot}`);
} else {
  for (const entry of readdirSync(contentRoot)) {
    const fullPath = join(contentRoot, entry);
    if (statSync(fullPath).isDirectory()) validateCollection(entry);
  }
}

if (errors.length > 0) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Content validation passed.');
