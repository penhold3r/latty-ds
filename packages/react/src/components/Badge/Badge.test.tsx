import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders lt-badge', () => {
    const { container } = render(<Badge />);
    expect(container.querySelector('lt-badge')).toBeTruthy();
  });

  it('passes content as attribute', () => {
    const { container } = render(<Badge content="5" />);
    expect(container.querySelector('lt-badge')?.getAttribute('content')).toBe('5');
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Badge variant="primary" />);
    expect(container.querySelector('lt-badge')?.getAttribute('variant')).toBe('primary');
  });

  it('passes dot as attribute', () => {
    const { container } = render(<Badge dot />);
    expect(container.querySelector('lt-badge')).toHaveAttribute('dot');
  });

  it('forwards ref to lt-badge element', () => {
    const ref = createRef<any>();
    render(<Badge ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-badge');
  });
});
