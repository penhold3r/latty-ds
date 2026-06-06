import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Nav as NavEl } from '@latty-ds/web';

export type NavProps = HTMLAttributes<NavEl> & {
  label?: string;
  orientation?: NavEl['orientation'];
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
