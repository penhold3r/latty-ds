import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Radio as RadioEl } from '@latty-ds/web';

export type RadioProps = Omit<HTMLAttributes<RadioEl>, 'onChange'> & {
  formAssociated?: boolean;
  variant?: RadioEl['variant'];
  size?: RadioEl['size'];
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: RadioEl['labelPosition'];
  name?: string;
  value?: string;
  onChange?: (detail: { value: string; checked: boolean }) => void;
};

export const Radio = forwardRef<RadioEl, RadioProps>(function Radio({ onChange, children, ...props }, forwardedRef) {
  const innerRef = useRef<RadioEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!((ev as CustomEvent).detail);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-radio ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-radio>
  );
});
Radio.displayName = 'Radio';
