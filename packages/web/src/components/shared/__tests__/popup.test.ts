import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PopupController } from '../popup';

// `vi.mock` is hoisted above the module body, so the cleanup spy has to be hoisted with it.
const { autoUpdateCleanup } = vi.hoisted(() => ({ autoUpdateCleanup: vi.fn() }));

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 100, y: 200 }),
  autoUpdate: vi.fn().mockReturnValue(autoUpdateCleanup),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

describe('PopupController', () => {
  let host: HTMLElement;
  let panel: HTMLElement;
  let reference: HTMLElement;
  let onOutside = vi.fn();
  let controllers: PopupController[];

  const makeController = (overrides: Partial<ConstructorParameters<typeof PopupController>[1]> = {}) => {
    const controller = new PopupController(host, {
      panel: () => panel,
      reference: () => reference,
      onOutside: () => onOutside(),
      ...overrides
    });
    controllers.push(controller);
    return controller;
  };

  beforeEach(() => {
    host = document.createElement('div');
    panel = document.createElement('div');
    reference = document.createElement('button');
    (panel as unknown as { showPopover?: () => void }).showPopover = vi.fn();
    (panel as unknown as { hidePopover?: () => void }).hidePopover = vi.fn();
    document.body.append(host, reference, panel);
    onOutside = vi.fn();
    controllers = [];
    vi.clearAllMocks();
  });

  afterEach(() => {
    /*
     * Every controller installs a document-level listener, so they have to be torn down here —
     * otherwise one test's handler is still listening during the next one.
     */
    controllers.forEach((c) => c.destroy());
    host.remove();
    reference.remove();
    panel.remove();
  });

  it('positions the panel against the reference when it opens', async () => {
    const controller = makeController();
    await controller.open();

    const { computePosition } = await import('@floating-ui/dom');
    expect(computePosition).toHaveBeenCalledOnce();
    expect((computePosition as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(reference);
    expect((computePosition as ReturnType<typeof vi.fn>).mock.calls[0][1]).toBe(panel);
    expect(controller.isOpen).toBe(true);
  });

  it('resolves the floating options on every open, so a changed placement is picked up', async () => {
    const floating = vi.fn().mockReturnValue({ placement: 'bottom-start' });
    const controller = makeController({ floating });
    await controller.open();
    expect(floating).toHaveBeenCalledOnce();

    floating.mockReturnValue({ placement: 'top-end' });
    controller.close();
    await controller.open();
    expect(floating).toHaveBeenCalledTimes(2);
  });

  it('hides the panel and tears the autoUpdate listener down when it closes', async () => {
    const controller = makeController();
    await controller.open();
    controller.close();

    expect(autoUpdateCleanup).toHaveBeenCalledOnce();
    expect((panel as unknown as { hidePopover: () => void }).hidePopover).toHaveBeenCalledOnce();
    expect(panel.style.display).toBe('');
    expect(controller.isOpen).toBe(false);
  });

  it('closes on a click outside the host', async () => {
    const controller = makeController();
    await controller.open();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(onOutside).toHaveBeenCalledOnce();
  });

  it('ignores a click inside the host', async () => {
    const controller = makeController();
    await controller.open();

    host.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(onOutside).not.toHaveBeenCalled();
  });

  it('stops listening for outside clicks once it closes', async () => {
    const controller = makeController();
    await controller.open();
    controller.close();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(onOutside).not.toHaveBeenCalled();
  });

  it('listens for the pointer event it was told to', async () => {
    const controller = makeController({ outsideEvent: 'pointerdown' });
    await controller.open();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(onOutside).not.toHaveBeenCalled();

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));
    expect(onOutside).toHaveBeenCalledOnce();
  });

  it('catches the outside click during the capture phase when it was told to', async () => {
    const controller = makeController({ outsideCapture: true });
    await controller.open();

    /*
     * The target stops the event from bubbling, so only a capture-phase listener on the document
     * ever sees it.
     */
    const inner = document.createElement('button');
    document.body.appendChild(inner);
    inner.addEventListener('click', (e) => e.stopPropagation());
    inner.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onOutside).toHaveBeenCalledOnce();
    inner.remove();
  });

  it('does not see a click the target stopped from bubbling when it listens in the bubble phase', async () => {
    const controller = makeController();
    await controller.open();

    const inner = document.createElement('button');
    document.body.appendChild(inner);
    inner.addEventListener('click', (e) => e.stopPropagation());
    inner.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(onOutside).not.toHaveBeenCalled();
    inner.remove();
  });

  it('does not start a second autoUpdate when it is opened twice', async () => {
    const { autoUpdate } = await import('@floating-ui/dom');
    const controller = makeController();
    await controller.open();
    await controller.open();

    expect(autoUpdate).toHaveBeenCalledOnce();
  });

  it('does not leave the autoUpdate listener running when it closes while the positioning is still pending', async () => {
    const { computePosition } = await import('@floating-ui/dom');
    let resolvePosition: (value: { x: number; y: number }) => void = () => {};
    (computePosition as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise<{ x: number; y: number }>((resolve) => {
        resolvePosition = resolve;
      })
    );

    const controller = makeController();
    const opening = controller.open();
    // The close lands while `openFloating` is still awaiting the position.
    controller.close();
    resolvePosition({ x: 0, y: 0 });
    await opening;

    // The autoUpdate listener the pending open created must be torn down, not orphaned on a hidden panel.
    expect(autoUpdateCleanup).toHaveBeenCalledOnce();
  });

  it('closes on its own when the panel or the reference is missing', async () => {
    const controller = makeController({ panel: () => null });
    await controller.open();

    expect(controller.isOpen).toBe(false);
    expect(onOutside).not.toHaveBeenCalled();
  });

  it('tears everything down when it is destroyed', async () => {
    const controller = makeController();
    await controller.open();
    controller.destroy();

    expect(autoUpdateCleanup).toHaveBeenCalledOnce();
    expect(controller.isOpen).toBe(false);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(onOutside).not.toHaveBeenCalled();
  });
});
