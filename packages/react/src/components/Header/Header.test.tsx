import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Header } from './Header';

describe('Header', () => {
  it('renders lt-header', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('lt-header')).toBeTruthy();
  });

  it('passes background as attribute', () => {
    const { container } = render(<Header background="primary" />);
    expect(container.querySelector('lt-header')?.getAttribute('background')).toBe('primary');
  });

  it('renders before slot content', () => {
    const { getByText } = render(<Header before={<button>Menu</button>} />);
    expect(getByText('Menu')).toBeTruthy();
  });

  it('renders logo slot content', () => {
    const { getByText } = render(<Header logo={<span>Acme</span>} />);
    expect(getByText('Acme')).toBeTruthy();
  });

  it('renders after slot content', () => {
    const { getByText } = render(<Header after={<button>Avatar</button>} />);
    expect(getByText('Avatar')).toBeTruthy();
  });

  it('renders children in content slot', () => {
    const { getByText } = render(<Header>Nav links</Header>);
    expect(getByText('Nav links')).toBeTruthy();
  });

  it('forwards ref to lt-header element', () => {
    const ref = createRef<any>();
    render(<Header ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-header');
  });
});
