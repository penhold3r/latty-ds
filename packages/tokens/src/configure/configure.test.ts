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
    const customCss  = createStyleSheet({ colors: { primary: '#6366f1' } });
    // Color palettes will differ
    expect(customCss).not.toEqual(defaultCss);
    expect(customCss).toContain('--lt-color-primary-500');
  });

  it('applies custom font family', () => {
    const css = createStyleSheet({ font: { family: 'Inter, sans-serif' } });
    expect(css).toContain('Inter, sans-serif');
  });

  it('applies custom border radius', () => {
    const css = createStyleSheet({ border: { radius: '0.25rem' } });
    expect(css).toContain('--lt-border-radius: 0.25rem');
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
});
