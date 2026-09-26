import { Prism } from 'prism-react-renderer';
import type { PrismTheme } from 'prism-react-renderer';

/**
 * Highlights `code` with the Prism instance Docusaurus's own code blocks use, so no second highlighter
 * ships. The output is HTML-escaped, which matters for the playgrounds: their snippets embed user-typed
 * values. Colors come from {@link prismThemeToCss}.
 */
export const highlight = (code: string, language: 'markup' | 'tsx'): string =>
  Prism.highlight(code, Prism.languages[language], language);

const toKebab = (prop: string) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * Turns a prism-react-renderer theme's token styles into CSS rules for the `token <type>` classes
 * that `Prism.highlight` emits. Docusaurus's own code blocks apply the same theme as inline styles
 * through `<Highlight>`, but the playground writes plain highlighted HTML into the DOM, so the theme
 * is expressed as a stylesheet instead. Rules keep the theme's order, so later entries win ties
 * exactly as they do when the theme's styles are merged for a token.
 *
 * `plain` (base color/background) is left to `getPrismCssVariables`.
 */
export const prismThemeToCss = (theme: PrismTheme, scope: string): string =>
  theme.styles
    .map(({ types, style }) => {
      const selector = types.map((type) => `${scope} .token.${type}`).join(', ');
      const declarations = Object.entries(style)
        .map(([prop, value]) => `${toKebab(prop)}: ${value};`)
        .join(' ');
      return `${selector} { ${declarations} }`;
    })
    .join('\n');
