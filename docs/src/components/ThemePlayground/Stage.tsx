import React, { useId } from 'react';
import type { CSSProperties } from 'react';
import TypeScale from '../TypeScale';

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const PALETTES = ['primary', 'secondary'] as const;

const BUTTON_APPEARANCES = ['filled', 'outlined', 'ghost'] as const;
const BADGE_VARIANTS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'] as const;
const CHIP_VARIANTS = ['primary', 'secondary', 'neutral'] as const;

const cssVars = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

// Each palette maps to the semantic role tokens that consume it, so the chips under the swatches show what
// the generated scale (and the auto-picked on-color text) actually produce — each with its contrast rating.
const roles = (name: string): { label: string; vars: Record<string, string> }[] => [
  {
    label: 'Filled · on-color text',
    vars: { '--pg-role-bg': `var(--lt-bg-${name})`, '--pg-role-fg': `var(--lt-text-on-${name})` }
  },
  {
    label: 'Subtle',
    vars: { '--pg-role-bg': `var(--lt-bg-${name}-subtle)`, '--pg-role-fg': `var(--lt-text-${name})` }
  },
  {
    label: 'Outlined',
    vars: {
      '--pg-role-bg': 'transparent',
      '--pg-role-fg': `var(--lt-text-${name})`,
      '--pg-role-border': `var(--lt-border-${name}-strong)`
    }
  }
];

interface StageProps {
  /** `a` is always shown; `b` is the dark twin that only appears in the side-by-side view. */
  which: 'a' | 'b';
  /** Shown above the stage in the side-by-side view. */
  modeLabel: string;
}

/**
 * Everything the theme controls affect. Rendered twice (see index.tsx) so the light and dark themes can be
 * compared side by side; each copy takes its tokens from the scoped stylesheet the script injects.
 */
export default function Stage({ which, modeLabel }: StageProps): JSX.Element {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="playground-stage" data-stage={which}>
      <lt-text variant="overline" class="stage-mode-label">
        {modeLabel}
      </lt-text>

      <section className="stage-section" aria-labelledby={`${uid}-colors`}>
        <lt-text id={`${uid}-colors`} variant="h4" as="h2">
          Color palettes
        </lt-text>

        {PALETTES.map((name) => (
          <div key={name} className="pg-palette">
            <lt-text variant="label">{name === 'primary' ? 'Primary' : 'Secondary'}</lt-text>
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
              {roles(name).map(({ label, vars }) => (
                <div key={label} className="pg-role-item">
                  <span className="pg-role" style={cssVars(vars)}>
                    {label}
                  </span>
                  {/* Filled in by the script, from the computed colors; hidden until then. */}
                  <lt-badge class="pg-contrast" size="sm" appearance="outlined" variant="neutral" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="stage-section" aria-labelledby={`${uid}-type`}>
        <lt-text id={`${uid}-type`} variant="h4" as="h2">
          Typography
        </lt-text>

        {/* One specimen card per font in the fonts list, built by the script (the count is up to the user). */}
        <div className="pg-fonts" />

        <lt-text variant="label">Type scale</lt-text>
        <TypeScale />
      </section>

      <section className="stage-section" aria-labelledby={`${uid}-components`}>
        <lt-text id={`${uid}-components`} variant="h4" as="h2">
          Components
        </lt-text>

        <div className="pg-demos">
          <div className="pg-demo">
            <lt-text variant="label">Buttons</lt-text>
            {BUTTON_APPEARANCES.map((appearance) => (
              <div key={appearance} className="pg-demo-row">
                <lt-button variant="primary" appearance={appearance} size="sm">
                  Primary
                </lt-button>
                <lt-button variant="secondary" appearance={appearance} size="sm">
                  Secondary
                </lt-button>
                <lt-button variant="neutral" appearance={appearance} size="sm">
                  Neutral
                </lt-button>
              </div>
            ))}
          </div>

          <div className="pg-demo">
            <lt-text variant="label">Badges and chips</lt-text>
            <div className="pg-demo-row">
              {BADGE_VARIANTS.map((variant) => (
                <lt-badge key={variant} variant={variant} size="md" content={variant} />
              ))}
            </div>
            <div className="pg-demo-row">
              {CHIP_VARIANTS.map((variant) => (
                <lt-chip key={variant} variant={variant} appearance="outlined" size="md">
                  {variant}
                </lt-chip>
              ))}
            </div>
            <div className="pg-demo-row">
              {CHIP_VARIANTS.map((variant) => (
                <lt-chip key={variant} variant={variant} appearance="filled" size="md">
                  {variant}
                </lt-chip>
              ))}
            </div>
          </div>

          <div className="pg-demo">
            <lt-text variant="label">Selection</lt-text>
            <div className="pg-demo-row">
              <lt-switch variant="primary" checked label="Primary" />
              <lt-switch variant="secondary" checked label="Secondary" />
            </div>
            <div className="pg-demo-row">
              <lt-checkbox variant="primary" checked label="Primary" />
              <lt-checkbox variant="secondary" checked label="Secondary" />
            </div>
            <div className="pg-demo-row">
              <lt-radio variant="primary" checked label="Primary" name={`${uid}-radio-a`} />
              <lt-radio variant="secondary" checked label="Secondary" name={`${uid}-radio-b`} />
            </div>
          </div>

          <div className="pg-demo">
            <lt-text variant="label">Progress and slider</lt-text>
            <lt-progress value={60} variant="primary" label="Uploading" />
            <lt-slider label="Volume" value={40} />
          </div>

          <div className="pg-demo">
            <lt-text variant="label">Inputs</lt-text>
            <lt-textfield label="Name" placeholder="Ada Lovelace" />
            <lt-select class="pg-sample-select" label="Plan" value="pro" />
          </div>

          <div className="pg-demo">
            <lt-text variant="label">Tabs</lt-text>
            <lt-tab-group value="overview" appearance="pills" size="sm">
              <lt-tab label="Overview" value="overview">
                Overview
              </lt-tab>
              <lt-tab label="Activity" value="activity">
                Activity
              </lt-tab>
              <lt-tab label="Settings" value="settings">
                Settings
              </lt-tab>
            </lt-tab-group>
            <lt-tab-group value="overview" size="sm">
              <lt-tab label="Overview" value="overview">
                Overview
              </lt-tab>
              <lt-tab label="Activity" value="activity">
                Activity
              </lt-tab>
              <lt-tab label="Settings" value="settings">
                Settings
              </lt-tab>
            </lt-tab-group>
          </div>
        </div>
      </section>

      <section className="stage-section" aria-labelledby={`${uid}-context`}>
        <lt-text id={`${uid}-context`} variant="h4" as="h2">
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
  );
}
