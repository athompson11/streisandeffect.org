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

function requireArray(object, field, path) {
  if (!Array.isArray(object?.[field]) || object[field].length === 0) {
    errors.push(`${path}: ${field} must contain at least one item`);
  }
}

function validateSource(source, path, field) {
  requireString(source, 'label', `${path}:${field}`);
  requireString(source, 'url', `${path}:${field}`);
}

function validateCollection(collectionDir) {
  const archivePath = join(contentRoot, collectionDir, 'archive.yaml');
  if (!existsSync(archivePath)) {
    errors.push(`${collectionDir}: missing archive.yaml`);
    return;
  }

  const archive = readYaml(archivePath);
  if (!archive) return;

  for (const field of [
    'slug',
    'title',
    'short_title',
    'publisher',
    'status',
    'summary',
    'editorial_note',
    'archive_started',
    'last_reviewed',
    'publisher_status',
    'archive_status',
    'amnesty_position',
    'archive_interpretation'
  ]) {
    requireString(archive, field, archivePath);
  }

  if (archive.slug !== collectionDir) {
    errors.push(`${archivePath}: slug must match directory name (${collectionDir})`);
  }

  requireArray(archive, 'topics', archivePath);
  requireArray(archive, 'sources', archivePath);
  requireArray(archive, 'verified_events', archivePath);
  requireArray(archive, 'documents', archivePath);

  archive.sources?.forEach((source, index) => validateSource(source, archivePath, `sources[${index}]`));

  archive.verified_events?.forEach((event, index) => {
    for (const field of ['date', 'label', 'description']) requireString(event, field, `${archivePath}:verified_events[${index}]`);
  });

  archive.documents?.forEach((document, index) => validateDocument(document, `${archivePath}:documents[${index}]`));

  const documentsDir = join(contentRoot, collectionDir, 'documents');
  if (!existsSync(documentsDir)) return;

  for (const entry of readdirSync(documentsDir)) {
    if (!entry.endsWith('.yaml') && !entry.endsWith('.yml')) continue;
    validateDocument(readYaml(join(documentsDir, entry)), join(documentsDir, entry));
  }
}

function validateDocument(document, path) {
  if (!document) return;

  for (const field of [
    'slug',
    'title',
    'publisher',
    'publisher_status',
    'archive_status',
    'removal_status',
    'summary',
    'neutral_description',
    'publisher_current_position',
    'why_hosted',
    'archive_obtained_date',
    'copy_obtained_how',
    'file_name',
    'file_type',
    'primary_download_url',
    'last_reviewed'
  ]) {
    requireString(document, field, path);
  }

  if (!document.original_url && !document.original_url_note) {
    errors.push(`${path}: requires original_url or original_url_note`);
  }

  if (!document.archived_original_url && !document.archived_original_url_note) {
    errors.push(`${path}: requires archived_original_url or archived_original_url_note`);
  }

  if (!document.publication_date && !document.best_known_publication_date) {
    errors.push(`${path}: requires publication_date or best_known_publication_date`);
  }

  if (typeof document.page_count !== 'number' || document.page_count <= 0) {
    errors.push(`${path}: requires positive page_count`);
  }

  if (typeof document.file_size_bytes !== 'number' || document.file_size_bytes <= 0) {
    errors.push(`${path}: requires positive file_size_bytes`);
  }

  if (typeof document.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(document.sha256)) {
    errors.push(`${path}: sha256 must be 64 hex characters`);
  }

  requireArray(document, 'content_warnings', path);
  requireArray(document, 'sources', path);
  if (!Array.isArray(document.mirror_urls)) errors.push(`${path}: mirror_urls must be an array, even when empty`);
  document.sources?.forEach((source, index) => validateSource(source, path, `sources[${index}]`));
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
