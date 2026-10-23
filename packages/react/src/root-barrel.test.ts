/*
 * Imported via the package specifier (not a relative path to ./index) so this exercises the built dist output the
 * same way a real consumer does — `pnpm build` must run first, same requirement as scripts/check-esm-smoke.mjs.
 */
import * as LattyReact from '@latty-ds/react';

/*
 * Regression guard for a bug found 2026-10-19: `scripts/codegen-wrappers.mjs` fully regenerates the root barrel
 * (packages/react/src/index.ts) every run, sourced only from packages/web/custom-elements.json. `Icon` lives in
 * @latty-ds/icons, a package that manifest never scans, so its own wrapper file and barrel (components/Icon/*)
 * were both correct but had no way to reach this root index — it was silently exported from nowhere, despite
 * `import type { ... } from '@latty-ds/react'` still resolving fine (other components' prop types reference
 * LattyIconName, masking that the actual Icon component was missing). Fixed via codegen-wrappers.mjs's
 * MANUAL_EXTRA_EXPORTS list, which survives every regeneration.
 */
describe('@latty-ds/react root barrel', () => {
  it('exports Icon (a wrapper for a component outside @latty-ds/web, so outside the generator’s own manifest)', () => {
    expect(LattyReact.Icon).toBeDefined();
    expect(typeof LattyReact.Icon).toBe('object'); // forwardRef() result, not a plain function
  });
});
