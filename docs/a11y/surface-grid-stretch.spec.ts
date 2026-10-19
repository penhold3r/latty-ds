import { test, expect } from '@playwright/test';

// Regression guard for a bug found 2026-10-19: lt-surface's shadow root wraps everything in an inner `.surface`
// div (packages/web/src/components/surface/surface.styles.ts) that painted the background/border/radius, but had
// no `height` rule of its own. When `<lt-surface>` is a grid/flex child that gets stretched to match the tallest
// item in its row (e.g. docs/src/components/ComponentGrid, docs/src/theme/DocCategoryGeneratedIndexPage), the
// *host* correctly stretches — that's just ordinary CSS on an element the author can see — but the inner `.surface`
// box one shadow root deeper never inherited that height, so it stayed shrink-wrapped to its own content. Visually:
// cards in the same row ended up different heights despite the invisible host boxes being equal.
//
// Fixed with a plain `height: 100%` on `.surface`. Safe for every other (non-stretched) usage — a percentage height
// only resolves against a definite containing-block height, so it computes to `auto` (no-op) when the host's own
// height is itself content-derived, which is the common case (dialog/snackbar/dropdown bodies).
//
// jsdom has no real layout engine, so grid stretch sizing can't be verified there — this can only be checked in a
// real browser. Kept as a permanent guard.
test('lt-surface fills a stretched grid row, down to its inner .surface box', async ({ page }) => {
  await page.goto('/components/button');
  await page.evaluate(() => customElements.whenDefined('lt-surface'));

  const heights = await page.evaluate(async () => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;width:400px';
    grid.innerHTML = `
      <lt-surface appearance="outlined" elevation="0"><div>One short line</div></lt-surface>
      <lt-surface appearance="outlined" elevation="0"><div>A much longer run of text that wraps across several lines inside the second card, forcing it to grow much taller than the first one</div></lt-surface>
    `;
    document.body.prepend(grid);

    const surfaces = [...grid.querySelectorAll('lt-surface')];
    await Promise.all(surfaces.map((s) => (s as unknown as { updateComplete: Promise<void> }).updateComplete));

    return surfaces.map((host) => {
      const inner = host.shadowRoot!.querySelector('.surface') as HTMLElement;
      return { host: host.getBoundingClientRect().height, inner: inner.getBoundingClientRect().height };
    });
  });

  expect(heights).toHaveLength(2);
  const [short, long] = heights;
  // Both hosts must match (grid stretch) — proves the fixture itself exercises stretching.
  expect(short.host).toBeCloseTo(long.host, 0);
  // The short card's inner box must match its (stretched) host, not shrink-wrap to its own one-line content —
  // this is the actual regression: it used to be dozens of pixels shorter than `short.host`.
  expect(short.inner).toBeCloseTo(short.host, 0);
  expect(long.inner).toBeCloseTo(long.host, 0);
});
