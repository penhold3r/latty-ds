import { useRef, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import type { Slider as SliderEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type SliderProps = Omit<
  InputHTMLAttributes<SliderEl>,
  'onInput' | 'onChange' | 'size' | 'disabled' | 'min' | 'max' | 'step' | 'value' | 'label'
> & {
  size?: SliderEl['size'];
  disabled?: boolean;
  tooltip?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  label?: string;
  onInput?: (event: CustomEvent<{ value: number }>) => void;
  onChange?: (event: CustomEvent<{ value: number }>) => void;
};

export const Slider = forwardRef<SliderEl, SliderProps>(function Slider(
  { onInput, onChange, disabled, tooltip, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SliderEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onInput) return;
    const h = (ev: Event) => onInput!(ev as CustomEvent<{ value: number }>);
    el.addEventListener('input', h);
    return () => el.removeEventListener('input', h);
  }, [onInput]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: number }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-slider
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      tooltip={tooltip || undefined}
    >
      {children}
    </lt-slider>
  );
});
Slider.displayName = 'Slider';
