import { describe, it, expect, vi } from 'vitest';
import { dispatch } from '../dispatch';

describe('dispatch', () => {
  it('should dispatch a custom event with default options', () => {
    const host = document.createElement('div');
    const handler = vi.fn();
    host.addEventListener('test-event', handler);

    dispatch(host, 'test-event', { foo: 'bar' });

    expect(handler).toHaveBeenCalled();
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('test-event');
    expect(event.detail).toEqual({ foo: 'bar' });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('should respect cancelable option', () => {
    const host = document.createElement('div');
    const handler = vi.fn((e: Event) => e.preventDefault());
    host.addEventListener('test-event', handler);

    const result = dispatch(host, 'test-event', null, { cancelable: true });

    expect(result).toBe(false);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.cancelable).toBe(true);
  });
});
