import { describe, it, expect } from 'vitest';

import { buildSemanticTokens } from './semantic-tokens';
import { buildTokens } from '../core/';
import tokensConfig from '../../tokens.config.json';

const tokens = buildTokens({ color: tokensConfig.color });

/** Resolves a semantic token value (e.g. `color-warning-400`) to its hex string. */
const resolveHex = (value: string): string => {
  const token = value.replace(/^color-/, '');
  const direct = tokens.color[token];
  if (typeof direct === 'string') return direct; // white / black
  const dash = token.lastIndexOf('-');
  const name = token.slice(0, dash);
  const step = token.slice(dash + 1);
  const palette = tokens.color[name] as Record<string, string>;
  return palette[step];
};

const luminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const contrast = (a: string, b: string): number => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const opts = {
  primary500: (tokens.color.primary as Record<string, string>)['500'],
  primary400: (tokens.color.primary as Record<string, string>)['400']
};

describe('semantic tokens — on-color contrast', () => {
  // Guards the contrast-aware paths: warning is always a light amber and primary
  // is resolved via accessibleTextOn(). Both must read against their interactive
  // background at WCAG AA (4.5:1) in light and dark themes. Regression guard for
  // the dark-mode `text-on-warning` bug (was white-on-amber).
  it.each(['light', 'dark'] as const)('warning text meets AA on its %s interactive background', (mode) => {
    const map = buildSemanticTokens(mode, opts);
    const ratio = contrast(resolveHex(map['text-on-warning']), resolveHex(map['interactive-warning-bg']));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['light', 'dark'] as const)('primary text meets AA on its %s interactive background', (mode) => {
    const map = buildSemanticTokens(mode, opts);
    const ratio = contrast(resolveHex(map['text-on-primary']), resolveHex(map['interactive-primary-bg']));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
