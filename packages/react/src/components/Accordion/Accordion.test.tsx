import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders lt-accordion', () => {
    const { container } = render(<Accordion>Content</Accordion>);
    expect(container.querySelector('lt-accordion')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Accordion label="Section">Content</Accordion>);
    expect(container.querySelector('lt-accordion')?.getAttribute('label')).toBe('Section');
  });

  it('passes open as attribute', () => {
    const { container } = render(<Accordion open>Content</Accordion>);
    expect(container.querySelector('lt-accordion')).toHaveAttribute('open');
  });

  it('forwards ref to lt-accordion element', () => {
    const ref = createRef<any>();
    render(<Accordion ref={ref}>Content</Accordion>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-accordion');
  });

  it('calls onToggle when toggle event fires', () => {
    const onToggle = vi.fn();
    const { container } = render(<Accordion onToggle={onToggle}>Content</Accordion>);
    container.querySelector('lt-accordion')!.dispatchEvent(new CustomEvent('toggle'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('removes toggle listener on unmount', () => {
    const onToggle = vi.fn();
    const { container, unmount } = render(<Accordion onToggle={onToggle}>Content</Accordion>);
    const el = container.querySelector('lt-accordion')!;
    unmount();
    el.dispatchEvent(new CustomEvent('toggle'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
