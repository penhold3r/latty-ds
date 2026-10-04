import { render } from '@testing-library/react';
import { Calendar } from './components/Calendar/Calendar';
import { Checkbox } from './components/Checkbox/Checkbox';
import { DropdownItem } from './components/DropdownItem/DropdownItem';
import { Image } from './components/Image/Image';
import { Pagination } from './components/Pagination/Pagination';
import { Select } from './components/Select/Select';
import { Slider } from './components/Slider/Slider';

const fire = (container: HTMLElement, tag: string, name: string, detail?: unknown) =>
  container.querySelector(tag)!.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));

// Every wrapper handler receives the event itself, typed with its payload. This file is also a type-level check:
// `pnpm typecheck` fails if a handler's event type doesn't allow the `e.detail.*` reads below (or if a native React
// handler type such as onSelect/onLoad/onError leaks into the intersection).
describe('event-first handlers', () => {
  it('pass the event, with the typed payload on e.detail', () => {
    const seen: unknown[] = [];
    const { container } = render(
      <>
        <Select onChange={(e) => seen.push(['select', e.detail.value])} />
        <Checkbox onChange={(e) => seen.push(['checkbox', e.detail.checked])} />
        <Pagination onChange={(e) => seen.push(['pagination', e.detail.page])} />
        <Slider onInput={(e) => seen.push(['slider', e.detail.value])} />
        <Calendar onMonthChange={(e) => seen.push(['month', e.detail.year, e.detail.month])} />
        <DropdownItem onSelect={(e) => seen.push(['item', e.detail])} />
        <Image onError={(e) => seen.push(['error', e.detail.src])} />
      </>
    );

    fire(container, 'lt-select', 'change', { value: 'ca' });
    fire(container, 'lt-checkbox', 'change', { checked: true });
    fire(container, 'lt-pagination', 'change', { page: 3 });
    fire(container, 'lt-slider', 'input', { value: 40 });
    fire(container, 'lt-calendar', 'monthchange', { year: 2026, month: 5 });
    fire(container, 'lt-dropdown-item', 'select', { item: 'x' });
    fire(container, 'lt-image', 'error', { src: 'a.png' });

    expect(seen).toEqual([
      ['select', 'ca'],
      ['checkbox', true],
      ['pagination', 3],
      ['slider', 40],
      ['month', 2026, 5],
      ['item', { item: 'x' }],
      ['error', 'a.png']
    ]);
  });

  it('hand over the real event, so the consumer can stop it or read its target', () => {
    const outer = vi.fn();
    const inner = vi.fn((e: CustomEvent<{ value: string | string[] }>) => {
      e.stopPropagation();
      return e.target;
    });
    const { container } = render(
      <div
        ref={(el) => {
          el?.addEventListener('change', outer);
        }}
      >
        <Select onChange={inner} />
      </div>
    );

    fire(container, 'lt-select', 'change', { value: 'ca' });

    expect(inner).toHaveBeenCalledOnce();
    expect(inner.mock.results[0].value).toBe(container.querySelector('lt-select'));
    expect(outer).not.toHaveBeenCalled();
  });
});
