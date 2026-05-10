import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders lt-progress', () => {
    const { container } = render(<Progress />);
    expect(container.querySelector('lt-progress')).toBeTruthy();
  });

  it('passes value as attribute', () => {
    const { container } = render(<Progress value={75} />);
    expect(container.querySelector('lt-progress')?.getAttribute('value')).toBe('75');
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Progress variant="success" />);
    expect(container.querySelector('lt-progress')?.getAttribute('variant')).toBe('success');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Progress size="lg" />);
    expect(container.querySelector('lt-progress')?.getAttribute('size')).toBe('lg');
  });

  it('passes indeterminate as attribute', () => {
    const { container } = render(<Progress indeterminate />);
    expect(container.querySelector('lt-progress')).toHaveAttribute('indeterminate');
  });

  it('forwards ref to lt-progress element', () => {
    const ref = createRef<any>();
    render(<Progress ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-progress');
  });
});
