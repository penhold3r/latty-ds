import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClickOutsideHandler } from '../click-outside';

describe('createClickOutsideHandler', () => {
  let host: HTMLElement;
  let onOutside: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    onOutside = vi.fn();
  });

  afterEach(() => {
    if (host.parentNode) {
      document.body.removeChild(host);
    }
    vi.clearAllMocks();
  });

  it('should trigger onOutside when clicking outside', () => {
    createClickOutsideHandler(host, onOutside);

    const outsideElement = document.createElement('span');
    document.body.appendChild(outsideElement);

    outsideElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));

    expect(onOutside).toHaveBeenCalled();
    document.body.removeChild(outsideElement);
  });

  it('should not trigger onOutside when clicking inside', () => {
    createClickOutsideHandler(host, onOutside);

    host.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));

    expect(onOutside).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners when calling returned function', () => {
    const cleanup = createClickOutsideHandler(host, onOutside);
    cleanup();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));

    expect(onOutside).not.toHaveBeenCalled();
  });

  it('should support custom event types', () => {
    createClickOutsideHandler(host, onOutside, { event: 'click' });

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onOutside).toHaveBeenCalled();
  });
});
