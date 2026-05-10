import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Image } from './Image';

describe('Image', () => {
  it('renders lt-image', () => {
    const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
    expect(container.querySelector('lt-image')).toBeTruthy();
  });

  it('passes src as attribute', () => {
    const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
    expect(container.querySelector('lt-image')?.getAttribute('src')).toBe('/photo.jpg');
  });

  it('passes alt as attribute', () => {
    const { container } = render(<Image src="/photo.jpg" alt="A cat" />);
    expect(container.querySelector('lt-image')?.getAttribute('alt')).toBe('A cat');
  });

  it('passes rounded as attribute', () => {
    const { container } = render(<Image src="/photo.jpg" alt="" rounded="full" />);
    expect(container.querySelector('lt-image')?.getAttribute('rounded')).toBe('full');
  });

  it('passes responsive as attribute', () => {
    const { container } = render(<Image src="/photo.jpg" alt="" responsive />);
    expect(container.querySelector('lt-image')).toHaveAttribute('responsive');
  });

  it('forwards ref to lt-image element', () => {
    const ref = createRef<any>();
    render(<Image src="/photo.jpg" alt="" ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-image');
  });
});
