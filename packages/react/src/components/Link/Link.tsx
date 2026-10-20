import { useRef, useImperativeHandle, forwardRef, type AnchorHTMLAttributes } from 'react';
import type { Link as LinkEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type LinkProps = Omit<AnchorHTMLAttributes<LinkEl>, 'href'> & {
  href?: string;
  external?: boolean;
  underline?: LinkEl['underline'];
};

export const Link = forwardRef<LinkEl, LinkProps>(function Link({ external, children, ...props }, forwardedRef) {
  const innerRef = useRef<LinkEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

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
