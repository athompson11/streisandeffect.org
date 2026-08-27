import { createHash } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import YAML from 'yaml';

function usage() {
  console.error(`Usage:
  npm run ingest:document -- --file /path/to/file.pdf --collection amnestyinternational --title "Title" [--original-url URL]
`);
  process.exit(2);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) usage();
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) usage();
    args[key] = value;
    i += 1;
  }
  return args;
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function mimeFromExtension(path) {
  switch (extname(path).toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain';
    case '.html':
    case '.htm':
      return 'text/html';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
}

async function sha256(path) {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => {
    createReadStream(path)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', resolve);
  });
  return hash.digest('hex');
}

const args = parseArgs(process.argv.slice(2));
const file = args.file;
const collection = args.collection;
const title = args.title;

if (!file || !collection || !title) usage();
if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const slug = args.slug || slugify(title);
const stats = statSync(file);
const digest = await sha256(file);
const outputDir = join(process.cwd(), 'content', 'collections', collection, 'documents');
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, `${slug}.yaml`);
if (existsSync(outputPath) && args.force !== 'true') {
  console.error(`Refusing to overwrite existing metadata: ${outputPath}`);
  console.error('Pass --force true to overwrite intentionally.');
  process.exit(1);
}

const metadata = {
  slug,
  title,
  publisher: args.publisher || 'UNKNOWN — fill before publishing',
  status: 'pending',
  original_url: args['original-url'] || null,
  archived_original_url: null,
  publication_date: null,
  removal_discovered_date: null,
  file_name: basename(file),
  file_type: mimeFromExtension(file),
  file_size_bytes: stats.size,
  sha256: digest,
  primary_download_url: null,
  mirror_urls: [],
  warnings: [],
  summary: 'TODO: neutral one-paragraph description.',
  why_hosted: 'TODO: public-interest rationale for preservation.'
};

writeFileSync(outputPath, YAML.stringify(metadata), 'utf8');
console.log(`Wrote ${outputPath}`);
console.log(`SHA-256 ${digest}`);
