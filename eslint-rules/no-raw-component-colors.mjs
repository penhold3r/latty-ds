// Ratchet for hard-coded colour in component stylesheets (*.styles.ts). Two kinds are reported:
//   - a raw palette step, var(--lt-color-<name>-<step>), which bypasses the semantic tier
//   - a literal rgb()/rgba(), which bypasses tokens entirely
// Each file may keep the number it already has (BASELINE below), but no more. Fixing one should lower its count
// here, so the baseline only ever shrinks.

const BASELINE = {
  'button/button.styles.ts': {
    steps: 1,
    rgb: 0
  },
  'color-input/color-input.styles.ts': {
    steps: 0,
    rgb: 1
  },
  'date-input/date-input.styles.ts': {
    steps: 0,
    rgb: 1
  },
  'dialog/dialog.styles.ts': {
    steps: 0,
    rgb: 2
  },
  'icon-button/icon-button.styles.ts': {
    steps: 2,
    rgb: 0
  },
  'sidepanel/sidepanel.styles.ts': {
    steps: 0,
    rgb: 6
  },
  'slider/slider.styles.ts': {
    steps: 0,
    rgb: 2
  },
  'switch/switch.styles.ts': {
    steps: 0,
    rgb: 1
  },
  'tab/tab.styles.ts': {
    steps: 0,
    rgb: 1
  },
  'table/table.styles.ts': {
    steps: 0,
    rgb: 2
  }
};

const RAW_STEP = /var\(--lt-color-[a-z]+-\d+/g;
const RGB = /rgba?\(/g;

export default {
  rules: {
    'no-raw-component-colors': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          rawStep:
            'Found {{found}} raw palette step(s), {{allowed}} allowed. Use a semantic token (--lt-text-*, --lt-bg-*, --lt-border-*, --lt-interactive-*) instead.',
          rgb: 'Found {{found}} literal rgb()/rgba() colour(s), {{allowed}} allowed. Use a token instead of a hard-coded colour.'
        }
      },
      create(context) {
        const filename = context.filename.replace(/\\/g, '/');
        const marker = 'packages/web/src/components/';
        const rel = filename.slice(filename.indexOf(marker) + marker.length);
        return {
          'Program:exit'(node) {
            const text = context.sourceCode.getText();
            const found = { steps: (text.match(RAW_STEP) || []).length, rgb: (text.match(RGB) || []).length };
            const allowed = BASELINE[rel] ?? { steps: 0, rgb: 0 };
            if (found.steps > allowed.steps) {
              context.report({ node, messageId: 'rawStep', data: { found: found.steps, allowed: allowed.steps } });
            }
            if (found.rgb > allowed.rgb) {
              context.report({ node, messageId: 'rgb', data: { found: found.rgb, allowed: allowed.rgb } });
            }
          }
        };
      }
    }
  }
};
