import { describe, it, expect, beforeEach, vi } from 'vitest';
import { iconRegistry } from '../icon-registry';
import type { IconProvider } from '../../types/provider.types';

describe('IconRegistry', () => {
  beforeEach(() => {
    iconRegistry.reset();
  });

  describe('registerIcon / getIcon', () => {
    it('stores and retrieves an icon', () => {
      iconRegistry.registerIcon('test', '<svg/>');
      expect(iconRegistry.getIcon('test')).toBe('<svg/>');
    });

    it('returns undefined for unregistered icon', () => {
      expect(iconRegistry.getIcon('nope')).toBeUndefined();
    });

    it('overwrites an existing icon', () => {
      iconRegistry.registerIcon('a', '<svg>1</svg>');
      iconRegistry.registerIcon('a', '<svg>2</svg>');
      expect(iconRegistry.getIcon('a')).toBe('<svg>2</svg>');
    });
  });

  describe('registerIcons', () => {
    it('registers multiple icons at once', () => {
      iconRegistry.registerIcons({ x: '<svg>x</svg>', y: '<svg>y</svg>' });
      expect(iconRegistry.getIcon('x')).toBe('<svg>x</svg>');
      expect(iconRegistry.getIcon('y')).toBe('<svg>y</svg>');
    });
  });

  describe('hasIcon', () => {
    it('returns true for registered icon', () => {
      iconRegistry.registerIcon('yes', '<svg/>');
      expect(iconRegistry.hasIcon('yes')).toBe(true);
    });

    it('returns false for missing icon', () => {
      expect(iconRegistry.hasIcon('no')).toBe(false);
    });

    it('returns true for icon available via provider', () => {
      const provider: IconProvider = { name: 'test', getIcon: (n) => (n === 'from-provider' ? '<svg/>' : undefined) };
      iconRegistry.registerProvider(provider);
      expect(iconRegistry.hasIcon('from-provider')).toBe(true);
    });
  });

  describe('getAvailableIcons', () => {
    it('returns sorted icon names', () => {
      iconRegistry.registerIcons({ beta: '<svg/>', alpha: '<svg/>' });
      expect(iconRegistry.getAvailableIcons()).toEqual(['alpha', 'beta']);
    });

    it('includes provider icons when listIcons is implemented', () => {
      iconRegistry.registerIcon('aaa', '<svg/>');
      const provider: IconProvider = { name: 'p', getIcon: () => '<svg/>', listIcons: () => ['zzz', 'mmm'] };
      iconRegistry.registerProvider(provider);
      expect(iconRegistry.getAvailableIcons()).toEqual(['aaa', 'mmm', 'zzz']);
    });

    it('deduplicates names between registry and provider', () => {
      iconRegistry.registerIcon('shared', '<svg>r</svg>');
      const provider: IconProvider = { name: 'p', getIcon: () => '<svg/>', listIcons: () => ['shared'] };
      iconRegistry.registerProvider(provider);
      expect(iconRegistry.getAvailableIcons().filter((n) => n === 'shared')).toHaveLength(1);
    });
  });

  describe('subscribe / notify', () => {
    it('fires listener on registerIcon', () => {
      const listener = vi.fn();
      iconRegistry.subscribe(listener);
      iconRegistry.registerIcon('a', '<svg/>');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('fires listener once on registerIcons', () => {
      const listener = vi.fn();
      iconRegistry.subscribe(listener);
      iconRegistry.registerIcons({ a: '<svg/>', b: '<svg/>', c: '<svg/>' });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('stops notifying after unsubscribe', () => {
      const listener = vi.fn();
      const unsub = iconRegistry.subscribe(listener);
      iconRegistry.registerIcon('a', '<svg/>');
      unsub();
      iconRegistry.registerIcon('b', '<svg/>');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('clears all icons and providers', () => {
      iconRegistry.registerIcon('a', '<svg/>');
      const provider: IconProvider = { name: 'p', getIcon: () => '<svg/>' };
      iconRegistry.registerProvider(provider);
      iconRegistry.reset();
      expect(iconRegistry.getIcon('a')).toBeUndefined();
      expect(iconRegistry.getProviders()).toEqual([]);
    });
  });

  describe('providers', () => {
    const lucide: IconProvider = {
      name: 'lucide',
      getIcon: (name) => (name === 'rocket' ? '<svg>rocket</svg>' : undefined)
    };

    const phosphor: IconProvider = {
      name: 'phosphor',
      getIcon: (name) =>
        name === 'rocket' ? '<svg>phosphor-rocket</svg>' : name === 'atom' ? '<svg>atom</svg>' : undefined
    };

    it('resolves icon from provider when not in registry', () => {
      iconRegistry.registerProvider(lucide);
      expect(iconRegistry.getIcon('rocket')).toBe('<svg>rocket</svg>');
    });

    it('registry icons take priority over providers', () => {
      iconRegistry.registerIcon('rocket', '<svg>custom</svg>');
      iconRegistry.registerProvider(lucide);
      expect(iconRegistry.getIcon('rocket')).toBe('<svg>custom</svg>');
    });

    it('checks providers in registration order', () => {
      iconRegistry.registerProvider(lucide);
      iconRegistry.registerProvider(phosphor);
      expect(iconRegistry.getIcon('rocket')).toBe('<svg>rocket</svg>');
      expect(iconRegistry.getIcon('atom')).toBe('<svg>atom</svg>');
    });

    it('replaces provider with same name on re-register', () => {
      iconRegistry.registerProvider(lucide);
      const lucide2: IconProvider = { name: 'lucide', getIcon: () => '<svg>v2</svg>' };
      iconRegistry.registerProvider(lucide2);
      expect(iconRegistry.getProviders()).toEqual(['lucide']);
      expect(iconRegistry.getIcon('rocket')).toBe('<svg>v2</svg>');
    });

    it('removeProvider removes by name', () => {
      iconRegistry.registerProvider(lucide);
      iconRegistry.removeProvider('lucide');
      expect(iconRegistry.getIcon('rocket')).toBeUndefined();
      expect(iconRegistry.getProviders()).toEqual([]);
    });

    it('removeProvider is a no-op for unknown name', () => {
      const listener = vi.fn();
      iconRegistry.subscribe(listener);
      iconRegistry.removeProvider('nonexistent');
      expect(listener).not.toHaveBeenCalled();
    });

    it('notifies subscribers when provider is added', () => {
      const listener = vi.fn();
      iconRegistry.subscribe(listener);
      iconRegistry.registerProvider(lucide);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('notifies subscribers when provider is removed', () => {
      iconRegistry.registerProvider(lucide);
      const listener = vi.fn();
      iconRegistry.subscribe(listener);
      iconRegistry.removeProvider('lucide');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
