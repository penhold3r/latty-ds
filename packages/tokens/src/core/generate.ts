import type { Config, PaletteFlat } from '../types/';
import type { Tokens } from '../types/public-types';
import type { SemanticTokenMap } from '../semantic/';

import { DEFAULT_BORDER_RADIUS, DEFAULT_BORDER_WIDTH, DEFAULT_FONT_FAMILY } from '../constants/';
import { buildSpacing } from '../spacing/';
import { buildElevation } from '../elevation/';
import { addSystemColors, buildColorTokens } from '../build/colors';

export const buildTokens = (cfg: Config): Tokens => {
  let color = buildColorTokens(cfg);
  color = addSystemColors(color);

  const spacing = buildSpacing();
  const border = { radius: DEFAULT_BORDER_RADIUS, width: DEFAULT_BORDER_WIDTH };
  const typography = { fontFamily: DEFAULT_FONT_FAMILY };
  const elevation = buildElevation(color.neutral as PaletteFlat);

  return { color, spacing, border, typography, elevation };
};

export const tokensToCss = (tokens: Tokens): string => {
  const lines: string[] = [];

  const walker = (value: unknown, parts: string[]) => {
    if (typeof value === 'string') {
      lines.push(`  --lt-${parts.join('-')}: ${value};`);
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const next = (value as Record<string, unknown>)[key];
      if (parts.length === 1 && parts[0] === 'spacing' && (key === 'rem' || key === 'px')) {
        if (key === 'rem') walker(next, ['spacing']);
        else walker(next, ['spacing', 'px']);
        continue;
      }
      walker(next, [...parts, key]);
    }
  };

  walker(tokens, []);
  return `:root{\n${lines.join('\n')}\n}\n`;
};

export const semanticTokensToCss = (map: SemanticTokenMap, wrapper?: string): string => {
  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, ref]) => `  --lt-${key}: var(--lt-${ref});`);

  if (!wrapper) {
    return `/* Semantic tokens */\n:root {\n${lines.join('\n')}\n}\n`;
  }
  if (wrapper.startsWith('@')) {
    // At-rule (media query) — nest :root inside
    const indented = lines.map((l) => '  ' + l);
    return `${wrapper} {\n  :root {\n${indented.join('\n')}\n  }\n}\n`;
  }
  // CSS selector — apply directly (higher specificity overrides :root + @media)
  return `${wrapper} {\n${lines.join('\n')}\n}\n`;
};
