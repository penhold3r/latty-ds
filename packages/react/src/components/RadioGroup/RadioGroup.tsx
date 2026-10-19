import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { RadioGroup as RadioGroupEl } from '@latty-ds/web';

export type RadioGroupProps = Omit<HTMLAttributes<RadioGroupEl>, 'onChange'> & {
  label?: string;
  name?: string;
  value?: string;
  orientation?: RadioGroupEl['orientation'];
  helperText?: string;
  error?: boolean;
  required?: boolean;
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const RadioGroup = forwardRef<RadioGroupEl, RadioGroupProps>(function RadioGroup(
  { onChange, helperText, error, required, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<RadioGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (helperText !== undefined) el.helperText = helperText;
  }, [helperText]);

  return (
    <lt-radio-group
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      error={error || undefined}
      required={required || undefined}
    >
      {children}
    </lt-radio-group>
  );
});
RadioGroup.displayName = 'RadioGroup';
