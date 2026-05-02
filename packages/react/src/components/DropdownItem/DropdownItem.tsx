import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { DropdownItem as DropdownItemEl } from '@latty/web';

export type DropdownItemProps = {
  disabled?: boolean;
  selected?: boolean;
  href?: string;
  onLtSelect?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const DropdownItem = forwardRef<DropdownItemEl, DropdownItemProps>(
  function DropdownItem({ onLtSelect, children, ...props }, forwardedRef) {
    const innerRef = useRef<DropdownItemEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtSelect) return;
      const h = (ev: Event) => onLtSelect!(ev as CustomEvent);
      el.addEventListener('lt-select', h);
      return () => el.removeEventListener('lt-select', h);
    }, [onLtSelect]);

    return (
      <lt-dropdown-item ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-dropdown-item>
    );
  }
);
DropdownItem.displayName = 'DropdownItem';
