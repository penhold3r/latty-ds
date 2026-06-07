import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Alert as AlertEl, LattyIconName } from '@latty-ds/web';

export type AlertProps = HTMLAttributes<AlertEl> & {
  variant?: AlertEl['variant'];
  appearance?: AlertEl['appearance'];
  title?: string;
  icon?: LattyIconName;
  closable?: boolean;
  background?: string;
  uppercase?: boolean;
  onClose?: () => void;
};

export const Alert = forwardRef<AlertEl, AlertProps>(function Alert({ onClose, children, ...props }, forwardedRef) {
  const innerRef = useRef<AlertEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = () => onClose!();
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);

  return (
    <lt-alert ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-alert>
  );
});
Alert.displayName = 'Alert';
