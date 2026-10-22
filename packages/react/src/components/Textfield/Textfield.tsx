import {
  useRef,
  useLayoutEffect,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react';
import type { Textfield as TextfieldEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TextfieldProps = Omit<
  InputHTMLAttributes<TextfieldEl> & TextareaHTMLAttributes<TextfieldEl>,
  'onInput' | 'onChange' | 'size' | 'type' | 'value' | 'label' | 'disabled' | 'required' | 'rows' | 'prefix'
> & {
  variant?: TextfieldEl['variant'];
  size?: TextfieldEl['size'];
  type?: TextfieldEl['type'];
  value?: string;
  label?: string;
  helperText?: TextfieldEl['helperText'];
  disabled?: boolean;
  required?: boolean;
  iconStart?: LattyIconName;
  rows?: number;
  autosize?: boolean;
  uppercase?: boolean;
  clearable?: boolean;
  counter?: boolean;
  prefix?: string;
  suffix?: string;
  labels?: TextfieldEl['labels'];
  onInput?: (event: CustomEvent<{ value: string }>) => void;
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const Textfield = forwardRef<TextfieldEl, TextfieldProps>(function Textfield(
  {
    onInput,
    onChange,
    helperText,
    labels,
    disabled,
    required,
    iconStart,
    autosize,
    uppercase,
    clearable,
    counter,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<TextfieldEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onInput) return;
    const h = (ev: Event) => onInput!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('input', h);
    return () => el.removeEventListener('input', h);
  }, [onInput]);
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
    if (labels !== undefined) el.labels = labels;
  }, [helperText, labels]);

  return (
    <lt-textfield
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      required={required || undefined}
      icon-start={iconStart}
      autosize={autosize || undefined}
      uppercase={uppercase || undefined}
      clearable={clearable || undefined}
      counter={counter || undefined}
    >
      {children}
    </lt-textfield>
  );
});
Textfield.displayName = 'Textfield';
