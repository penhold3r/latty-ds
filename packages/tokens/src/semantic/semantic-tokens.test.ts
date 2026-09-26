import { describe, it, expect } from 'vitest';

import { buildSemanticTokens } from './semantic-tokens';
import { contrastRatio } from './contrast';
import { buildTokens } from '../core/';
import tokensConfig from '../../tokens.config.json';

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
const MODES = ['light', 'dark'] as const;
const AA = 4.5;

const everyVariant = (hex: string): Record<string, string> => Object.fromEntries(VARIANTS.map((v) => [v, hex]));

// Base colours a consumer might configure. The picker has to hold AA whatever it is given, so alongside the default
// palette and the docs' theme-playground presets this includes adversarial inputs: a pale primary, near-black and
// pure white/black, saturated hues, and a grey sweep that walks the luminance crossover (~0.18) where neither white
// nor black text has much room.
const CONFIGS: Record<string, Record<string, string>> = {
  default: {},
  ocean: { primary: '#0284c7', secondary: '#0d9488' },
  forest: { primary: '#15803d', secondary: '#a16207' },
  berry: { primary: '#be185d', secondary: '#6d28d9' },
  editorial: { primary: '#1f2937', secondary: '#b45309' },
  brutalist: { primary: '#ffd60a', secondary: '#111827' },
  'pale everywhere': everyVariant('#fef08a'),
  'near-black everywhere': everyVariant('#0b0b0f'),
  'white everywhere': everyVariant('#ffffff'),
  'black everywhere': everyVariant('#000000'),
  ...Object.fromEntries(
    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'].map((hex) => [
      `saturated ${hex}`,
      everyVariant(hex)
    ])
  ),
  ...Object.fromEntries(
    ['#333333', '#555555', '#6a6a6a', '#767676', '#7a7a7a', '#808080', '#8f8f8f', '#a0a0a0', '#c0c0c0'].map((hex) => [
      `grey ${hex}`,
      everyVariant(hex)
    ])
  )
};

const built = Object.fromEntries(
  Object.entries(CONFIGS).map(([name, colors]) => {
    const tokens = buildTokens({ color: { ...tokensConfig.color, ...colors } });
    return [
      name,
      {
        tokens,
        light: buildSemanticTokens('light', { palettes: tokens.color }),
        dark: buildSemanticTokens('dark', { palettes: tokens.color })
      }
    ];
  })
);

/** Resolves a semantic token value (e.g. `color-warning-400`) to its hex string. */
const resolveHex = (name: string, value: string): string => {
  const { tokens } = built[name];
  const token = value.replace(/^color-/, '');
  const direct = tokens.color[token];
  if (typeof direct === 'string') return direct; // white / black
  const dash = token.lastIndexOf('-');
  const palette = tokens.color[token.slice(0, dash)] as Record<string, string>;
  return palette[token.slice(dash + 1)];
};

const ROWS = Object.keys(CONFIGS).flatMap((config) =>
  MODES.flatMap((mode) => VARIANTS.map((variant) => [config, mode, variant] as const))
);

describe('semantic tokens — text on interactive fills', () => {
  it.each(ROWS)('%s / %s / %s: text meets AA on the resting, hover and pressed fills', (config, mode, variant) => {
    const map = built[config][mode];
    const text = resolveHex(config, map[`text-on-${variant}`]);
    const ratios = ['', '-hover', '-active'].map((state) =>
      contrastRatio(text, resolveHex(config, map[`interactive-${variant}-bg${state}`]))
    );

    expect(Math.min(...ratios)).toBeGreaterThanOrEqual(AA);
  });

  it.each(VARIANTS)('defines the full token set for %s', (variant) => {
    const map = built.default.light;
    expect(Object.keys(map)).toEqual(
      expect.arrayContaining([
        `text-on-${variant}`,
        `interactive-${variant}-bg`,
        `interactive-${variant}-bg-hover`,
        `interactive-${variant}-bg-active`
      ])
    );
  });

  it.each(MODES)('the resting fill starts at the %s theme convention (500 light, 400 dark)', (mode) => {
    const rest = mode === 'light' ? '500' : '400';
    expect(built.default[mode]['interactive-primary-bg']).toBe(`color-primary-${rest}`);
  });
});

describe('semantic tokens — neutral interactive contrast', () => {
  // Neutral has no on-color token; components put near-white text on it (button: neutral-50, solid badge:
  // white). Regression guard for the filled neutral button, which used neutral-500 (3.48:1).
  it.each([
    ['light', 'interactive-neutral-bg'],
    ['light', 'interactive-neutral-bg-hover'],
    ['light', 'interactive-neutral-bg-active'],
    ['dark', 'interactive-neutral-bg'],
    ['dark', 'interactive-neutral-bg-hover'],
    ['dark', 'interactive-neutral-bg-active']
  ] as const)('near-white text meets AA on %s %s', (mode, token) => {
    const map = built.default[mode];
    const bg = resolveHex('default', map[token]);
    expect(contrastRatio(resolveHex('default', 'color-neutral-50'), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(resolveHex('default', 'color-white'), bg)).toBeGreaterThanOrEqual(AA);
  });
});
