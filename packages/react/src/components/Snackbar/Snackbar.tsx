import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Snackbar as SnackbarEl, LattyIconName } from '@latty-ds/web';

export type SnackbarProps = HTMLAttributes<SnackbarEl> & {
  variant?: SnackbarEl['variant'];
  duration?: number;
  open?: boolean;
  closable?: boolean;
  actionLabel?: string;
  icon?: LattyIconName;
  onShow?: (event: CustomEvent) => void;
  onHide?: (event: CustomEvent) => void;
  onAction?: (event: CustomEvent) => void;
};

export const Snackbar = forwardRef<SnackbarEl, SnackbarProps>(function Snackbar(
  { onShow, onHide, onAction, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SnackbarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onShow) return;
    const h = (ev: Event) => onShow!(ev as CustomEvent);
    el.addEventListener('show', h);
    return () => el.removeEventListener('show', h);
  }, [onShow]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onHide) return;
    const h = (ev: Event) => onHide!(ev as CustomEvent);
    el.addEventListener('hide', h);
    return () => el.removeEventListener('hide', h);
  }, [onHide]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onAction) return;
    const h = (ev: Event) => onAction!(ev as CustomEvent);
    el.addEventListener('action', h);
    return () => el.removeEventListener('action', h);
  }, [onAction]);

  return (
    <lt-snackbar ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-snackbar>
  );
});
Snackbar.displayName = 'Snackbar';
