import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders lt-avatar', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('lt-avatar')).toBeTruthy();
  });

  it('passes src as attribute', () => {
    const { container } = render(<Avatar src="photo.jpg" />);
    expect(container.querySelector('lt-avatar')?.getAttribute('src')).toBe('photo.jpg');
  });

  it('passes name as attribute', () => {
    const { container } = render(<Avatar name="Jane Doe" />);
    expect(container.querySelector('lt-avatar')?.getAttribute('name')).toBe('Jane Doe');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Avatar size="lg" />);
    expect(container.querySelector('lt-avatar')?.getAttribute('size')).toBe('lg');
  });

  it('forwards ref to lt-avatar element', () => {
    const ref = createRef<any>();
    render(<Avatar ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-avatar');
  });
});
