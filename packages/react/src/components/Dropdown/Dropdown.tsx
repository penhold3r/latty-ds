import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Dropdown as DropdownEl } from '@latty/web';

export type DropdownProps = {
  open?: boolean;
  placement?: DropdownEl['placement'];
  onLtOpen?: (event: CustomEvent) => void;
  onLtClose?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Dropdown = forwardRef<DropdownEl, DropdownProps>(
  function Dropdown({ onLtOpen, onLtClose, children, ...props }, forwardedRef) {
    const innerRef = useRef<DropdownEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtOpen) return;
      const h = (ev: Event) => onLtOpen!(ev as CustomEvent);
      el.addEventListener('lt-open', h);
      return () => el.removeEventListener('lt-open', h);
    }, [onLtOpen]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtClose) return;
      const h = (ev: Event) => onLtClose!(ev as CustomEvent);
      el.addEventListener('lt-close', h);
      return () => el.removeEventListener('lt-close', h);
    }, [onLtClose]);

    return (
      <lt-dropdown ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-dropdown>
    );
  }
);
Dropdown.displayName = 'Dropdown';
