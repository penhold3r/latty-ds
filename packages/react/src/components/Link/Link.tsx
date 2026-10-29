import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type AnchorHTMLAttributes } from 'react';
import type { Link as LinkEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type LinkProps = Omit<AnchorHTMLAttributes<LinkEl>, 'href'> & {
  href?: string;
  external?: boolean;
  underline?: LinkEl['underline'];
  labels?: LinkEl['labels'];
};

export const Link = forwardRef<LinkEl, LinkProps>(function Link(
  { labels, external, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<LinkEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-link
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      external={external || undefined}
    >
      {children}
    </lt-link>
  );
});
Link.displayName = 'Link';
