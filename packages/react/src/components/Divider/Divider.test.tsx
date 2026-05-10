import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders lt-divider', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('lt-divider')).toBeTruthy();
  });

  it('passes orientation as attribute', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.querySelector('lt-divider')?.getAttribute('orientation')).toBe('vertical');
  });

  it.each(['solid', 'dashed', 'dotted'] as const)('passes appearance="%s" as attribute', (appearance) => {
    const { container } = render(<Divider appearance={appearance} />);
    expect(container.querySelector('lt-divider')?.getAttribute('appearance')).toBe(appearance);
  });

  it('passes label as attribute', () => {
    const { container } = render(<Divider label="Section" />);
    expect(container.querySelector('lt-divider')?.getAttribute('label')).toBe('Section');
  });

  it('forwards ref to lt-divider element', () => {
    const ref = createRef<any>();
    render(<Divider ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-divider');
  });
});
