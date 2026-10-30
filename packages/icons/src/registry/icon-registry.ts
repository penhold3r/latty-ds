import type { IconProvider, ProviderOptions } from '../types/provider.types.js';

type RegistryListener = () => void;

class IconRegistry {
  private icons = new Map<string, string>();
  private overrideProviders: IconProvider[] = [];
  private fallbackProviders: IconProvider[] = [];
  private listeners = new Set<RegistryListener>();
  private pendingNotify = false;

  subscribe(listener: RegistryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  private scheduleNotify(): void {
    if (!this.pendingNotify) {
      this.pendingNotify = true;
      queueMicrotask(() => {
        this.pendingNotify = false;
        this.notify();
      });
    }
  }

  /**
   * Register a single icon. SVG is rendered as-is — never pass untrusted input.
   * @param {string} name - The icon name.
   * @param {string} svg - Raw SVG markup (rendered via unsafeSVG).
   */
  registerIcon(name: string, svg: string): void {
    if (import.meta.env?.DEV !== false) {
      const existing = this.icons.get(name);
      if (existing !== undefined && existing !== svg) {
        // eslint-disable-next-line no-console
        console.warn(`[IconRegistry] overwriting "${name}" with different SVG`);
      }
    }
    this.icons.set(name, svg);
    this.scheduleNotify();
  }

  /**
   * Register multiple icons at once. SVG values are rendered as-is — never pass untrusted input.
   * @param {Record<string, string>} icons - Map of icon names to raw SVG markup.
   */
  registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => {
      this.icons.set(name, svg);
    });
    this.scheduleNotify();
  }

  /**
   * Register an external icon provider.
   *
   * By default (`priority: 'override'`), the provider is checked **before**
   * built-in icons — its icons replace Latty's everywhere, including inside
   * components like checkbox and select.
   *
   * Pass `{ priority: 'fallback' }` to check the provider only when no
   * built-in or custom icon matches.
   * @param {IconProvider} provider - The provider to register.
   * @param {ProviderOptions} [options] - Registration options.
   */
  registerProvider(provider: IconProvider, options?: ProviderOptions): void {
    this.removeProvider(provider.name);
    const list = options?.priority === 'fallback' ? this.fallbackProviders : this.overrideProviders;
    list.push(provider);
    this.scheduleNotify();
  }

  /**
   * Remove a provider by name (from either tier).
   * @param {string} name - The provider name to remove.
   */
  removeProvider(name: string): void {
    const removed =
      this.removeFromList(this.overrideProviders, name) || this.removeFromList(this.fallbackProviders, name);
    if (removed) this.scheduleNotify();
  }

  private removeFromList(list: IconProvider[], name: string): boolean {
    const idx = list.findIndex((p) => p.name === name);
    if (idx !== -1) {
      list.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Returns registered provider names in resolution order
   * (override providers first, then fallback).
   * @returns {string[]} Provider names.
   */
  getProviders(): string[] {
    return [...this.overrideProviders, ...this.fallbackProviders].map((p) => p.name);
  }

  /**
   * Resolve an icon by name.
   * Order: override providers → built-in/custom icons → fallback providers.
   * @param {string} name - The icon name to look up.
   * @returns {string | undefined} The SVG markup, or undefined if not found.
   */
  getIcon(name: string): string | undefined {
    for (const provider of this.overrideProviders) {
      const svg = provider.getIcon(name);
      if (svg !== undefined) return svg;
    }

    const direct = this.icons.get(name);
    if (direct !== undefined) return direct;

    for (const provider of this.fallbackProviders) {
      const svg = provider.getIcon(name);
      if (svg !== undefined) return svg;
    }

    return undefined;
  }

  hasIcon(name: string): boolean {
    return this.getIcon(name) !== undefined;
  }

  getAvailableIcons(): string[] {
    const names = new Set(this.icons.keys());
    for (const provider of [...this.overrideProviders, ...this.fallbackProviders]) {
      if (provider.listIcons) {
        for (const name of provider.listIcons()) {
          names.add(name);
        }
      }
    }
    return Array.from(names).sort();
  }

  reset(): void {
    this.icons.clear();
    this.overrideProviders = [];
    this.fallbackProviders = [];
  }
}

export const iconRegistry = new IconRegistry();
