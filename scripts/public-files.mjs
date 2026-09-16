import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ROOT_FILES = new Set(['robots.txt', 'llms.txt', 'sitemap.xml']);
const PAGE_DIRS = new Set(['Activities', 'Centres', 'Certfictaons', 'Policies']);
const ASSET_DIRS = new Set(['Images', 'assets', 'fonts']);
const ASSET_EXTENSIONS = new Set(['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.pdf']);

/** Explicit public surface, shared by local preview and deployment. */
export function isPublicFile(relativePath) {
  const parts = relativePath.split('/');
  if (parts.some(part => !part || part.startsWith('.') || part.includes('\\') || part.includes(':'))) return false;
  const extension = extname(relativePath).toLowerCase();
  if (parts.length === 1) return ROOT_FILES.has(relativePath) || ['.html', '.css', '.js'].includes(extension);
  if (PAGE_DIRS.has(parts[0])) return ['.html', '.css', '.js'].includes(extension);
  if (ASSET_DIRS.has(parts[0])) return ASSET_EXTENSIONS.has(extension);
  return parts[0] === 'data' && parts.length === 2 && extension === '.json';
}

export async function publicFiles(root) {
  const files = [];
  async function visit(relative = '') {
    for (const item of await readdir(join(root, relative), { withFileTypes: true })) {
      const path = relative ? `${relative}/${item.name}` : item.name;
      if (item.isSymbolicLink() || item.name.startsWith('.')) continue;
      if (item.isFile() && isPublicFile(path)) files.push(path);
      if (item.isDirectory() && (relative || PAGE_DIRS.has(item.name) || ASSET_DIRS.has(item.name) || item.name === 'data')) await visit(path);
    }
  }
  await visit();
  return files.sort();
}
