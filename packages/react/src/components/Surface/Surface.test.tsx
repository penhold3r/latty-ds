import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Surface } from './Surface';

describe('Surface', () => {
  it('renders lt-surface', () => {
    const { container } = render(<Surface />);
    expect(container.querySelector('lt-surface')).toBeTruthy();
  });

  it('passes elevation as attribute', () => {
    const { container } = render(<Surface elevation="2" />);
    expect(container.querySelector('lt-surface')?.getAttribute('elevation')).toBe('2');
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Surface variant="outlined" />);
    expect(container.querySelector('lt-surface')?.getAttribute('variant')).toBe('outlined');
  });

  it('renders children', () => {
    const { getByText } = render(<Surface>Card content</Surface>);
    expect(getByText('Card content')).toBeTruthy();
  });

  it('forwards ref to lt-surface element', () => {
    const ref = createRef<any>();
    render(<Surface ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-surface');
  });
});
