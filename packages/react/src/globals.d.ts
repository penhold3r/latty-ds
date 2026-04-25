import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // Allow all lt-* custom elements in JSX with arbitrary props
      [tag: `lt-${string}`]: React.HTMLAttributes<HTMLElement> & Record<string, unknown>;
    }
  }
}
