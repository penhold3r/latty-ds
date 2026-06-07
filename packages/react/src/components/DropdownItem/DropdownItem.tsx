import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { DropdownItem as DropdownItemEl } from '@latty-ds/web';

export type DropdownItemProps = HTMLAttributes<DropdownItemEl> & {
  disabled?: boolean;
  selected?: boolean;
  href?: string;
  onSelect?: () => void;
};

export const DropdownItem = forwardRef<DropdownItemEl, DropdownItemProps>(function DropdownItem(
  { onSelect, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DropdownItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onSelect) return;
    const h = () => onSelect!();
    el.addEventListener('select', h);
    return () => el.removeEventListener('select', h);
  }, [onSelect]);

  return (
    <lt-dropdown-item ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-dropdown-item>
  );
});
DropdownItem.displayName = 'DropdownItem';
