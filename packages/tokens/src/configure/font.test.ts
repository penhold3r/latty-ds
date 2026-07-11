import { describe, it, expect } from 'vitest';

import { resolveFontFamily } from './font';

describe('resolveFontFamily', () => {
  it('passes a plain CSS family value through unchanged', () => {
    expect(resolveFontFamily('Inter, sans-serif')).toEqual({
      family: 'Inter, sans-serif',
      importUrl: null
    });
  });

  it('parses a single-family Google Fonts CSS2 URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap';
    expect(resolveFontFamily(url)).toEqual({
      family: '"Hanken Grotesk", sans-serif',
      importUrl: url
    });
  });

  it('parses a single-word family without quoting it', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    expect(resolveFontFamily(url)).toEqual({
      family: 'Roboto, sans-serif',
      importUrl: url
    });
  });

  it('stacks multiple families from repeated family= params', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk&family=Roboto+Mono&display=swap';
    expect(resolveFontFamily(url)).toEqual({
      family: '"Hanken Grotesk", "Roboto Mono", sans-serif',
      importUrl: url
    });
  });

  it('supports the legacy pipe-separated family= form', () => {
    const url = 'https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto';
    expect(resolveFontFamily(url)).toEqual({
      family: '"Open Sans", Roboto, sans-serif',
      importUrl: url
    });
  });

  it('strips wrapping double quotes before detecting a URL', () => {
    // Easy mistake: copying `family: 'https://...'` out of a JS example and
    // pasting the quotes along with it.
    const url = 'https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap';
    expect(resolveFontFamily(`"${url}"`)).toEqual({
      family: '"Bowlby One", sans-serif',
      importUrl: url
    });
  });

  it('strips wrapping single quotes before detecting a URL', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap';
    expect(resolveFontFamily(`'${url}'`)).toEqual({
      family: '"Bowlby One", sans-serif',
      importUrl: url
    });
  });

  it('does not strip quotes from a legitimate quoted CSS family value', () => {
    expect(resolveFontFamily('"Times New Roman", serif')).toEqual({
      family: '"Times New Roman", serif',
      importUrl: null
    });
  });

  it('still imports a non-Google-Fonts URL but leaves family empty', () => {
    const url = 'https://use.typekit.net/abc123.css';
    expect(resolveFontFamily(url)).toEqual({
      family: '',
      importUrl: url
    });
  });

  it('treats a Google Fonts URL with no family param the same as an unparseable URL', () => {
    const url = 'https://fonts.googleapis.com/css2?display=swap';
    expect(resolveFontFamily(url)).toEqual({
      family: '',
      importUrl: url
    });
  });
});
