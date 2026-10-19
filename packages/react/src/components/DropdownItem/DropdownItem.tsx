import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { DropdownItem as DropdownItemEl } from '@latty-ds/web';

export type DropdownItemProps = Omit<HTMLAttributes<DropdownItemEl>, 'onSelect'> & {
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
      {...(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      selected={selected || undefined}
    >
      {children}
    </lt-dropdown-item>
  );
});
DropdownItem.displayName = 'DropdownItem';
