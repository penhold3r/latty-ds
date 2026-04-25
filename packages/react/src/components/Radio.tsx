import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Radio as RadioEl } from '@latty/web';

export type RadioProps = {
  variant?: RadioEl['variant'];
  size?: RadioEl['size'];
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: RadioEl['labelPosition'];
  name?: string;
  value?: string;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Radio = forwardRef<RadioEl, RadioProps>(
  function Radio({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<RadioEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-radio ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-radio>
    );
  }
);
Radio.displayName = 'Radio';
