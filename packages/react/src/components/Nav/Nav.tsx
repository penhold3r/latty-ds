import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Nav as NavEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type NavProps = Omit<HTMLAttributes<NavEl>, 'label'> & {
  label?: string;
  orientation?: NavEl['orientation'];
};

export const Nav = forwardRef<NavEl, NavProps>(function Nav({ children, ...props }, forwardedRef) {
  const innerRef = useRef<NavEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-nav ref={innerRef} suppressHydrationWarning {...normalizeNativeProps(props as Record<string, unknown>)}>
      {children}
    </lt-nav>
  );
});
Nav.displayName = 'Nav';
