/* eslint-disable no-console */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const iconsDir = resolve(root, 'packages/icons/src/icons');
const outDir = resolve(root, 'docs/public/assets');

mkdirSync(outDir, { recursive: true });

const zip = new JSZip();
let totalIcons = 0;

// Walk categories
const categories = readdirSync(iconsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const category of categories) {
  const categoryDir = resolve(iconsDir, category);
  const files = readdirSync(categoryDir).filter((file) => file.endsWith('.ts') && file !== 'index.ts');

  for (const file of files) {
    const filePath = resolve(categoryDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Extract SVG string: handle both single quotes and backticks
    // Match either backtick template literals or concatenated single-quoted strings
    const backtickMatch = content.match(/`([^`\\]|\\.)*`/);
    let svgString = '';

    if (backtickMatch) {
      // Template literal: extract content between backticks
      svgString = backtickMatch[0].slice(1, -1);
    } else {
      // Single-quoted strings: collect all and join (handles concatenation)
      const stringMatches = content.match(/'([^'\\]|\\.)*'/g) || [];
      svgString = stringMatches.map((m) => m.slice(1, -1)).join('');
    }

    if (!svgString) {
      console.warn(`No SVG found in ${category}/${file}`);
      continue;
    }

    // Transform for design tools:
    // 1. Add explicit dimensions
    svgString = svgString.replace(/^<svg/, '<svg width="24" height="24"');

    // 2. Replace currentColor with #000000 for design tools (user will recolor)
    svgString = svgString
      .replace(/stroke="currentColor"/g, 'stroke="#000000"')
      .replace(/fill="currentColor"/g, 'fill="#000000"');

    // Icon name from filename: arrow-down.ts -> arrow-down
    const iconName = file.replace(/\.ts$/, '');

    // Add to ZIP at category/icon-name.svg
    zip.folder(category).file(`${iconName}.svg`, svgString);
    totalIcons++;
  }
}

// Write ZIP
const buffer = await zip.generateAsync({ type: 'nodebuffer' });
const zipPath = resolve(outDir, 'latty-icons.zip');
writeFileSync(zipPath, buffer);

console.log(`✓ Generated ${zipPath}`);
console.log(`  Total icons: ${totalIcons}`);
