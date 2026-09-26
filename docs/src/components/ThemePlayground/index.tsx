import React, { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { usePrismTheme } from '@docusaurus/theme-common';
import { getPrismCssVariables } from '@docusaurus/theme-common/internal';
import { prismThemeToCss } from '../ComponentPlayground/ComponentPlayground.prism';
import Stage from './Stage';
import { init } from './ThemePlayground.script';
import { DEFAULTS, PRESETS } from './ThemePlayground.state';
import './ThemePlayground.styles.css';

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
    <>
      <div className="playground-presets">
        <lt-text variant="overline" class="playground-presets-label">
          Start from a preset
        </lt-text>
        {PRESETS.map(({ id, label, values }) => (
          <lt-button key={id} size="sm" variant="neutral" appearance="outlined" data-preset={id}>
            <span className="preset-dots" aria-hidden="true">
              <span className="preset-dot" style={cssVars({ '--dot': values.primary })} />
              <span className="preset-dot" style={cssVars({ '--dot': values.secondary })} />
            </span>
            {label}
          </lt-button>
        ))}
      </div>

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
                  label="Fonts"
                  type="multiline"
                  rows={3}
                  value={DEFAULTS.font}
                  placeholder={'"Hanken Grotesk", sans-serif\nGeorgia, serif'}
                  helper-text="One font per line: a font name, a CSS font stack, or a Google Fonts URL. The first is your primary font, the second your secondary."
                />
              </div>
              <div className="theme-control-row">
                <lt-select id="ctrl-font-heading" name="font-heading" label="Heading font" value="default" />
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
          {/* The stage is rendered twice: the second copy is the dark twin, only shown side by side. */}
          <div className="playground-stages" id="playground-stages">
            <Stage which="a" modeLabel="Light" />
            <Stage which="b" modeLabel="Dark" />
          </div>

          {/* Outside the stage on purpose: the snippet is docs chrome, so it follows the site's theme,
            not the theme being previewed. */}
          <div className="export-panel" style={getPrismCssVariables(prismTheme)}>
            <style>{prismThemeToCss(prismTheme, '.export-panel')}</style>
            <div className="export-header">
              <lt-text variant="overline">Use this theme</lt-text>
              <div className="export-actions">
                <lt-button
                  id="ctrl-share"
                  size="sm"
                  variant="neutral"
                  appearance="outlined"
                  icon-end="share"
                  aria-label="Copy a link to this theme"
                >
                  Share
                </lt-button>
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
            </div>
            {/* tabindex so the horizontally-scrollable snippet is keyboard-reachable (axe scrollable-region-focusable). */}
            <pre className="export-pre" tabIndex={0}>
              <code className="export-code" id="export-code" />
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
