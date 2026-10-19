import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Snackbar as SnackbarEl, LattyIconName } from '@latty-ds/web';

export type SnackbarProps = HTMLAttributes<SnackbarEl> & {
  variant?: SnackbarEl['variant'];
  duration?: number;
  open?: boolean;
  closable?: boolean;
  actionLabel?: string;
  icon?: LattyIconName;
  elevation?: SnackbarEl['elevation'];
  appearance?: SnackbarEl['appearance'];
  labels?: SnackbarEl['labels'];
  managed?: boolean;
  onShow?: (event: CustomEvent) => void;
  onHide?: (event: CustomEvent) => void;
  onAction?: (event: CustomEvent) => void;
};

export const Snackbar = forwardRef<SnackbarEl, SnackbarProps>(function Snackbar(
  { onShow, onHide, onAction, labels, open, closable, actionLabel, managed, children, ...props },
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
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-snackbar
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      open={open || undefined}
      closable={closable || undefined}
      action-label={actionLabel}
      managed={managed || undefined}
    >
      {children}
    </lt-snackbar>
  );
});
Snackbar.displayName = 'Snackbar';
