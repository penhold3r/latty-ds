import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Datepicker as DatepickerEl } from '@latty-ds/web';

export type DatepickerProps = Omit<HTMLAttributes<DatepickerEl>, 'onChange' | 'onInput'> & {
  formAssociated?: boolean;
  type?: DatepickerEl['type'];
  value?: string;
  min?: string;
  max?: string;
  label?: string;
  helperText?: string;
  variant?: DatepickerEl['variant'];
  size?: DatepickerEl['size'];
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  name?: string;
  onChange?: (detail: { value: string }) => void;
  onInput?: (detail: { value: string }) => void;
};

export const Datepicker = forwardRef<DatepickerEl, DatepickerProps>(function Datepicker(
  { onChange, onInput, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DatepickerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!((ev as CustomEvent).detail);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onInput) return;
    const h = (ev: Event) => onInput!((ev as CustomEvent).detail);
    el.addEventListener('input', h);
    return () => el.removeEventListener('input', h);
  }, [onInput]);

  return (
    <lt-datepicker ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-datepicker>
  );
});
Datepicker.displayName = 'Datepicker';
