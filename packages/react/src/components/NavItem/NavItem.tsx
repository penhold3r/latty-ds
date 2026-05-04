import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { NavItem as NavItemEl } from '@latty/web';

export type NavItemProps = {
  href?: string;
  label?: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  open?: boolean;
  children?: ReactNode;
  onLtNavItemClick?: (e: CustomEvent<{ href: string; label: string }>) => void;
  onLtNavCollapse?: (e: CustomEvent<{ open: boolean }>) => void;
};

export const NavItem = forwardRef<NavItemEl, NavItemProps>(function NavItem(
  { children, onLtNavItemClick, onLtNavCollapse, ...props },
  forwardedRef
) {
  const innerRef = useRef<NavItemEl>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtNavItemClick) return;
    const h = (ev: Event) => onLtNavItemClick(ev as CustomEvent<{ href: string; label: string }>);
    el.addEventListener('lt-nav-item-click', h);
    return () => el.removeEventListener('lt-nav-item-click', h);
  }, [onLtNavItemClick]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtNavCollapse) return;
    const h = (ev: Event) => onLtNavCollapse(ev as CustomEvent<{ open: boolean }>);
    el.addEventListener('lt-nav-collapse', h);
    return () => el.removeEventListener('lt-nav-collapse', h);
  }, [onLtNavCollapse]);

  return (
    <lt-nav-item ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-nav-item>
  );
});
NavItem.displayName = 'NavItem';
