import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// The page-level sweep (a11y.spec.ts) only sees what each docs page happens to render, which is mostly default
// variants. This one renders every variant and appearance of the components that paint text on a filled colour —
// the surfaces the on-colour picker in @latty-ds/tokens is responsible for — and checks their contrast in both
// themes. The token matrix in packages/tokens proves the picker; this proves the components actually consume it
// (it caught lt-alert painting a different fill than the one its text was picked against, and dimming its body
// text with opacity, which lowers contrast whatever the tokens say).
const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
const STATUS = ['success', 'warning', 'error', 'info'] as const;

const fixture = `
  <div id="filled-surfaces" style="display:grid;gap:12px;padding:16px;background:var(--lt-bg-default)">
    <section id="buttons">
      ${[...VARIANTS, 'neutral']
        .flatMap((v) =>
          ['filled', 'outlined', 'ghost'].map(
            (a) => `<lt-button variant="${v}" appearance="${a}">${v} ${a}</lt-button>`
          )
        )
        .join('')}
    </section>
    <section id="icon-buttons">
      ${[...VARIANTS, 'neutral']
        .map((v) => `<lt-icon-button icon="plus" label="Add ${v}" appearance="filled" variant="${v}"></lt-icon-button>`)
        .join('')}
    </section>
    <section id="badges">
      ${['primary', 'secondary', 'success', 'warning', 'error', 'neutral']
        .flatMap((v) =>
          ['filled', 'outlined', 'solid'].map(
            (a) => `<lt-badge variant="${v}" appearance="${a}" content="${v} ${a}"></lt-badge>`
          )
        )
        .join('')}
    </section>
    <section id="chips">
      ${[...VARIANTS, 'neutral']
        .flatMap((v) =>
          ['filled', 'outlined'].map((a) => `<lt-chip variant="${v}" appearance="${a}" deletable>${v} ${a}</lt-chip>`)
        )
        .join('')}
    </section>
    <section id="alerts">
      ${STATUS.flatMap((v) =>
        ['filled', 'outlined', 'solid'].map(
          (a) =>
            `<lt-alert variant="${v}" appearance="${a}" title="${v} ${a}" closable>Body text under the title in a ${a} alert.</lt-alert>`
        )
      ).join('')}
    </section>
  </div>
`;

// The other half of the picture: surfaces that put text on the page background or a tint rather than a filled
// colour. These used raw palette steps (`--lt-color-error-600`, `primary-700`, `neutral-700`…) that don't change with
// the theme, so they read fine in light and failed in dark (a selected pagination item was 2.1:1, dialog body text
// 1.5:1). Everything here has to come from the theme-aware `--lt-text-*` tokens.
const STATES = ['default', 'success', 'warning', 'error'] as const;

const surroundings = `
  <div id="fields" style="display:grid;gap:12px;padding:16px;width:520px;background:var(--lt-bg-default)">
    ${STATES.map((v) => `<lt-textfield variant="${v}" label="Text ${v}" helper-text="Helper text, ${v}" required></lt-textfield>`).join('')}
    ${STATES.map((v) => `<lt-select variant="${v}" label="Select ${v}" helper-text="Helper text, ${v}" required></lt-select>`).join('')}
    ${STATES.map((v) => `<lt-combobox variant="${v}" label="Combobox ${v}" helper-text="Helper text, ${v}" required></lt-combobox>`).join('')}
    ${STATES.map((v) => `<lt-date-input variant="${v}" label="Date ${v}" helper-text="Helper text, ${v}" required></lt-date-input>`).join('')}
    ${STATES.map((v) => `<lt-datepicker variant="${v}" label="Datepicker ${v}" helper-text="Helper text, ${v}" required></lt-datepicker>`).join('')}
    <lt-radio-group label="Group" helper-text="Group helper" required error><lt-radio value="a" label="A"></lt-radio></lt-radio-group>
  </div>
  <div id="navigation" style="display:grid;gap:16px;padding:16px;width:520px;background:var(--lt-bg-default)">
    <lt-pagination page="3" total-pages="12"></lt-pagination>
    <lt-pagination page="1" total-pages="5" size="sm"></lt-pagination>
    <lt-tab-group value="a"><lt-tab value="a" label="Active"></lt-tab><lt-tab value="b" label="Idle"></lt-tab></lt-tab-group>
    <lt-breadcrumb><lt-breadcrumb-item href="#">Home</lt-breadcrumb-item><lt-breadcrumb-item href="#">Library</lt-breadcrumb-item><lt-breadcrumb-item current>Now</lt-breadcrumb-item></lt-breadcrumb>
    <lt-list><lt-list-item icon-start="check">Done</lt-list-item><lt-list-item icon-start="info-circle" clickable>Clickable</lt-list-item></lt-list>
    <lt-nav orientation="horizontal" label="Menu"><lt-nav-item label="Products" open><lt-nav-item href="#a" label="Alpha"></lt-nav-item><lt-nav-item href="#b" label="Beta"></lt-nav-item></lt-nav-item></lt-nav>
    <div style="height:90px"></div>
  </div>
  <lt-dialog id="dialog" open title="Dialog"><p>Body copy inside an open dialog.</p></lt-dialog>
  <lt-sidepanel id="sidepanel" open label="Panel"><p style="margin:0;padding:16px">Content inside an open side panel.</p></lt-sidepanel>
`;

for (const theme of ['light', 'dark'] as const) {
  test(`filled surfaces meet AA in every variant [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => window.localStorage.setItem('theme', t), theme);
    await page.goto('/components/button');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => customElements.whenDefined('lt-alert'));
    await page.evaluate((html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.prepend(host);
    }, fixture);
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).include('#filled-surfaces').withRules(['color-contrast']).analyze();

    expect(
      results.violations.flatMap((v) =>
        v.nodes.map((n) => ({ target: n.target.flat().join(' >> '), data: n.any[0]?.data }))
      )
    ).toEqual([]);
  });

  test(`an open snackbar meets AA in every variant [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => window.localStorage.setItem('theme', t), theme);
    await page.goto('/components/snackbar');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => customElements.whenDefined('lt-snackbar'));
    await page.evaluate(
      (variants) => {
        const host = document.createElement('div');
        host.id = 'snackbars';
        // Stack them: a snackbar is position:fixed, so lay each one out in flow for the check.
        host.innerHTML = variants
          .map(
            (v) =>
              `<lt-snackbar open duration="0" variant="${v}" action-label="Undo" style="position:static;transform:none;margin:8px">Saved as ${v}</lt-snackbar>`
          )
          .join('');
        document.body.prepend(host);
      },
      ['default', ...STATUS]
    );
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).include('#snackbars').withRules(['color-contrast']).analyze();

    expect(
      results.violations.flatMap((v) =>
        v.nodes.map((n) => ({ target: n.target.flat().join(' >> '), data: n.any[0]?.data }))
      )
    ).toEqual([]);
  });

  test(`text on the page background and on tints meets AA [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => window.localStorage.setItem('theme', t), theme);
    await page.goto('/components/button');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() =>
      Promise.all(['lt-combobox', 'lt-date-input', 'lt-sidepanel', 'lt-nav'].map((t) => customElements.whenDefined(t)))
    );
    await page.evaluate((html) => {
      const host = document.createElement('div');
      host.innerHTML = html;
      document.body.prepend(host);
      document.querySelectorAll<HTMLElement & { options?: unknown }>('lt-select, lt-combobox').forEach((el) => {
        el.options = [{ value: 'a', label: 'Alpha' }];
      });
    }, surroundings);
    await page.waitForTimeout(600);

    const results = await new AxeBuilder({ page })
      .include('#fields')
      .include('#navigation')
      .include('#dialog')
      .include('#sidepanel')
      .withRules(['color-contrast'])
      .analyze();

    expect(
      results.violations.flatMap((v) =>
        v.nodes.map((n) => ({ target: n.target.flat().join(' >> '), data: n.any[0]?.data }))
      )
    ).toEqual([]);
  });
}
