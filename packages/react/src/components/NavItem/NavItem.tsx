import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { NavItem as NavItemEl, LattyIconName } from '@latty/web';

export type NavItemProps = {
  href?: string;
  label?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  open?: boolean;
  orientation?: NavItemEl['orientation'];
  onLtNavItemClick?: (event: CustomEvent) => void;
  onLtNavCollapse?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const NavItem = forwardRef<NavItemEl, NavItemProps>(function NavItem(
  { onLtNavItemClick, onLtNavCollapse, iconStart, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<NavItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtNavItemClick) return;
    const h = (ev: Event) => onLtNavItemClick!(ev as CustomEvent);
    el.addEventListener('lt-nav-item-click', h);
    return () => el.removeEventListener('lt-nav-item-click', h);
  }, [onLtNavItemClick]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtNavCollapse) return;
    const h = (ev: Event) => onLtNavCollapse!(ev as CustomEvent);
    el.addEventListener('lt-nav-collapse', h);
    return () => el.removeEventListener('lt-nav-collapse', h);
  }, [onLtNavCollapse]);

  return (
    <lt-nav-item ref={innerRef} icon-start={iconStart} {...(props as Record<string, unknown>)}>
      {children}
    </lt-nav-item>
  );
});
NavItem.displayName = 'NavItem';
