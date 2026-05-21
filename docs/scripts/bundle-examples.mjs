import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const esbuild = resolve(root, 'node_modules/.bin/esbuild');
const outDir = resolve(__dirname, '../public/assets');

mkdirSync(outDir, { recursive: true });

const bundle = (entry, outfile) =>
  execFileSync(
    esbuild,
    [entry, '--bundle', '--format=esm', '--platform=browser', '--target=es2020', '--minify', `--outfile=${outfile}`],
    { cwd: root, stdio: 'inherit' }
  );

bundle('packages/web/src/index.ts', resolve(outDir, 'latty-web.js'));
bundle('packages/tokens/src/configure/index.ts', resolve(outDir, 'latty-configure.js'));
