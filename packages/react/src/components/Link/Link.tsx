import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Link as LinkEl } from '@latty-ds/web';

export type LinkProps = HTMLAttributes<LinkEl> & {
  href?: string;
  external?: boolean;
  target?: LinkEl['target'];
  rel?: LinkEl['rel'];
  download?: LinkEl['download'];
  underline?: LinkEl['underline'];
};

export const Link = forwardRef<LinkEl, LinkProps>(function Link(
  { target, rel, download, external, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<LinkEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (target !== undefined) el.target = target;
    if (rel !== undefined) el.rel = rel;
    if (download !== undefined) el.download = download;
  }, [target, rel, download]);

  return (
    <lt-link
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      external={external || undefined}
    >
      {children}
    </lt-link>
  );
});
Link.displayName = 'Link';
