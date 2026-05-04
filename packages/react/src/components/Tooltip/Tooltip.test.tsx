import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders lt-tooltip', () => {
    const { container } = render(<Tooltip><span>Hover me</span></Tooltip>);
    expect(container.querySelector('lt-tooltip')).toBeTruthy();
  });

  it('passes content as attribute', () => {
    const { container } = render(<Tooltip content="Helpful hint"><span>Hover</span></Tooltip>);
    expect(container.querySelector('lt-tooltip')?.getAttribute('content')).toBe('Helpful hint');
  });

  it('passes position as attribute', () => {
    const { container } = render(<Tooltip position="top"><span>Hover</span></Tooltip>);
    expect(container.querySelector('lt-tooltip')?.getAttribute('position')).toBe('top');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Tooltip disabled><span>Hover</span></Tooltip>);
    expect(container.querySelector('lt-tooltip')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-tooltip element', () => {
    const ref = createRef<any>();
    render(<Tooltip ref={ref}><span>Hover</span></Tooltip>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-tooltip');
  });
});
