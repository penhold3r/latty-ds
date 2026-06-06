import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Link as LinkEl } from '@latty-ds/web';

export type LinkProps = HTMLAttributes<LinkEl> & {
  href?: string;
  external?: boolean;
};

export const Link = forwardRef<LinkEl, LinkProps>(function Link({ children, ...props }, forwardedRef) {
  const innerRef = useRef<LinkEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-link ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-link>
  );
});
Link.displayName = 'Link';
