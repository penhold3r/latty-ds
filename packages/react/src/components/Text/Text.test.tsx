import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Text } from './Text';

describe('Text', () => {
  it('renders lt-text', () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector('lt-text')).toBeTruthy();
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Text variant="h1">Heading</Text>);
    expect(container.querySelector('lt-text')?.getAttribute('variant')).toBe('h1');
  });

  it('passes as as attribute', () => {
    const { container } = render(<Text as="p">Paragraph</Text>);
    expect(container.querySelector('lt-text')?.getAttribute('as')).toBe('p');
  });

  it('renders children', () => {
    const { getByText } = render(<Text>Body copy</Text>);
    expect(getByText('Body copy')).toBeTruthy();
  });

  it('forwards ref to lt-text element', () => {
    const ref = createRef<any>();
    render(<Text ref={ref}>Hello</Text>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-text');
  });
});
