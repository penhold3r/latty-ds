import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders lt-icon', () => {
    const { container } = render(<Icon name="home" />);
    expect(container.querySelector('lt-icon')).toBeTruthy();
  });

  it('passes name as attribute', () => {
    const { container } = render(<Icon name="settings" />);
    expect(container.querySelector('lt-icon')?.getAttribute('name')).toBe('settings');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Icon name="home" size="lg" />);
    expect(container.querySelector('lt-icon')?.getAttribute('size')).toBe('lg');
  });

  it('forwards ref to lt-icon element', () => {
    const ref = createRef<any>();
    render(<Icon name="home" ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-icon');
  });
});
