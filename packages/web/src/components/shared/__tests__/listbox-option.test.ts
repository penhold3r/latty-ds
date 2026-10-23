import { describe, expect, it, vi } from 'vitest';
import { html, render } from 'lit';
import { renderListboxGroups, renderListboxLoading, renderListboxOption } from '../listbox-option';

describe('renderListboxOption', () => {
  const container = document.createElement('div');

  it('renders a standard option with icon and description', async () => {
    const onSelect = vi.fn();
    render(
      renderListboxOption({
        id: 'o1',
        label: 'Apple',
        description: 'Green',
        icon: 'leaf',
        selected: true,
        disabled: false,
        active: true,
        onSelect
      }),
      container
    );
    await Promise.resolve();
    const btn = container.querySelector('button')!;
    expect(btn.id).toBe('o1');
    expect(btn.className).toBe('option');
    expect(btn.getAttribute('role')).toBe('option');
    expect(btn.getAttribute('aria-selected')).toBe('true');
    expect(btn.getAttribute('data-active')).toBe('true');
    expect(container.querySelector('.option-icon')?.getAttribute('name')).toBe('leaf');
    expect(container.querySelector('.option-label')?.textContent).toBe('Apple');
    expect(container.querySelector('.option-description')?.textContent).toBe('Green');
    btn.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders a create row with option-create class and plus icon', async () => {
    const onSelect = vi.fn();
    render(
      renderListboxOption({
        id: 'create',
        label: 'Create "x"',
        icon: 'plus',
        selected: false,
        disabled: false,
        active: true,
        create: true,
        onSelect
      }),
      container
    );
    await Promise.resolve();
    const btn = container.querySelector('button')!;
    expect(btn.className).toBe('option option-create');
    expect(btn.getAttribute('aria-selected')).toBe('false');
    expect(container.querySelector('.option-icon')?.getAttribute('name')).toBe('plus');
  });

  it('defaults selected/disabled/active to false', async () => {
    render(renderListboxOption({ id: 'o2', label: 'Banana', onSelect: () => {} }), container);
    await Promise.resolve();
    const btn = container.querySelector('button')!;
    expect(btn.getAttribute('aria-selected')).toBe('false');
    expect(btn.hasAttribute('disabled')).toBe(false);
    expect(btn.getAttribute('data-active')).toBe('false');
  });
});

describe('renderListboxGroups', () => {
  it('wraps grouped runs and leaves ungrouped runs flat', async () => {
    const container = document.createElement('div');
    const items = [
      { value: 'a', label: 'A', group: 'Fruit' },
      { value: 'b', label: 'B', group: 'Fruit' },
      { value: 'c', label: 'C' }
    ];
    render(html`${renderListboxGroups(items, (item) => html`<div class="i">${item.label}</div>`)}`, container);
    await Promise.resolve();
    expect(container.querySelectorAll('.option-group').length).toBe(1);
    const group = container.querySelector('.option-group')!;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Fruit');
    expect(group.querySelector('.option-group-label')?.getAttribute('aria-hidden')).toBe('true');
    expect(group.querySelectorAll('.i').length).toBe(2);
    expect(container.querySelectorAll('.i').length).toBe(3);
  });
});

describe('renderListboxLoading', () => {
  it('renders a loading state with spinner and caption', async () => {
    const container = document.createElement('div');
    render(renderListboxLoading('Loading…'), container);
    await Promise.resolve();
    expect(container.querySelector('.loading-state')).not.toBeNull();
    expect(container.querySelector('lt-spinner')).not.toBeNull();
    expect(container.querySelector('lt-text')?.textContent).toBe('Loading…');
  });
});
