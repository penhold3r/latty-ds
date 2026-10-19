import { test, expect } from '@playwright/test';

// Regression guard for a bug found 2026-10-19: jsdom cannot resolve getComputedStyle for anything inside a shadow
// root (confirmed previously for table.ts's th/td box-sizing, see that test file's own comment — the same limit
// applies here), so both of these can only be verified in a real browser.
//
// 1. <lt-nav>'s items had zero gap between them (nav.styles.ts's `nav { gap: 0 }`), so adjacent items were flush
//    against each other with no visual separation.
// 2. <lt-nav-item>'s .item-trigger renders as either <a> (a link) or <button> (a group header, see nav-item.ts's
//    _renderTrigger) using the exact same class and CSS rule. Browsers don't give <a> and <button> the same
//    UA-default box-sizing or line-height, and the rule never pinned either explicitly — so two items with
//    identical padding and content rendered at genuinely different widths and heights purely because of which tag
//    they happened to use (a plain link item vs. a collapsible group header).
test('lt-nav items have a visible gap and identical sizing regardless of trigger tag', async ({ page }) => {
  await page.goto('/components/button');
  await page.evaluate(() => customElements.whenDefined('lt-nav'));

  const result = await page.evaluate(async () => {
    const nav = document.createElement('lt-nav');
    nav.innerHTML = `
      <lt-nav-item href="/" label="Dashboard" icon-start="home"></lt-nav-item>
      <lt-nav-item label="Settings" icon-start="settings">
        <lt-nav-item href="/profile" label="Profile"></lt-nav-item>
      </lt-nav-item>
    `;
    document.body.prepend(nav);
    await (nav as unknown as { updateComplete: Promise<void> }).updateComplete;
    const items = [...nav.querySelectorAll(':scope > lt-nav-item')];
    await Promise.all(items.map((i) => (i as unknown as { updateComplete: Promise<void> }).updateComplete));

    const [linkItem, groupItem] = items;
    const linkTrigger = linkItem.shadowRoot!.querySelector('.item-trigger') as HTMLElement;
    const groupTrigger = groupItem.shadowRoot!.querySelector('.item-trigger') as HTMLElement;
    const linkRect = linkTrigger.getBoundingClientRect();
    const groupRect = groupTrigger.getBoundingClientRect();

    // Gap: the vertical distance between the link item's bottom edge and the group item's top edge.
    const gapBetweenItems = groupRect.top - linkRect.bottom;

    return {
      linkTag: linkTrigger.tagName,
      groupTag: groupTrigger.tagName,
      linkWidth: linkRect.width,
      groupWidth: groupRect.width,
      linkHeight: linkRect.height,
      groupHeight: groupRect.height,
      gapBetweenItems
    };
  });

  expect(result.linkTag).toBe('A');
  expect(result.groupTag).toBe('BUTTON');
  expect(result.gapBetweenItems).toBeGreaterThan(0);
  expect(result.groupWidth).toBeCloseTo(result.linkWidth, 0);
  expect(result.groupHeight).toBeCloseTo(result.linkHeight, 0);
});
