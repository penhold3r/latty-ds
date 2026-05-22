type RegistryListener = () => void;

class IconRegistry {
  private icons = new Map<string, string>();
  private listeners = new Set<RegistryListener>();

  subscribe(listener: RegistryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  registerIcon(name: string, svg: string): void {
    this.icons.set(name, svg);
    this.notify();
  }

  registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => {
      this.icons.set(name, svg);
    });
    this.notify();
  }

  getIcon(name: string): string | undefined {
    return this.icons.get(name);
  }

  hasIcon(name: string): boolean {
    return this.icons.has(name);
  }

  getAvailableIcons(): string[] {
    return Array.from(this.icons.keys()).sort();
  }

  reset(): void {
    this.icons.clear();
  }
}

export const iconRegistry = new IconRegistry();
