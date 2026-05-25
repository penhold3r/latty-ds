// codegen:manual — extended to set icon-start attribute directly (React 18 lowercases camelCase on custom elements)
import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { NavItem as NavItemEl, LattyIconName } from '@latty/web';

export type NavItemProps = HTMLAttributes<NavItemEl> & {
  href?: string;
  label?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  open?: boolean;
  orientation?: NavItemEl['orientation'];
  onNavItemClick?: (event: CustomEvent) => void;
  onNavCollapse?: (event: CustomEvent) => void;
};

export const NavItem = forwardRef<NavItemEl, NavItemProps>(function NavItem(
  { onNavItemClick, onNavCollapse, iconStart, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<NavItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onNavItemClick) return;
    const h = (ev: Event) => onNavItemClick!(ev as CustomEvent);
    el.addEventListener('nav-item-click', h);
    return () => el.removeEventListener('nav-item-click', h);
  }, [onNavItemClick]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onNavCollapse) return;
    const h = (ev: Event) => onNavCollapse!(ev as CustomEvent);
    el.addEventListener('nav-collapse', h);
    return () => el.removeEventListener('nav-collapse', h);
  }, [onNavCollapse]);
  // React 18 lowercases camelCase props on custom elements — set as attribute directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (iconStart) el.setAttribute('icon-start', iconStart);
    else el.removeAttribute('icon-start');
  }, [iconStart]);

  return (
    <lt-nav-item ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-nav-item>
  );
});
NavItem.displayName = 'NavItem';
