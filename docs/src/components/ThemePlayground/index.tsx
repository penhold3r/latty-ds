import React, { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { usePrismTheme } from '@docusaurus/theme-common';
import { getPrismCssVariables } from '@docusaurus/theme-common/internal';
import TypeScale from '../TypeScale';
import { prismThemeToCss } from '../ComponentPlayground/ComponentPlayground.prism';
import { init, DEFAULTS } from './ThemePlayground.script';
import './ThemePlayground.styles.css';

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

// Each palette maps to the semantic role tokens that consume it, so the "in use" chips below the
// swatches show what the generated scale (and the auto-picked on-color text) actually produces.
const PALETTES = [
  { name: 'primary', label: 'Primary' },
  { name: 'secondary', label: 'Secondary' }
] as const;

const FONT_ROLES = [
  { role: 'primary', label: 'Primary', note: 'Body copy, labels and UI — used by every component.' },
  {
    role: 'secondary',
    label: 'Secondary',
    note: 'Not used by components. Reference it in your own CSS for accents or editorial text.'
  },
  { role: 'heading', label: 'Heading', note: 'The h1–h6 and display text variants.' }
] as const;

const cssVars = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

export default function ThemePlayground(): JSX.Element {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void init().then((dispose) => {
      if (cancelled) dispose();
      else cleanup = dispose;
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Same Prism theme (and light/dark switching) as the site's code blocks.
  const prismTheme = usePrismTheme();

  return (
    <div className="playground-layout">
      <div className="playground-controls-wrap">
        <lt-surface appearance="outlined" class="playground-controls">
          <div className="theme-controls-inner">
            <div className="controls-header">
              <lt-text variant="h4">Controls</lt-text>
              <lt-button
                id="ctrl-reset"
                variant="neutral"
                appearance="ghost"
                size="sm"
                aria-label="Reset all controls to their defaults"
              >
                Reset
              </lt-button>
            </div>

            <lt-text variant="overline" class="control-group-label">
              Colors
            </lt-text>
            <div className="theme-control-row">
              <lt-color-input id="ctrl-primary" name="primary-color" label="Primary color" value={DEFAULTS.primary} />
            </div>
            <div className="theme-control-row">
              <lt-color-input
                id="ctrl-secondary"
                name="secondary-color"
                label="Secondary color"
                value={DEFAULTS.secondary}
              />
            </div>

            <lt-text variant="overline" class="control-group-label">
              Shape
            </lt-text>
            <div className="theme-control-row theme-control-row--slider">
              <lt-slider
                id="ctrl-radius"
                name="border-radius"
                label="Border radius (px)"
                min="0"
                max="24"
                step="1"
                value={DEFAULTS.radius}
                tooltip
              />
            </div>
            <div className="theme-control-row">
              <lt-select id="ctrl-width" name="border-width" label="Border width" value={DEFAULTS.width} />
            </div>

            <lt-text variant="overline" class="control-group-label">
              Fonts
            </lt-text>
            <div className="theme-control-row">
              <lt-textfield
                id="ctrl-font"
                name="font-family"
                label="Primary font"
                value={DEFAULTS.font}
                placeholder="Font stack or Google Fonts URL"
              />
            </div>
            <div className="theme-control-row">
              <lt-textfield
                id="ctrl-font-secondary"
                name="font-family-secondary"
                label="Secondary font"
                value={DEFAULTS.fontSecondary}
                placeholder="Optional — e.g. Georgia, serif"
              />
            </div>
            <div className="theme-control-row">
              <lt-textfield
                id="ctrl-font-heading"
                name="font-family-heading"
                label="Heading font"
                value={DEFAULTS.fontHeading}
                placeholder="Optional — defaults to primary"
              />
            </div>

            <lt-text variant="overline" class="control-group-label">
              Preview
            </lt-text>
            <div className="theme-control-row">
              <lt-select id="ctrl-theme" name="theme" label="Theme" value={DEFAULTS.theme} />
            </div>
          </div>
        </lt-surface>
      </div>

      <div className="playground-main">
        <div className="playground-stage" id="playground-stage">
          <section className="stage-section" aria-labelledby="stage-colors">
            <lt-text id="stage-colors" variant="h4" as="h2">
              Color palettes
            </lt-text>

            {PALETTES.map(({ name, label }) => (
              <div key={name} className="pg-palette">
                <lt-text variant="label">{label}</lt-text>
                <div className="pg-swatches">
                  {SHADES.map((shade) => (
                    <div
                      key={shade}
                      className="pg-swatch"
                      data-palette={name}
                      data-shade={shade}
                      style={cssVars({ '--pg-swatch': `var(--lt-color-${name}-${shade})` })}
                    >
                      <span className="pg-swatch-shade">{shade}</span>
                      <span className="pg-swatch-hex" />
                    </div>
                  ))}
                </div>
                <div className="pg-roles">
                  <span
                    className="pg-role"
                    style={cssVars({
                      '--pg-role-bg': `var(--lt-bg-${name})`,
                      '--pg-role-fg': `var(--lt-text-on-${name})`,
                      '--pg-role-border': 'transparent'
                    })}
                  >
                    Filled · on-color text
                  </span>
                  <span
                    className="pg-role"
                    style={cssVars({
                      '--pg-role-bg': `var(--lt-bg-${name}-subtle)`,
                      '--pg-role-fg': `var(--lt-text-${name})`,
                      '--pg-role-border': 'transparent'
                    })}
                  >
                    Subtle
                  </span>
                  <span
                    className="pg-role"
                    style={cssVars({
                      '--pg-role-bg': 'transparent',
                      '--pg-role-fg': `var(--lt-text-${name})`,
                      '--pg-role-border': `var(--lt-border-${name}-strong)`
                    })}
                  >
                    Outlined
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="stage-section" aria-labelledby="stage-type">
            <lt-text id="stage-type" variant="h4" as="h2">
              Typography
            </lt-text>

            <div className="pg-fonts">
              {FONT_ROLES.map(({ role, label, note }) => (
                <div key={role} className="pg-font" data-role={role}>
                  <lt-text variant="overline">{label}</lt-text>
                  <span className="pg-font-aa" aria-hidden="true">
                    Aa
                  </span>
                  <span className="pg-font-name" />
                  <span className="pg-font-sample">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                  </span>
                  <span className="pg-font-weights">
                    <span className="pg-weight-regular">Regular</span>
                    <span className="pg-weight-medium">Medium</span>
                    <span className="pg-weight-bold">Bold</span>
                  </span>
                  <lt-text variant="caption" class="pg-font-note">
                    {note}
                  </lt-text>
                </div>
              ))}
            </div>

            <lt-text variant="label">Type scale</lt-text>
            <TypeScale />
          </section>

          <section className="stage-section" aria-labelledby="stage-context">
            <lt-text id="stage-context" variant="h4" as="h2">
              In context
            </lt-text>

            <lt-surface appearance="outlined" elevation="2" class="subscribe-card">
              <div className="card-inner">
                <div className="subscribe-header">
                  <lt-icon name="bell" size="lg" />
                  <lt-text variant="h4">Stay in the loop</lt-text>
                  <lt-badge variant="primary" size="sm" content="New" />
                </div>

                <lt-text variant="body">
                  Product updates, design notes, and release announcements — no spam, unsubscribe anytime.
                </lt-text>

                <div className="subscribe-chips">
                  <lt-chip variant="primary" appearance="outlined" size="md">
                    Design
                  </lt-chip>
                  <lt-chip variant="secondary" appearance="outlined" size="md">
                    Engineering
                  </lt-chip>
                  <lt-chip variant="neutral" appearance="outlined" size="md">
                    Product
                  </lt-chip>
                </div>

                <div className="subscribe-benefits">
                  <div className="subscribe-benefit">
                    <lt-icon name="check-circle" />
                    <lt-text variant="body-sm">Weekly digest, no fluff</lt-text>
                  </div>
                  <div className="subscribe-benefit">
                    <lt-icon name="check-circle" />
                    <lt-text variant="body-sm">Unsubscribe in one click</lt-text>
                  </div>
                </div>

                <lt-textfield
                  type="email"
                  name="email"
                  label="Email address"
                  icon-start="mail"
                  placeholder="you@example.com"
                />

                <div className="subscribe-actions">
                  <lt-button variant="primary" full-width>
                    Subscribe
                  </lt-button>
                  <lt-button variant="secondary" appearance="outlined" full-width>
                    No thanks
                  </lt-button>
                </div>

                <lt-text variant="caption">By subscribing you agree to our Privacy Policy.</lt-text>
              </div>
            </lt-surface>
          </section>
        </div>

        {/* Outside the stage on purpose: the snippet is docs chrome, so it follows the site's theme,
            not the theme being previewed. */}
        <div className="export-panel" style={getPrismCssVariables(prismTheme)}>
          <style>{prismThemeToCss(prismTheme, '.export-panel')}</style>
          <div className="export-header">
            <lt-text variant="overline">Use this theme</lt-text>
            <lt-button
              id="ctrl-copy"
              size="sm"
              variant="neutral"
              appearance="outlined"
              icon-end="copy"
              aria-label="Copy configure() snippet"
            >
              Copy
            </lt-button>
          </div>
          {/* tabindex so the horizontally-scrollable snippet is keyboard-reachable (axe scrollable-region-focusable). */}
          <pre className="export-pre" tabIndex={0}>
            <code className="export-code" id="export-code" />
          </pre>
        </div>
      </div>
    </div>
  );
}
