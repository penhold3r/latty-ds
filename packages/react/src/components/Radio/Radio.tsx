import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import type { Radio as RadioEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type RadioProps = Omit<
  InputHTMLAttributes<RadioEl>,
  'onChange' | 'size' | 'checked' | 'disabled' | 'required' | 'label' | 'name' | 'value'
> & {
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
  helperText?: string;
  tabbable?: boolean;
  labels?: RadioEl['labels'];
  onChange?: (event: CustomEvent<{ value: string; checked: boolean }>) => void;
};

export const Radio = forwardRef<RadioEl, RadioProps>(function Radio(
  {
    onChange,
    helperText,
    labels,
    formAssociated,
    checked,
    disabled,
    required,
    labelPosition,
    tabbable,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<RadioEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string; checked: boolean }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (helperText !== undefined) el.helperText = helperText;
    if (labels !== undefined) el.labels = labels;
  }, [helperText, labels]);

  return (
    <lt-radio
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      checked={checked || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      label-position={labelPosition}
      tabbable={tabbable || undefined}
    >
      {children}
    </lt-radio>
  );
});
Radio.displayName = 'Radio';
