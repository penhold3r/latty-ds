import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Alert as AlertEl, LattyIconName } from '@latty-ds/web';

export type AlertProps = HTMLAttributes<AlertEl> & {
  variant?: AlertEl['variant'];
  appearance?: AlertEl['appearance'];
  heading?: string;
  title?: string;
  icon?: LattyIconName;
  closable?: boolean;
  open?: boolean;
  background?: string;
  uppercase?: boolean;
  labels?: AlertEl['labels'];
  onClose?: (event: CustomEvent) => void;
};

export const Alert = forwardRef<AlertEl, AlertProps>(function Alert(
  { onClose, labels, closable, open, uppercase, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<AlertEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = (ev: Event) => onClose!(ev as CustomEvent);
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-alert
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      closable={closable || undefined}
      open={open || undefined}
      uppercase={uppercase || undefined}
    >
      {children}
    </lt-alert>
  );
});
Alert.displayName = 'Alert';
