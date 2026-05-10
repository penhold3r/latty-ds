import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Nav as NavEl } from '@latty/web';

export type NavProps = {
  orientation?: NavEl['orientation'];
  children?: ReactNode;
};

export const Nav = forwardRef<NavEl, NavProps>(function Nav({ children, ...props }, forwardedRef) {
  const innerRef = useRef<NavEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-nav ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-nav>
  );
});
Nav.displayName = 'Nav';
