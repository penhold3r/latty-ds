import type { IconProvider } from '../types/provider.types.js';

type RegistryListener = () => void;

class IconRegistry {
  private icons = new Map<string, string>();
  private providers: IconProvider[] = [];
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
   * Register an external icon provider as a fallback source.
   * Providers are checked in registration order after built-in and custom icons.
   * @param {IconProvider} provider - The provider to register.
   */
  registerProvider(provider: IconProvider): void {
    if (this.providers.some((p) => p.name === provider.name)) {
      this.removeProvider(provider.name);
    }
    this.providers.push(provider);
    this.scheduleNotify();
  }

  /**
   * Remove a provider by name.
   * @param {string} name - The provider name to remove.
   */
  removeProvider(name: string): void {
    const idx = this.providers.findIndex((p) => p.name === name);
    if (idx !== -1) {
      this.providers.splice(idx, 1);
      this.scheduleNotify();
    }
  }

  /**
   * Returns registered provider names in resolution order.
   * @returns {string[]} Provider names.
   */
  getProviders(): string[] {
    return this.providers.map((p) => p.name);
  }

  /**
   * Resolve an icon by name.
   * Order: custom/built-in icons → providers (in registration order).
   * @param {string} name - The icon name to look up.
   * @returns {string | undefined} The SVG markup, or undefined if not found.
   */
  getIcon(name: string): string | undefined {
    const direct = this.icons.get(name);
    if (direct !== undefined) return direct;

    for (const provider of this.providers) {
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
    for (const provider of this.providers) {
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
    this.providers = [];
  }
}

export const iconRegistry = new IconRegistry();
