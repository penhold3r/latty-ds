import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Alert as AlertEl } from '@latty/web';

export type AlertProps = {
  variant?: AlertEl['variant'];
  appearance?: AlertEl['appearance'];
  title?: string;
  withIcon?: boolean;
  closable?: boolean;
  onLtClose?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Alert = forwardRef<AlertEl, AlertProps>(
  function Alert({ onLtClose, children, ...props }, forwardedRef) {
    const innerRef = useRef<AlertEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtClose) return;
      const h = (ev: Event) => onLtClose!(ev as CustomEvent);
      el.addEventListener('lt-close', h);
      return () => el.removeEventListener('lt-close', h);
    }, [onLtClose]);

    return (
      <lt-alert ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-alert>
    );
  }
);
Alert.displayName = 'Alert';
