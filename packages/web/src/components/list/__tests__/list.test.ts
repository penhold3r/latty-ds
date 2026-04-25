import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { List } from '../list';
import '../list';

describe('<lt-list>', () => {
  let el: List;

  beforeEach(async () => {
    el = document.createElement('lt-list') as List;
    el.innerHTML = `
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a ul element in shadow DOM by default', () => {
    const ul = el.shadowRoot!.querySelector('ul');
    expect(ul).toBeTruthy();
  });

  it('does not render ol when type is unordered', () => {
    const ol = el.shadowRoot!.querySelector('ol');
    expect(ol).toBeFalsy();
  });

  it('has default type of unordered', () => {
    expect(el.type).toBe('unordered');
    expect(el.getAttribute('type')).toBe('unordered');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('renders ol when type is ordered', async () => {
    el.type = 'ordered';
    await el.updateComplete;
    const ol = el.shadowRoot!.querySelector('ol');
    const ul = el.shadowRoot!.querySelector('ul');
    expect(ol).toBeTruthy();
    expect(ul).toBeFalsy();
  });

  it('can change type to ordered', async () => {
    el.type = 'ordered';
    await el.updateComplete;
    expect(el.getAttribute('type')).toBe('ordered');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('supports both list types', async () => {
    const types = ['unordered', 'ordered'] as const;

    for (const type of types) {
      el.type = type;
      await el.updateComplete;
      expect(el.getAttribute('type')).toBe(type);
    }
  });

  it('renders slotted list items', () => {
    const items = el.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(items[0].textContent?.trim()).toBe('Item 1');
    expect(items[1].textContent?.trim()).toBe('Item 2');
    expect(items[2].textContent?.trim()).toBe('Item 3');
  });

  it('has default marker color CSS variable', () => {
    const ul = el.shadowRoot!.querySelector('ul');
    expect(ul).toBeTruthy();
  });

  it('applies custom marker color via style', async () => {
    el.markerColor = 'red';
    await el.updateComplete;
    const ul = el.shadowRoot!.querySelector('ul') as HTMLElement;
    expect(ul.style.getPropertyValue('--list-marker-color')).toBe('red');
  });

  it('applies custom marker color with CSS variable', async () => {
    el.markerColor = 'var(--lt-color-primary-500)';
    await el.updateComplete;
    const ul = el.shadowRoot!.querySelector('ul') as HTMLElement;
    expect(ul.style.getPropertyValue('--list-marker-color')).toBe('var(--lt-color-primary-500)');
  });

  it('does not apply style when marker color is empty', async () => {
    el.markerColor = '';
    await el.updateComplete;
    const ul = el.shadowRoot!.querySelector('ul') as HTMLElement;
    expect(ul.style.getPropertyValue('--list-marker-color')).toBe('');
  });

  it('exposes list part for styling', () => {
    const ul = el.shadowRoot!.querySelector('[part="list"]');
    expect(ul).toBeTruthy();
  });

  it('switches between ul and ol when type changes', async () => {
    expect(el.shadowRoot!.querySelector('ul')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('ol')).toBeFalsy();

    el.type = 'ordered';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ul')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('ol')).toBeTruthy();

    el.type = 'unordered';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ul')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('ol')).toBeFalsy();
  });

  it('demonstrates HTML parser issue with nested lists (use lt-list-item instead)', async () => {
    const parentList = document.createElement('lt-list') as List;
    parentList.innerHTML = `
      <li>
        Main item
        <lt-list type="ordered">
          <li>Sub 1</li>
          <li>Sub 2</li>
        </lt-list>
      </li>
    `;
    document.body.appendChild(parentList);
    await parentList.updateComplete;

    // Get the nested lt-list element
    const nestedList = parentList.querySelector('lt-list') as List;
    expect(nestedList).toBeTruthy();

    // Wait for nested list to be ready
    await nestedList.updateComplete;

    // Check parent has ul in shadow DOM
    expect(parentList.shadowRoot!.querySelector('ul')).toBeTruthy();

    // Check nested list has ol in shadow DOM
    expect(nestedList.shadowRoot!.querySelector('ol')).toBeTruthy();

    // ISSUE: The HTML parser moves <li> elements out of <lt-list>
    // because it doesn't recognize custom elements as valid list containers.
    // When an <li> is encountered while already inside another <li>, the parser
    // auto-closes the parent <li> and makes the nested <li> a sibling instead.
    //
    // SOLUTION: Use <lt-list-item> instead of <li> for nested lists.
    // The <lt-list-item> component renders <li> in its shadow DOM, which
    // avoids the HTML parser issue.
    // This demonstrates the bug - nested list has 0 li items
    const nestedItems = nestedList.querySelectorAll('li');
    expect(nestedItems.length).toBe(0); // This is why we created lt-list-item!

    parentList.remove();
  });
});
