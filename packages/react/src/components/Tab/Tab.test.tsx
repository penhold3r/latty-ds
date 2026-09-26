import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { Tab } from './Tab';

describe('Tab', () => {
  it('renders lt-tab', () => {
    const { container } = render(<Tab />);
    expect(container.querySelector('lt-tab')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Tab label="Overview" />);
    expect(container.querySelector('lt-tab')?.getAttribute('label')).toBe('Overview');
  });

  it('passes value as attribute', () => {
    const { container } = render(<Tab value="overview" />);
    expect(container.querySelector('lt-tab')?.getAttribute('value')).toBe('overview');
  });

  it('passes active as attribute', () => {
    const { container } = render(<Tab active />);
    expect(container.querySelector('lt-tab')).toHaveAttribute('active');
  });

  it('forwards ref to lt-tab element', () => {
    const ref = createRef<any>();
    render(<Tab ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-tab');
  });

  it('lets React onClick handle the native click (a tab has no custom event)', () => {
    const onClick = vi.fn();
    const { container } = render(<Tab onClick={onClick} />);
    fireEvent.click(container.querySelector('lt-tab')!);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
