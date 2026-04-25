import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Snackbar as SnackbarEl } from '@latty/web';

export type SnackbarProps = {
  variant?: SnackbarEl['variant'];
  duration?: number;
  open?: boolean;
  closable?: boolean;
  actionLabel?: string;
  withIcon?: boolean;
  onLtShow?: (event: CustomEvent) => void;
  onLtHide?: (event: CustomEvent) => void;
  onLtAction?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Snackbar = forwardRef<SnackbarEl, SnackbarProps>(
  function Snackbar({ onLtShow, onLtHide, onLtAction, children, ...props }, forwardedRef) {
    const innerRef = useRef<SnackbarEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtShow) return;
      const h = (ev: Event) => onLtShow!(ev as CustomEvent);
      el.addEventListener('lt-show', h);
      return () => el.removeEventListener('lt-show', h);
    }, [onLtShow]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtHide) return;
      const h = (ev: Event) => onLtHide!(ev as CustomEvent);
      el.addEventListener('lt-hide', h);
      return () => el.removeEventListener('lt-hide', h);
    }, [onLtHide]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtAction) return;
      const h = (ev: Event) => onLtAction!(ev as CustomEvent);
      el.addEventListener('lt-action', h);
      return () => el.removeEventListener('lt-action', h);
    }, [onLtAction]);

    return (
      <lt-snackbar ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-snackbar>
    );
  }
);
Snackbar.displayName = 'Snackbar';
