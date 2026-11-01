import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk('dist');
const textFiles = files.filter((path) => /\.(html|css|js|xml|svg)$/i.test(path));
const output = textFiles.map((path) => [path, readFileSync(path, 'utf8')]);
const joined = output.map(([, text]) => text).join('\n');
const html = output.filter(([path]) => path.endsWith('.html'));
const urls = [...joined.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((match) => match[0]).sort();

console.log(JSON.stringify({
  htmlPages: html.length,
  missingNoReferrer: html
    .filter(([, text]) => !/<meta\s+name="referrer"\s+content="no-referrer"\s*\/?\s*>/i.test(text))
    .map(([path]) => path),
  assetFiles: files.length,
  urls: [...new Set(urls)],
  forbidden: {
    preconnect: /rel=["'][^"']*preconnect/i.test(joined),
    prefetch: /rel=["'][^"']*prefetch/i.test(joined),
    remoteScript: /<script[^>]+src=["']https?:/i.test(joined),
    remoteStyle: /<link(?=[^>]*\brel=["'][^"']*stylesheet)(?=[^>]*\bhref=["']https?:)[^>]*>/i.test(joined) || /@import\s+(?:url\()?\s*["']https?:/i.test(joined),
    outboundApi: /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/.test(joined)
  },
  docsPublished: files.some((path) => path.startsWith('dist/docs/'))
}, null, 2));
