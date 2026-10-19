import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Textfield as TextfieldEl, LattyIconName } from '@latty-ds/web';

export type TextfieldProps = Omit<HTMLAttributes<TextfieldEl>, 'onInput' | 'onChange'> & {
  formAssociated?: boolean;
  variant?: TextfieldEl['variant'];
  size?: TextfieldEl['size'];
  type?: TextfieldEl['type'];
  value?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  helperText?: TextfieldEl['helperText'];
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  iconStart?: LattyIconName;
  rows?: number;
  autosize?: boolean;
  min?: TextfieldEl['min'];
  max?: TextfieldEl['max'];
  uppercase?: boolean;
  clearable?: boolean;
  counter?: boolean;
  autocomplete?: string;
  inputMode?: TextfieldEl['inputMode'];
  pattern?: string;
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
    formAssociated,
    disabled,
    required,
    readonly,
    autofocus,
    iconStart,
    autosize,
    uppercase,
    clearable,
    counter,
    inputMode,
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
      {...(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      readonly={readonly || undefined}
      autofocus={autofocus || undefined}
      icon-start={iconStart}
      autosize={autosize || undefined}
      uppercase={uppercase || undefined}
      clearable={clearable || undefined}
      counter={counter || undefined}
      input-mode={inputMode}
    >
      {children}
    </lt-textfield>
  );
});
Textfield.displayName = 'Textfield';
