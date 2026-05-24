import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Datepicker as DatepickerEl } from '@latty/web';

export type DatepickerProps = HTMLAttributes<DatepickerEl> & {
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
  onLtChange?: (event: CustomEvent) => void;
  onLtInput?: (event: CustomEvent) => void;
};

export const Datepicker = forwardRef<DatepickerEl, DatepickerProps>(function Datepicker(
  { onLtChange, onLtInput, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DatepickerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtChange) return;
    const h = (ev: Event) => onLtChange!(ev as CustomEvent);
    el.addEventListener('lt-change', h);
    return () => el.removeEventListener('lt-change', h);
  }, [onLtChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtInput) return;
    const h = (ev: Event) => onLtInput!(ev as CustomEvent);
    el.addEventListener('lt-input', h);
    return () => el.removeEventListener('lt-input', h);
  }, [onLtInput]);

  return (
    <lt-datepicker ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-datepicker>
  );
});
Datepicker.displayName = 'Datepicker';
