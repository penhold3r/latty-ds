import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Icon } from '../icon';
import { iconRegistry } from '../../registry/icon-registry';
import '../../index'; // Import to trigger auto-registration
import '../icon';

describe('<lt-icon>', () => {
  let el: Icon;

  beforeEach(async () => {
    el = document.createElement('lt-icon') as Icon;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders an icon from the registry', async () => {
    iconRegistry.registerIcon('test-icon', '<svg><circle /></svg>');
    el.name = 'test-icon';
    await el.updateComplete;
    await el.updateComplete; // Wait for the icon to be loaded and rendered

    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('supports all sizes', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('renders nothing when name is empty', async () => {
    el.name = '';
    await el.updateComplete;
    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).toBeFalsy();
  });

  it('warns when icon is not found', async () => {
    const consoleWarn = vi.spyOn(console, 'warn');
    el.name = 'non-existent-icon';
    await el.updateComplete;

    expect(consoleWarn).toHaveBeenCalledWith(
      'Icon "non-existent-icon" not found in registry'
    );
    consoleWarn.mockRestore();
  });

  it('updates icon when name changes', async () => {
    iconRegistry.registerIcon('icon-1', '<svg><circle cx="10" /></svg>');
    iconRegistry.registerIcon('icon-2', '<svg><rect /></svg>');

    el.name = 'icon-1';
    await el.updateComplete;
    let svg = el.shadowRoot!.innerHTML;
    expect(svg).toContain('circle');

    el.name = 'icon-2';
    await el.updateComplete;
    svg = el.shadowRoot!.innerHTML;
    expect(svg).toContain('rect');
  });

  it('removes width and height attributes from SVG', async () => {
    iconRegistry.registerIcon(
      'sized-icon',
      '<svg width="24" height="24"><circle /></svg>'
    );
    el.name = 'sized-icon';
    await el.updateComplete;

    const svgHtml = el.shadowRoot!.innerHTML;
    expect(svgHtml).not.toMatch(/width="/);
    expect(svgHtml).not.toMatch(/height="/);
  });

  it('reflects size property to attribute', async () => {
    el.size = 'xl';
    await el.updateComplete;
    expect(el.hasAttribute('size')).toBe(true);
    expect(el.getAttribute('size')).toBe('xl');
  });

  it('reflects name property to attribute', async () => {
    el.name = 'test';
    await el.updateComplete;
    expect(el.hasAttribute('name')).toBe(true);
    expect(el.getAttribute('name')).toBe('test');
  });

  it('renders common icons from iconoir provider', async () => {
    el.name = 'check';
    await el.updateComplete;
    await el.updateComplete; // Wait for the icon to be loaded and rendered

    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
