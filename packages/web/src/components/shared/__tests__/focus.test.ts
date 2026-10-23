import { describe, expect, it, vi } from 'vitest';
import { preventFocusSteal } from '../focus';

describe('preventFocusSteal', () => {
  it('prevents default on mousedown', () => {
    const event = new MouseEvent('mousedown');
    const spy = vi.spyOn(event, 'preventDefault');
    preventFocusSteal(event);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
