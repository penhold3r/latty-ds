import { render } from '@testing-library/react';
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

  it('calls onTabClick when tab-click event fires', () => {
    const onTabClick = vi.fn();
    const { container } = render(<Tab onTabClick={onTabClick} />);
    container.querySelector('lt-tab')!.dispatchEvent(new CustomEvent('tab-click'));
    expect(onTabClick).toHaveBeenCalledOnce();
  });

  it('removes tab-click listener on unmount', () => {
    const onTabClick = vi.fn();
    const { container, unmount } = render(<Tab onTabClick={onTabClick} />);
    const el = container.querySelector('lt-tab')!;
    unmount();
    el.dispatchEvent(new CustomEvent('tab-click'));
    expect(onTabClick).not.toHaveBeenCalled();
  });
});
