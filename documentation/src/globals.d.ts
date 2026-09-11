import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // Allow all lt-* custom elements in JSX with arbitrary props.
      // Mirrors packages/react/src/globals.d.ts — duplicated here rather than
      // depending on @latty-ds/react (not otherwise a dependency of this
      // package) for one small ambient declaration.
      [tag: `lt-${string}`]: React.HTMLAttributes<HTMLElement> & Record<string, unknown>;
    }
  }
}
