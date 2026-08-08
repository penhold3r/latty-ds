import { describe, it, expect, beforeEach } from 'vitest';

import { createStyleSheet, configure } from './configure';

describe('createStyleSheet', () => {
  it('returns a string containing primitive and semantic tokens', () => {
    const css = createStyleSheet();
    expect(css).toContain('--lt-color-primary-500');
    expect(css).toContain('--lt-text-default');
    expect(css).toContain('--lt-bg-surface');
  });

  it('uses default colors when called with no args', () => {
    const css = createStyleSheet();
    expect(css).toContain(':root');
    expect(css.length).toBeGreaterThan(1000);
  });

  it.each(['light', 'dark', 'system'] as const)(
    'applies the configured font to plain body elements regardless of theme (%s)',
    (theme) => {
      const css = createStyleSheet({ theme });
      expect(css).toContain('body { font-family: var(--lt-typography-fontFamilyPrimary); }');
    }
  );

  it('applies custom primary color', () => {
    const defaultCss = createStyleSheet();
    const customCss = createStyleSheet({ colors: { primary: '#6366f1' } });
    // Color palettes will differ
    expect(customCss).not.toEqual(defaultCss);
    expect(customCss).toContain('--lt-color-primary-500');
  });

  it('applies custom font family', () => {
    const css = createStyleSheet({ font: { family: 'Inter, sans-serif' } });
    expect(css).toContain('Inter, sans-serif');
  });

  it('loads a Google Fonts CSS2 URL and derives the family name', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap';
    const css = createStyleSheet({ font: { family: url } });
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamilyPrimary: "Hanken Grotesk", sans-serif');
  });

  it('still imports a non-Google-Fonts URL but keeps the default family token', () => {
    const url = 'https://use.typekit.net/abc123.css';
    const defaultCss = createStyleSheet();
    const css = createStyleSheet({ font: { family: url } });
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamilyPrimary: "Hanken Grotesk", sans-serif');
    expect(css.slice(css.indexOf(':root'))).toEqual(defaultCss.slice(defaultCss.indexOf(':root')));
  });

  it('does not prepend @import for a plain CSS font family value', () => {
    const css = createStyleSheet({ font: { family: 'Inter, sans-serif' } });
    expect(css.startsWith('@import')).toBe(false);
  });

  it('applies a custom fallback via the object form', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&display=swap';
    const css = createStyleSheet({ font: { family: { url, fallback: 'serif' } } });
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamilyPrimary: "Playfair Display", serif');
  });

  it('maps an array of font families to Primary/Secondary tokens', () => {
    const css = createStyleSheet({ font: { family: ['Inter, sans-serif', 'Georgia, serif'] } });
    expect(css).toContain('--lt-typography-fontFamilyPrimary: Inter, sans-serif');
    expect(css).toContain('--lt-typography-fontFamilySecondary: Georgia, serif');
  });

  it('resolves font.heading to a dedicated fontFamilyHeading token, independent of family', () => {
    const css = createStyleSheet({ font: { family: 'Inter, sans-serif', heading: 'Georgia, serif' } });
    expect(css).toContain('--lt-typography-fontFamilyPrimary: Inter, sans-serif');
    expect(css).toContain('--lt-typography-fontFamilyHeading: Georgia, serif');
  });

  it('resolves a CDN URL passed to font.heading and imports it', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&display=swap';
    const css = createStyleSheet({ font: { heading: { url, fallback: 'serif' } } });
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamilyHeading: "Playfair Display", serif');
  });

  it('does not emit a fontFamilyHeading token when font.heading is not configured', () => {
    const css = createStyleSheet();
    expect(css).not.toContain('--lt-typography-fontFamilyHeading');
  });

  it('emits one @import line per CDN URL in an array, in order', () => {
    const url1 = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk&display=swap';
    const url2 = 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap';
    const css = createStyleSheet({ font: { family: [url1, url2] } });
    expect(css.startsWith(`@import url("${url1}");\n@import url("${url2}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamilyPrimary: "Hanken Grotesk", sans-serif');
    expect(css).toContain('--lt-typography-fontFamilySecondary: "Roboto Mono", sans-serif');
  });

  it('applies custom border radius', () => {
    const css = createStyleSheet({ border: { radius: '0.25rem' } });
    expect(css).toContain('--lt-border-radius: 0.25rem');
  });

  it('emits the default border width when not configured', () => {
    const css = createStyleSheet();
    expect(css).toContain('--lt-border-width: 1px');
  });

  it.each([
    ['thin', '1px'],
    ['medium', '2px'],
    ['thick', '4px']
  ] as const)('resolves border width preset %s to %s', (preset, px) => {
    const css = createStyleSheet({ border: { width: preset } });
    expect(css).toContain(`--lt-border-width: ${px}`);
  });

  it('passes a raw CSS length border width through unchanged', () => {
    const css = createStyleSheet({ border: { width: '1.5px' } });
    expect(css).toContain('--lt-border-width: 1.5px');
  });

  it('applies border width and radius independently', () => {
    const css = createStyleSheet({ border: { radius: '0.25rem', width: 'thick' } });
    expect(css).toContain('--lt-border-radius: 0.25rem');
    expect(css).toContain('--lt-border-width: 4px');
  });

  it('flattens every elevation level to none when elevation is "none"', () => {
    const css = createStyleSheet({ elevation: 'none' });
    for (const level of ['0', '1', '2', '3', '4', '5']) {
      expect(css).toContain(`--lt-elevation-${level}: none;`);
    }
  });

  it('emits real box-shadow values when elevation is not configured', () => {
    const css = createStyleSheet();
    expect(css).not.toContain('--lt-elevation-1: none;');
  });

  it('generates a full palette for an arbitrary custom color name', () => {
    const css = createStyleSheet({ colors: { tertiary: '#a855f7' } });
    expect(css).toContain('--lt-color-tertiary-500');
    expect(css).toContain('--lt-color-tertiary-muted-500');
  });

  it('custom palette does not replace built-in palettes', () => {
    const css = createStyleSheet({ colors: { tertiary: '#a855f7' } });
    expect(css).toContain('--lt-color-primary-500');
    expect(css).toContain('--lt-color-tertiary-500');
  });

  it('semantic tokens use var() references, not raw hex', () => {
    const css = createStyleSheet();
    const semanticSection = css.split('/* Semantic tokens */')[1];
    expect(semanticSection).toBeDefined();
    expect(semanticSection).toContain('var(--lt-color-');
    expect(semanticSection).not.toMatch(/--lt-text-[^:]+:\s*#/);
  });

  it('emits default border-contrast neutral steps when not configured', () => {
    const css = createStyleSheet({ theme: 'light' });
    expect(css).toContain('--lt-border-default: var(--lt-color-neutral-200)');
    expect(css).toContain('--lt-border-strong: var(--lt-color-neutral-400)');
    expect(css).toContain('--lt-border-subtle: var(--lt-color-neutral-100)');
  });

  it('shifts border tokens to bolder neutral steps in light mode when contrast is high', () => {
    const css = createStyleSheet({ theme: 'light', border: { contrast: 'high' } });
    expect(css).toContain('--lt-border-default: var(--lt-color-neutral-400)');
    expect(css).toContain('--lt-border-strong: var(--lt-color-neutral-600)');
    expect(css).toContain('--lt-border-subtle: var(--lt-color-neutral-300)');
  });

  it('shifts border tokens toward lighter neutral steps in dark mode when contrast is high', () => {
    const css = createStyleSheet({ theme: 'dark', border: { contrast: 'high' } });
    expect(css).toContain('--lt-border-default: var(--lt-color-neutral-500)');
    expect(css).toContain('--lt-border-strong: var(--lt-color-neutral-300)');
    expect(css).toContain('--lt-border-subtle: var(--lt-color-neutral-600)');
  });

  it('applies high border-contrast to both light and dark layers in system theme', () => {
    const css = createStyleSheet({ theme: 'system', border: { contrast: 'high' } });
    expect(css).toContain('--lt-border-default: var(--lt-color-neutral-400)'); // light, :root
    expect(css).toContain('--lt-border-default: var(--lt-color-neutral-500)'); // dark, media/data-theme
  });
});

describe('configure', () => {
  beforeEach(() => {
    document.getElementById('lt-tokens')?.remove();
  });

  it('injects a style element into document.head', () => {
    configure();
    const style = document.getElementById('lt-tokens');
    expect(style).toBeTruthy();
    expect(style?.tagName).toBe('STYLE');
  });

  it('style element contains token CSS', () => {
    configure();
    const css = document.getElementById('lt-tokens')?.textContent ?? '';
    expect(css).toContain('--lt-color-primary-500');
    expect(css).toContain('--lt-text-default');
  });

  it('re-calling configure replaces the existing style element', () => {
    configure();
    configure({ colors: { primary: '#ff0000' } });
    expect(document.querySelectorAll('#lt-tokens').length).toBe(1);
  });

  it('keeps @import as the first rule when font.family is a CDN URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk&display=swap';
    configure({ font: { family: url } });
    const css = document.getElementById('lt-tokens')?.textContent ?? '';
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
  });
});
