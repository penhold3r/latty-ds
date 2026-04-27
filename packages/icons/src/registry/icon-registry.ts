class IconRegistry {
  private icons = new Map<string, string>();

  registerIcon(name: string, svg: string): void {
    this.icons.set(name, svg);
  }

  registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => {
      this.icons.set(name, svg);
    });
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
