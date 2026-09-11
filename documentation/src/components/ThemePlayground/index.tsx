import React, { useEffect } from 'react';
import { init } from './ThemePlayground.script';
import './ThemePlayground.styles.css';

// Ported from docs/src/pages/tokens/playground.astro — static markup here,
// `init()` (the ported _playground.script.ts) called once from an effect,
// same pattern as ComponentPlayground. No <BrowserOnly> needed.
export default function ThemePlayground(): JSX.Element {
  useEffect(() => {
    void init();
  }, []);

  return (
    <div className="playground-layout">
      <lt-surface appearance="outlined" class="playground-controls">
        <div className="controls-inner">
          <lt-text variant="h4">Controls</lt-text>

          <div className="control-row">
            <lt-color-input id="ctrl-primary" name="primary-color" label="Primary color" value="#ff8200" />
          </div>
          <div className="control-row">
            <lt-color-input id="ctrl-secondary" name="secondary-color" label="Secondary color" value="#5252c5" />
          </div>
          <div className="control-row control-row--slider">
            <lt-slider
              id="ctrl-radius"
              name="border-radius"
              label="Border radius (px)"
              min="0"
              max="24"
              step="1"
              value="8"
              tooltip
            />
          </div>
          <div className="control-row">
            <lt-select id="ctrl-width" name="border-width" label="Border width" value="thin" />
          </div>
          <div className="control-row">
            <lt-textfield
              id="ctrl-font"
              name="font-family"
              label="Font family"
              value='"https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap"'
              placeholder="Font stack or Google Fonts URL"
            />
          </div>
          <div className="control-row">
            <lt-select id="ctrl-theme" name="theme" label="Theme" value="system" />
          </div>

          <lt-button id="ctrl-reset" variant="neutral" appearance="ghost" size="sm">
            Reset to defaults
          </lt-button>
        </div>
      </lt-surface>

      <div className="playground-stage" id="playground-stage">
        <lt-text variant="overline" class="stage-label">
          Live preview
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
      </div>
    </div>
  );
}
