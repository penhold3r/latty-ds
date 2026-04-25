import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { logger } from '@latty/utils';
import type { Config } from '../types/';

import { buildTokens, tokensToCss, semanticTokensToCss } from '../core/';
import { buildSemanticTokens } from '../semantic/';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pkgRoot   = path.resolve(__dirname, '..');
const outDir    = path.join(pkgRoot, 'dist');
const configPath = path.join(pkgRoot, 'tokens.config.json');

if (!fs.existsSync(configPath)) {
  logger.error(`Missing tokens config: ${configPath}`);
  process.exit(1);
}

const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

logger.info('Building tokens...');

const tokens      = buildTokens(config);
const css         = tokensToCss(tokens);
const semanticMap = buildSemanticTokens();
const semanticCss = semanticTokensToCss(semanticMap);

fs.mkdirSync(outDir, { recursive: true });

const jsonOutput = { ...tokens, semantic: semanticMap };

fs.writeFileSync(path.join(outDir, 'tokens.json'),  JSON.stringify(jsonOutput, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(outDir, 'tokens.css'),   css,         'utf8');
fs.writeFileSync(path.join(outDir, 'semantic.css'),  semanticCss, 'utf8');
fs.writeFileSync(path.join(outDir, 'tokens.js'),    `export const tokens = ${JSON.stringify(jsonOutput)};\n`, 'utf8');
fs.writeFileSync(path.join(outDir, 'index.js'),     `export * from "./tokens.js";\n`, 'utf8');

logger.success('[@latty/tokens] wrote dist/tokens.css + dist/semantic.css + dist/tokens.json');
