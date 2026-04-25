import type { IconProvider } from '../types/icons.types';

/**
 * Global icon registry singleton
 * Manages icon providers and custom icon overrides
 */
class IconRegistry {
  private providers = new Map<string, IconProvider>();
  private customIcons = new Map<string, string>();
  private defaultProvider: string | null = null;

  /**
   * Register an icon provider (e.g., iconoir, custom)
   */
  registerProvider(provider: IconProvider, isDefault = false): void {
    this.providers.set(provider.name, provider);
    if (isDefault || this.defaultProvider === null) {
      this.defaultProvider = provider.name;
    }
  }

  /**
   * Register a single custom icon (overrides provider icons)
   */
  registerIcon(name: string, svg: string): void {
    this.customIcons.set(name, svg);
  }

  /**
   * Register multiple custom icons at once
   */
  registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => {
      this.customIcons.set(name, svg);
    });
  }

  /**
   * Get an icon SVG by name
   * Priority: custom icons > default provider > all providers
   */
  getIcon(name: string): string | undefined {
    // Check custom icons first
    if (this.customIcons.has(name)) {
      return this.customIcons.get(name);
    }

    // Check default provider
    if (this.defaultProvider) {
      const provider = this.providers.get(this.defaultProvider);
      const icon = provider?.getIcon(name);
      if (icon) return icon;
    }

    // Check all providers as fallback
    for (const provider of this.providers.values()) {
      const icon = provider.getIcon(name);
      if (icon) return icon;
    }

    return undefined;
  }

  /**
   * Set the default provider
   */
  setDefaultProvider(providerName: string): void {
    if (this.providers.has(providerName)) {
      this.defaultProvider = providerName;
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Provider "${providerName}" not found`);
    }
  }

  /**
   * Check if an icon exists
   */
  hasIcon(name: string): boolean {
    return this.getIcon(name) !== undefined;
  }

  /**
   * Get all available icon names
   */
  getAvailableIcons(): string[] {
    const names = new Set<string>();

    // Add custom icons
    this.customIcons.forEach((_, name) => names.add(name));

    // Add provider icons
    this.providers.forEach(provider => {
      provider.getAllIcons().forEach((_, name) => names.add(name));
    });

    return Array.from(names).sort();
  }

  /**
   * Clear all custom icons
   */
  clearCustomIcons(): void {
    this.customIcons.clear();
  }

  /**
   * Reset the registry
   */
  reset(): void {
    this.providers.clear();
    this.customIcons.clear();
    this.defaultProvider = null;
  }
}

// Export singleton instance
export const iconRegistry = new IconRegistry();
