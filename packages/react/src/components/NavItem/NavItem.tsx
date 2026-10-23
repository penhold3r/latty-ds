// codegen:manual — extended to set icon-start attribute directly (React 18 lowercases camelCase on custom elements)
import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes
} from 'react';
import type { NavItem as NavItemEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type NavItemProps = Omit<
  ButtonHTMLAttributes<NavItemEl> & AnchorHTMLAttributes<NavItemEl>,
  'onToggle' | 'href' | 'label' | 'disabled' | 'open'
> & {
  href?: string;
  label?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  open?: boolean;
  orientation?: NavItemEl['orientation'];
  onToggle?: (event: CustomEvent<{ open: boolean }>) => void;
};

export const NavItem = forwardRef<NavItemEl, NavItemProps>(function NavItem(
  { onToggle, iconStart, active, disabled, open, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<NavItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onToggle) return;
    const h = (ev: Event) => onToggle!(ev as CustomEvent<{ open: boolean }>);
    el.addEventListener('toggle', h);
    return () => el.removeEventListener('toggle', h);
  }, [onToggle]);
  // React 18 lowercases camelCase props on custom elements — set as attribute directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (iconStart) el.setAttribute('icon-start', iconStart);
    else el.removeAttribute('icon-start');
  }, [iconStart]);

  return (
    <lt-nav-item
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      icon-start={iconStart}
      active={active || undefined}
      disabled={disabled || undefined}
      open={open || undefined}
    >
      {children}
    </lt-nav-item>
  );
});
NavItem.displayName = 'NavItem';
