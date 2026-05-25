import { computePosition, autoUpdate, offset, flip, shift, type Placement } from '@floating-ui/dom';
import { css, type CSSResult } from 'lit';

export interface FloatingOptions {
  placement?: Placement;
  offsetPx?: number;
  matchWidth?: boolean;
}

export async function openFloating(
  reference: Element,
  floating: HTMLElement,
  opts?: FloatingOptions
): Promise<() => void> {
  const { placement = 'bottom-start', offsetPx = 4, matchWidth = false } = opts ?? {};

  floating.style.display = 'block';
  floating.style.visibility = 'hidden';
  (floating as HTMLElement & { showPopover?(): void }).showPopover?.();

  const reposition = async () => {
    if (matchWidth) {
      floating.style.width = `${(reference as HTMLElement).getBoundingClientRect().width}px`;
    }
    const { x, y } = await computePosition(reference, floating, {
      strategy: 'fixed',
      placement,
      middleware: [offset(offsetPx), flip(), shift({ padding: 8 })]
    });
    floating.style.left = `${x}px`;
    floating.style.top = `${y}px`;
  };

  await reposition();
  floating.style.visibility = '';

  const cleanup = autoUpdate(reference, floating, reposition);
  return cleanup;
}

export function closeFloating(floating: HTMLElement, cleanup: (() => void) | null): void {
  cleanup?.();
  (floating as HTMLElement & { hidePopover?(): void }).hidePopover?.();
  floating.style.display = '';
}

export const floatingPanelReset: CSSResult = css`
  [popover] {
    border: 0;
    inset: unset;
    margin: 0;
    overflow: visible;
    padding: 0;
    position: fixed;
  }
`;
