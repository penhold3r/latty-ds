import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { ListItem } from '../list-item';
import '../list-item';

describe('<lt-list-item>', () => {
  let el: ListItem;

  beforeEach(async () => {
    el = document.createElement('lt-list-item') as ListItem;
    el.textContent = 'Test item';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a li element in shadow DOM', () => {
    const li = el.shadowRoot!.querySelector('li');
    expect(li).toBeTruthy();
  });

  it('renders slotted content', () => {
    const li = el.shadowRoot!.querySelector('li');
    const slot = li!.querySelector('slot');
    expect(slot).toBeTruthy();
    expect(el.textContent).toBe('Test item');
  });

  it('defines display: list-item in styles', () => {
    // Note: jsdom may not compute the style correctly, so we check the style definition exists
    const styleContent = el.constructor.styles.toString();
    expect(styleContent).toContain('display');
    expect(styleContent).toContain('list-item');
  });

  it('supports nested lt-list components', async () => {
    el.innerHTML = `
      Main item
      <lt-list type="ordered">
        <lt-list-item>Sub 1</lt-list-item>
        <lt-list-item>Sub 2</lt-list-item>
      </lt-list>
    `;
    await el.updateComplete;

    const nestedList = el.querySelector('lt-list');
    expect(nestedList).toBeTruthy();

    const nestedItems = el.querySelectorAll('lt-list-item');
    expect(nestedItems.length).toBe(2);
  });

  it('can contain complex HTML content', async () => {
    el.innerHTML = `
      <strong>Bold text</strong>
      <span>with additional elements</span>
    `;
    await el.updateComplete;

    expect(el.querySelector('strong')).toBeTruthy();
    expect(el.querySelector('span')).toBeTruthy();
  });

  it('is a valid child of lt-list', async () => {
    const list = document.createElement('lt-list');
    const item1 = document.createElement('lt-list-item') as ListItem;
    const item2 = document.createElement('lt-list-item') as ListItem;

    item1.textContent = 'Item 1';
    item2.textContent = 'Item 2';

    list.appendChild(item1);
    list.appendChild(item2);
    document.body.appendChild(list);

    await item1.updateComplete;
    await item2.updateComplete;

    const items = list.querySelectorAll('lt-list-item');
    expect(items.length).toBe(2);

    list.remove();
  });

  it('properly nests without HTML parser issues', async () => {
    const parentList = document.createElement('lt-list');
    const parentItem = document.createElement('lt-list-item') as ListItem;

    parentItem.innerHTML = `
      Main item
      <lt-list type="ordered">
        <lt-list-item>Nested 1</lt-list-item>
        <lt-list-item>Nested 2</lt-list-item>
      </lt-list>
    `;

    parentList.appendChild(parentItem);
    document.body.appendChild(parentList);
    await parentItem.updateComplete;

    // Get nested list and items
    const nestedList = parentItem.querySelector('lt-list');
    expect(nestedList).toBeTruthy();

    const nestedItems = nestedList!.querySelectorAll('lt-list-item');
    expect(nestedItems.length).toBe(2);

    // Verify each nested item has a <li> in its shadow DOM
    const firstNestedItem = nestedItems[0] as ListItem;
    await firstNestedItem.updateComplete;
    expect(firstNestedItem.shadowRoot!.querySelector('li')).toBeTruthy();

    const secondNestedItem = nestedItems[1] as ListItem;
    await secondNestedItem.updateComplete;
    expect(secondNestedItem.shadowRoot!.querySelector('li')).toBeTruthy();

    parentList.remove();
  });
});
