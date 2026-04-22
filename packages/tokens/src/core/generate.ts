import type { Config } from '@tokens/types';
import type { Tokens } from '@tokens/types/public-types';
import type { SemanticTokenMap } from '../semantic/';

import { DEFAULT_BORDER_RADIUS, DEFAULT_FONT_FAMILY } from '@tokens/constants';
import { buildSpacing } from '../spacing/';
import { buildElevation } from '../elevation/';
import { addSystemColors, buildColorTokens } from '../build/colors';

export const buildTokens = (cfg: Config): Tokens => {
  let color = buildColorTokens(cfg);
  color = addSystemColors(color);

  const spacing = buildSpacing();
  const border = { radius: DEFAULT_BORDER_RADIUS, square: false as const };
  const typography = { fontFamily: DEFAULT_FONT_FAMILY };
  const elevation = buildElevation(color.neutral);

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

export const semanticTokensToCss = (map: SemanticTokenMap): string => {
  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, ref]) => `  --lt-${key}: var(--lt-${ref});`);
  return `/* Semantic tokens */\n:root {\n${lines.join('\n')}\n}\n`;
};
