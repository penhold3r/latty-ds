import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Link as LinkEl } from '@latty/web';

export type LinkProps = {
  href?: string;
  external?: boolean;
  children?: ReactNode;
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
