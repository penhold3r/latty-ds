import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { AvatarGroup } from '../avatar-group';
import '../avatar-group';
import '../../avatar/avatar';
import type { Avatar } from '../../avatar/avatar';

describe('<lt-avatar-group>', () => {
  let el: AvatarGroup;

  beforeEach(async () => {
    el = document.createElement('lt-avatar-group') as AvatarGroup;
    el.innerHTML = `
      <lt-avatar name="Ada Lovelace"></lt-avatar>
      <lt-avatar name="Grace Hopper"></lt-avatar>
      <lt-avatar name="Margaret Hamilton"></lt-avatar>
      <lt-avatar name="Katherine Johnson"></lt-avatar>
      <lt-avatar name="Hedy Lamarr"></lt-avatar>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const avatars = () => [...el.querySelectorAll('lt-avatar')] as Avatar[];
  const overflow = () => el.shadowRoot!.querySelector<HTMLElement>('.overflow');

  it('renders a shadow root', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slotted avatars', () => {
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
    expect(avatars()).toHaveLength(5);
  });

  it('shows all avatars and no overflow indicator by default', () => {
    avatars().forEach((a) => expect(a.hasAttribute('hidden')).toBe(false));
    expect(overflow()).toBeNull();
  });

  it('does not force a size on avatars by default', () => {
    avatars().forEach((a) => expect(a.size).toBe('md')); // lt-avatar's own default, untouched
  });

  it('leaves a non-default size alone when the group size is unset', async () => {
    const [a1] = avatars();
    a1.size = 'xl';
    await el.updateComplete;
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect(a1.size).toBe('xl');
  });

  describe('max', () => {
    beforeEach(async () => {
      el.max = 3;
      await el.updateComplete;
    });

    it('hides avatars past max', () => {
      const [a1, a2, a3, a4, a5] = avatars();
      expect(a1.hasAttribute('hidden')).toBe(false);
      expect(a2.hasAttribute('hidden')).toBe(false);
      expect(a3.hasAttribute('hidden')).toBe(false);
      expect(a4.hasAttribute('hidden')).toBe(true);
      expect(a5.hasAttribute('hidden')).toBe(true);
    });

    // lt-avatar's own `:host { display: inline-flex }` is author CSS, which outranks the UA stylesheet's
    // `[hidden] { display: none }` regardless of specificity — confirmed live in Chromium that the `hidden`
    // attribute/property alone silently does nothing, every avatar stayed visible. This asserts the actual fix
    // (an inline style, which beats any selector-based rule including :host's), not just the semantic attribute
    // jsdom's lack of a real cascade can't tell apart from a genuinely-hidden element.
    it('forces display:none via inline style past max, not just the hidden attribute', () => {
      const [a1, a2, a3, a4, a5] = avatars();
      expect(a1.style.display).toBe('');
      expect(a2.style.display).toBe('');
      expect(a3.style.display).toBe('');
      expect(a4.style.display).toBe('none');
      expect(a5.style.display).toBe('none');
    });

    it('shows a +N overflow indicator for the hidden count', () => {
      expect(overflow()!.textContent!.trim()).toBe('+2');
    });

    it('gives the overflow indicator an accessible label', () => {
      expect(overflow()!.getAttribute('aria-label')).toBe('+2 more');
      expect(overflow()!.getAttribute('role')).toBe('img');
    });

    it('overrides the overflow label for i18n', async () => {
      el.overflowLabel = '{n} autres';
      await el.updateComplete;
      expect(overflow()!.getAttribute('aria-label')).toBe('2 autres');
    });

    it('removes the overflow indicator once max covers everyone', async () => {
      el.max = 10;
      await el.updateComplete;
      expect(overflow()).toBeNull();
      avatars().forEach((a) => expect(a.hasAttribute('hidden')).toBe(false));
    });

    it('removes the overflow indicator entirely when max is unset again', async () => {
      el.max = undefined;
      await el.updateComplete;
      expect(overflow()).toBeNull();
      avatars().forEach((a) => expect(a.hasAttribute('hidden')).toBe(false));
    });
  });

  describe('size', () => {
    it('forwards size to every avatar when set', async () => {
      el.size = 'sm';
      await el.updateComplete;
      avatars().forEach((a) => expect(a.size).toBe('sm'));
    });

    it('reflects size to the host attribute', async () => {
      el.size = 'lg';
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe('lg');
    });
  });

  describe('dynamic children', () => {
    it('applies max/size to a newly-slotted avatar via slotchange', async () => {
      el.max = 3;
      el.size = 'sm';
      await el.updateComplete;

      const f = document.createElement('lt-avatar') as Avatar;
      f.name = 'New Person';
      el.appendChild(f);
      el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
      await el.updateComplete;

      expect(f.size).toBe('sm');
      expect(f.hasAttribute('hidden')).toBe(true); // 6th avatar, past max of 3
      expect(overflow()!.textContent!.trim()).toBe('+3');
    });

    it('re-syncs after being moved in the DOM (reconnected)', async () => {
      el.max = 3;
      await el.updateComplete;

      const otherParent = document.createElement('div');
      document.body.appendChild(otherParent);
      otherParent.appendChild(el); // disconnects then reconnects `el`
      await el.updateComplete;

      expect(overflow()!.textContent!.trim()).toBe('+2');
      otherParent.remove();
    });
  });
});
