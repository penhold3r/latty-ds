import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ListItem } from '../list-item';
import '../list-item';

describe('<lt-list-item>', () => {
  let el: ListItem;

  beforeEach(async () => {
    el = document.createElement('lt-list-item') as ListItem;
    el.textContent = 'Item content';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a non-interactive div row by default', () => {
    expect(el.shadowRoot!.querySelector('div.inner')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('button')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('a')).toBeFalsy();
  });

  it('sets role="listitem" on the host', () => {
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('wraps the slot in a .content wrapper', () => {
    const content = el.shadowRoot!.querySelector('.content');
    expect(content).toBeTruthy();
    expect(content!.querySelector('slot')).toBeTruthy();
  });

  describe('clickable', () => {
    beforeEach(async () => {
      el.clickable = true;
      await el.updateComplete;
    });

    it('renders a native button row', () => {
      const btn = el.shadowRoot!.querySelector('button.inner');
      expect(btn).toBeTruthy();
      expect(btn!.getAttribute('type')).toBe('button');
      expect(el.shadowRoot!.querySelector('div.inner')).toBeFalsy();
    });

    it('keeps the content wrapper inside the button', () => {
      expect(el.shadowRoot!.querySelector('button.inner .content slot')).toBeTruthy();
    });

    it('emits a composed click consumers can listen for', async () => {
      const onClick = vi.fn();
      el.addEventListener('click', onClick);
      el.shadowRoot!.querySelector('button')!.click();
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('disables the button when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('button')! as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });
  });

  describe('href', () => {
    beforeEach(async () => {
      el.href = '/settings/profile';
      await el.updateComplete;
    });

    it('renders an anchor row', () => {
      const a = el.shadowRoot!.querySelector('a.inner')!;
      expect(a).toBeTruthy();
      expect(a.getAttribute('href')).toBe('/settings/profile');
      expect(el.shadowRoot!.querySelector('button')).toBeFalsy();
    });

    it('takes precedence over clickable', async () => {
      el.clickable = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a.inner')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button')).toBeFalsy();
    });

    it('forwards target to the anchor', async () => {
      el.target = '_blank';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('target')).toBe('_blank');
    });

    it('auto-sets rel=noopener noreferrer when target=_blank', async () => {
      el.target = '_blank';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('uses explicit rel when provided', async () => {
      el.target = '_blank';
      el.rel = 'noopener';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener');
    });

    it('sets aria-disabled and removes from tab order when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;
      const a = el.shadowRoot!.querySelector('a')!;
      expect(a.getAttribute('aria-disabled')).toBe('true');
      expect(a.getAttribute('tabindex')).toBe('-1');
    });
  });
});
