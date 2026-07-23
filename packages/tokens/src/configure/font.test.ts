import { describe, it, expect } from 'vitest';

import { resolveFontFamilies, fontFamilySlot } from './font';

describe('fontFamilySlot', () => {
  it.each([
    [0, 'fontFamilyPrimary'],
    [1, 'fontFamilySecondary'],
    [2, 'fontFamilyTertiary'],
    [3, 'fontFamilyQuaternary']
  ] as const)('maps index %s to %s', (index, slot) => {
    expect(fontFamilySlot(index)).toBe(slot);
  });

  it('falls back to a numbered slot beyond the fourth entry', () => {
    expect(fontFamilySlot(4)).toBe('fontFamily5');
    expect(fontFamilySlot(9)).toBe('fontFamily10');
  });
});

describe('resolveFontFamilies', () => {
  it('passes a plain CSS family value through unchanged', () => {
    expect(resolveFontFamilies('Inter, sans-serif')).toEqual([{ family: 'Inter, sans-serif', importUrl: null }]);
  });

  it('parses a single-family Google Fonts CSS2 URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap';
    expect(resolveFontFamilies(url)).toEqual([{ family: '"Hanken Grotesk", sans-serif', importUrl: url }]);
  });

  it('parses a single-word family without quoting it', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    expect(resolveFontFamilies(url)).toEqual([{ family: 'Roboto, sans-serif', importUrl: url }]);
  });

  it('stacks multiple families from repeated family= params into one resolved entry', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk&family=Roboto+Mono&display=swap';
    expect(resolveFontFamilies(url)).toEqual([
      { family: '"Hanken Grotesk", "Roboto Mono", sans-serif', importUrl: url }
    ]);
  });

  it('supports the legacy pipe-separated family= form', () => {
    const url = 'https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto';
    expect(resolveFontFamilies(url)).toEqual([{ family: '"Open Sans", Roboto, sans-serif', importUrl: url }]);
  });

  it('strips wrapping double quotes before detecting a URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap';
    expect(resolveFontFamilies(`"${url}"`)).toEqual([{ family: '"Bowlby One", sans-serif', importUrl: url }]);
  });

  it('strips wrapping single quotes before detecting a URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap';
    expect(resolveFontFamilies(`'${url}'`)).toEqual([{ family: '"Bowlby One", sans-serif', importUrl: url }]);
  });

  it('does not strip quotes from a legitimate quoted CSS family value', () => {
    expect(resolveFontFamilies('"Times New Roman", serif')).toEqual([
      { family: '"Times New Roman", serif', importUrl: null }
    ]);
  });

  it('still imports a non-Google-Fonts URL but leaves family empty', () => {
    const url = 'https://use.typekit.net/abc123.css';
    expect(resolveFontFamilies(url)).toEqual([{ family: '', importUrl: url }]);
  });

  it('treats a Google Fonts URL with no family param the same as an unparseable URL', () => {
    const url = 'https://fonts.googleapis.com/css2?display=swap';
    expect(resolveFontFamilies(url)).toEqual([{ family: '', importUrl: url }]);
  });

  it('resolves each entry of an array independently, in order', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap';
    expect(resolveFontFamilies(['Inter, sans-serif', url])).toEqual([
      { family: 'Inter, sans-serif', importUrl: null },
      { family: '"Roboto Mono", sans-serif', importUrl: url }
    ]);
  });

  it('handles a mix of plain values and multiple CDN URLs', () => {
    const url1 = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk&display=swap';
    const url2 = 'https://use.typekit.net/abc123.css';
    expect(resolveFontFamilies([url1, 'Georgia, serif', url2])).toEqual([
      { family: '"Hanken Grotesk", sans-serif', importUrl: url1 },
      { family: 'Georgia, serif', importUrl: null },
      { family: '', importUrl: url2 }
    ]);
  });

  it('returns an empty array for an empty array input', () => {
    expect(resolveFontFamilies([])).toEqual([]);
  });

  it('uses a custom fallback for the object form', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&display=swap';
    expect(resolveFontFamilies({ url, fallback: 'serif' })).toEqual([
      { family: '"Playfair Display", serif', importUrl: url }
    ]);
  });

  it('defaults the object form fallback to sans-serif when omitted', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap';
    expect(resolveFontFamilies({ url })).toEqual([{ family: '"Roboto Mono", sans-serif', importUrl: url }]);
  });

  it('mixes plain strings and object-form entries in an array', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap';
    expect(resolveFontFamilies(['Georgia, serif', { url, fallback: 'serif' }])).toEqual([
      { family: 'Georgia, serif', importUrl: null },
      { family: '"Playfair Display", serif', importUrl: url }
    ]);
  });

  it('ignores the fallback when the object form URL is not Google Fonts', () => {
    const url = 'https://use.typekit.net/abc123.css';
    expect(resolveFontFamilies({ url, fallback: 'monospace' })).toEqual([{ family: '', importUrl: url }]);
  });
});
