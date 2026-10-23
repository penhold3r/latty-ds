import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import {
  getColumnMinWidthPx,
  formatColumnWidth,
  startColumnResize,
  handleColumnResizeKeydown,
  DEFAULT_MIN_COLUMN_WIDTH,
  RESIZE_KEY_STEP,
  type ColumnResizeHandlers
} from '../column-resize';
import type { TableColumn } from '../../table/table.types';

const column: TableColumn<unknown> = { key: 'name', label: 'Name', resizable: true };

const pointerEvent = (type: string, clientX: number, init: PointerEventInit = {}) => {
  const event = new PointerEvent(type, { clientX, pointerId: 1, bubbles: true, ...init });
  if (init.pointerType) Object.defineProperty(event, 'pointerType', { value: init.pointerType });
  return event;
};

describe('getColumnMinWidthPx', () => {
  it("uses the column's own minWidth when it parses", () => {
    expect(getColumnMinWidthPx({ ...column, minWidth: '80px' })).toBe(80);
  });

  it('falls back to the default floor when no minWidth is set', () => {
    expect(getColumnMinWidthPx(column)).toBe(DEFAULT_MIN_COLUMN_WIDTH);
  });

  it('never returns anything below the shared floor', () => {
    expect(getColumnMinWidthPx({ ...column, minWidth: '10px' })).toBe(DEFAULT_MIN_COLUMN_WIDTH);
  });

  it('falls back to the floor when minWidth is unparseable', () => {
    expect(getColumnMinWidthPx({ ...column, minWidth: '10%' })).toBe(DEFAULT_MIN_COLUMN_WIDTH);
  });
});

describe('formatColumnWidth', () => {
  it('rounds to whole pixels', () => {
    expect(formatColumnWidth(249.6)).toBe('250px');
  });
});

describe('startColumnResize', () => {
  let handle: HTMLDivElement;
  let handlers: ColumnResizeHandlers;
  let update: Mock<(key: string, width: string) => void>;
  let commit: Mock<(key: string, width: string) => void>;

  beforeEach(() => {
    document.body.innerHTML = '<table><thead><tr><th><div id="handle"></div></th></tr></thead></table>';
    const th = document.querySelector('th') as HTMLElement;
    vi.spyOn(th, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ''
    } as DOMRect);
    handle = document.querySelector('#handle') as HTMLDivElement;
    update = vi.fn<(key: string, width: string) => void>();
    commit = vi.fn<(key: string, width: string) => void>();
    handlers = { update, commit };
  });

  /** Dispatches `pointerdown` through a real listener so `currentTarget` resolves, like the component's own handler. */
  const beginDrag = (down: PointerEvent, col: TableColumn<unknown> = column) => {
    handle.addEventListener('pointerdown', (e) => startColumnResize(e, col, handlers), { once: true });
    handle.dispatchEvent(down);
  };

  it('pushes the in-progress width on every move and the final width once on release', () => {
    beginDrag(pointerEvent('pointerdown', 100, { button: 0 }));
    handle.dispatchEvent(pointerEvent('pointermove', 150));

    expect(update).toHaveBeenLastCalledWith('name', '250px');
    expect(commit).not.toHaveBeenCalled();

    handle.dispatchEvent(pointerEvent('pointerup', 150));
    expect(commit).toHaveBeenCalledExactlyOnceWith('name', '250px');
  });

  it('clamps to the column minWidth while dragging left', () => {
    beginDrag(pointerEvent('pointerdown', 100, { button: 0 }), { ...column, minWidth: '80px' });
    handle.dispatchEvent(pointerEvent('pointermove', -500));

    expect(update).toHaveBeenLastCalledWith('name', '80px');
  });

  it('flips the drag direction under RTL so the visually-dragged edge tracks the cursor', () => {
    handle.style.direction = 'rtl';
    beginDrag(pointerEvent('pointerdown', 100, { button: 0 }));
    handle.dispatchEvent(pointerEvent('pointermove', 150)); // +50 raw → shrinks in RTL

    expect(update).toHaveBeenLastCalledWith('name', '150px');
  });

  it('ignores a non-primary mouse press', () => {
    beginDrag(pointerEvent('pointerdown', 100, { button: 2, pointerType: 'mouse' }));
    handle.dispatchEvent(pointerEvent('pointermove', 150));

    expect(update).not.toHaveBeenCalled();
  });

  it('does not commit when the pointer is released without any movement', () => {
    beginDrag(pointerEvent('pointerdown', 100, { button: 0 }));
    handle.dispatchEvent(pointerEvent('pointerup', 100));

    expect(commit).not.toHaveBeenCalled();
  });
});

describe('handleColumnResizeKeydown', () => {
  it('grows the column on ArrowRight by one step', () => {
    const update = vi.fn();
    const commit = vi.fn();
    handleColumnResizeKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), column, 200, { update, commit });

    expect(update).toHaveBeenCalledWith('name', `${200 + RESIZE_KEY_STEP}px`);
    expect(commit).toHaveBeenCalledWith('name', `${200 + RESIZE_KEY_STEP}px`);
  });

  it('shrinks the column on ArrowLeft by one step', () => {
    const update = vi.fn();
    handleColumnResizeKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), column, 200, {
      update,
      commit: vi.fn()
    });

    expect(update).toHaveBeenCalledWith('name', `${200 - RESIZE_KEY_STEP}px`);
  });

  it('clamps to the min width rather than shrinking below it', () => {
    const update = vi.fn();
    handleColumnResizeKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), column, 45, {
      update,
      commit: vi.fn()
    });

    expect(update).toHaveBeenCalledWith('name', `${DEFAULT_MIN_COLUMN_WIDTH}px`);
  });

  it('ignores other keys', () => {
    const update = vi.fn();
    const commit = vi.fn();
    handleColumnResizeKeydown(new KeyboardEvent('keydown', { key: 'Enter' }), column, 200, { update, commit });

    expect(update).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });
});
