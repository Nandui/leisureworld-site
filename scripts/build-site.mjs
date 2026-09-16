import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { publicFiles } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const generated = spawnSync(process.execPath, [join(root, 'scripts/build-content.mjs')], { cwd: root, stdio: 'inherit' });
if (generated.status !== 0) process.exit(generated.status || 1);
// The only recursive deletion is this verified, fixed build directory.
if (output !== join(root, 'dist') || dirname(output) !== root) throw new Error('Unsafe output directory');
await rm(output, { recursive: true, force: true });
const files = await publicFiles(root);
for (const relative of files) {
  const target = join(output, relative);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, relative), target);
}
console.log(`Built ${files.filter(path => path.endsWith('.html')).length} pages and ${files.length} public files in dist/.`);
