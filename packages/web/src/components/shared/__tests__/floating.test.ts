import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { openFloating, closeFloating } from '../floating';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 100, y: 200 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

describe('openFloating', () => {
  let reference: HTMLElement;
  let floating: HTMLElement;

  beforeEach(() => {
    reference = document.createElement('button');
    floating = document.createElement('div');
    (floating as any).showPopover = vi.fn();
    (floating as any).hidePopover = vi.fn();
    document.body.appendChild(reference);
    document.body.appendChild(floating);
  });

  afterEach(() => {
    reference.remove();
    floating.remove();
    vi.clearAllMocks();
  });

  it('sets display block and visibility hidden before showPopover, reveals after', async () => {
    let displayAtShowPopover = '';
    let visibilityAtShowPopover = '';
    (floating as any).showPopover.mockImplementation(() => {
      displayAtShowPopover = floating.style.display;
      visibilityAtShowPopover = floating.style.visibility;
    });
    await openFloating(reference, floating);
    expect(displayAtShowPopover).toBe('block');
    expect(visibilityAtShowPopover).toBe('hidden');
    expect(floating.style.visibility).toBe('');
  });

  it('sets left and top from computePosition result', async () => {
    await openFloating(reference, floating);
    expect(floating.style.left).toBe('100px');
    expect(floating.style.top).toBe('200px');
  });

  it('returns the autoUpdate cleanup function', async () => {
    const { autoUpdate } = await import('@floating-ui/dom');
    const mockCleanup = vi.fn();
    (autoUpdate as ReturnType<typeof vi.fn>).mockReturnValueOnce(mockCleanup);
    const cleanup = await openFloating(reference, floating);
    expect(cleanup).toBe(mockCleanup);
  });

  it('sets floating width to match reference when matchWidth is true', async () => {
    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 40,
      top: 0,
      left: 0,
      right: 200,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect);
    await openFloating(reference, floating, { matchWidth: true });
    expect(floating.style.width).toBe('200px');
  });

  it('does not set width when matchWidth is false', async () => {
    await openFloating(reference, floating);
    expect(floating.style.width).toBe('');
  });

  it('skips showPopover gracefully when not available', async () => {
    delete (floating as any).showPopover;
    await expect(openFloating(reference, floating)).resolves.toBeDefined();
  });
});

describe('closeFloating', () => {
  it('calls cleanup, calls hidePopover, and resets display', () => {
    const floating = document.createElement('div');
    const hidePopover = vi.fn();
    (floating as any).hidePopover = hidePopover;
    floating.style.display = 'block';
    const cleanup = vi.fn();
    closeFloating(floating, cleanup);
    expect(cleanup).toHaveBeenCalledOnce();
    expect(hidePopover).toHaveBeenCalledOnce();
    expect(floating.style.display).toBe('');
  });

  it('handles null cleanup gracefully', () => {
    const floating = document.createElement('div');
    (floating as any).hidePopover = vi.fn();
    expect(() => closeFloating(floating, null)).not.toThrow();
  });

  it('skips hidePopover gracefully when not available', () => {
    const floating = document.createElement('div');
    expect(() => closeFloating(floating, null)).not.toThrow();
  });
});
