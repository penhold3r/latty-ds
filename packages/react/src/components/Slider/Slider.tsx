import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Slider as SliderEl } from '@latty-ds/web';

export type SliderProps = Omit<HTMLAttributes<SliderEl>, 'onInput' | 'onChange'> & {
  formAssociated?: boolean;
  size?: SliderEl['size'];
  disabled?: boolean;
  tooltip?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  label?: string;
  name?: string;
  onInput?: (detail: { value: number }) => void;
  onChange?: (detail: { value: number }) => void;
};

export const Slider = forwardRef<SliderEl, SliderProps>(function Slider(
  { onInput, onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SliderEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onInput) return;
    const h = (ev: Event) => onInput!((ev as CustomEvent).detail);
    el.addEventListener('input', h);
    return () => el.removeEventListener('input', h);
  }, [onInput]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!((ev as CustomEvent).detail);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-slider ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-slider>
  );
});
Slider.displayName = 'Slider';
