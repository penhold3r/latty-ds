import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes
} from 'react';
import type { DropdownItem as DropdownItemEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type DropdownItemProps = Omit<
  ButtonHTMLAttributes<DropdownItemEl> & AnchorHTMLAttributes<DropdownItemEl>,
  'onSelect' | 'disabled' | 'selected' | 'href'
> & {
  disabled?: boolean;
  selected?: boolean;
  href?: string;
  onSelect?: (event: CustomEvent) => void;
};

export const DropdownItem = forwardRef<DropdownItemEl, DropdownItemProps>(function DropdownItem(
  { onSelect, disabled, selected, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DropdownItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onSelect) return;
    const h = (ev: Event) => onSelect!(ev as CustomEvent);
    el.addEventListener('select', h);
    return () => el.removeEventListener('select', h);
  }, [onSelect]);

  return (
    <lt-dropdown-item
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      selected={selected || undefined}
    >
      {children}
    </lt-dropdown-item>
  );
});
DropdownItem.displayName = 'DropdownItem';
