import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { RadioGroup as RadioGroupEl } from '@latty/web';

export type RadioGroupProps = {
  label?: string;
  name?: string;
  value?: string;
  orientation?: RadioGroupEl['orientation'];
  helperText?: string;
  error?: boolean;
  required?: boolean;
  radios?: RadioGroupEl['radios'];
  handleRadioChange?: string;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const RadioGroup = forwardRef<RadioGroupEl, RadioGroupProps>(
  function RadioGroup({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<RadioGroupEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-radio-group ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-radio-group>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';
