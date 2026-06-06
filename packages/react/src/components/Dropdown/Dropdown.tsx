import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Dropdown as DropdownEl } from '@latty-ds/web';

export type DropdownProps = HTMLAttributes<DropdownEl> & {
  open?: boolean;
  placement?: DropdownEl['placement'];
  onOpen?: (event: CustomEvent) => void;
  onClose?: (event: CustomEvent) => void;
};

export const Dropdown = forwardRef<DropdownEl, DropdownProps>(function Dropdown(
  { onOpen, onClose, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DropdownEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onOpen) return;
    const h = (ev: Event) => onOpen!(ev as CustomEvent);
    el.addEventListener('open', h);
    return () => el.removeEventListener('open', h);
  }, [onOpen]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = (ev: Event) => onClose!(ev as CustomEvent);
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);

  return (
    <lt-dropdown ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-dropdown>
  );
});
Dropdown.displayName = 'Dropdown';
