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
    expect(css).toContain('--lt-typography-fontFamily: "Hanken Grotesk", sans-serif');
  });

  it('still imports a non-Google-Fonts URL but keeps the default family token', () => {
    const url = 'https://use.typekit.net/abc123.css';
    const defaultCss = createStyleSheet();
    const css = createStyleSheet({ font: { family: url } });
    expect(css.startsWith(`@import url("${url}");\n`)).toBe(true);
    expect(css).toContain('--lt-typography-fontFamily: "Hanken Grotesk", sans-serif');
    expect(css.slice(css.indexOf(':root'))).toEqual(defaultCss.slice(defaultCss.indexOf(':root')));
  });

  it('does not prepend @import for a plain CSS font family value', () => {
    const css = createStyleSheet({ font: { family: 'Inter, sans-serif' } });
    expect(css.startsWith('@import')).toBe(false);
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
    // FOUC guard must still be present, just after the @import instead of before it.
    expect(css).toContain('html[data-lt]:not([data-lt-ready]){visibility:hidden}');
  });
});
