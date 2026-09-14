import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // Allow all lt-* custom elements in JSX with arbitrary props.
      // Mirrors packages/react/src/globals.d.ts — duplicated here rather than
      // depending on @latty-ds/react (not otherwise a dependency of this
      // package) for one small ambient declaration.
      //
      // `HTMLAttributes` unqualified (not `React.HTMLAttributes`) is
      // deliberate: this package's dependency tree has two physical
      // @types/react copies (its own ^19.0.0 vs 18.3.28 pulled in
      // transitively by @docusaurus/*, confirmed via `pnpm why @types/react
      // -r` — same root cause as the explicit-React-import fix applied
      // across src/components/*). `React.HTMLAttributes` would resolve
      // against the *ambient global* React namespace, which isn't
      // necessarily the same copy this file's own `import 'react'` above
      // resolved to; referencing `HTMLAttributes` bare, from directly
      // inside this `declare module 'react'` block, resolves it against
      // this exact module instance instead.
      [tag: `lt-${string}`]: HTMLAttributes<HTMLElement> & Record<string, unknown>;
    }
  }
}
