import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Slider as SliderEl } from '@latty/web';

export type SliderProps = {
  size?: SliderEl['size'];
  disabled?: boolean;
  showTooltip?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  label?: string;
  name?: string;
  onLtInput?: (event: CustomEvent) => void;
  onLtChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Slider = forwardRef<SliderEl, SliderProps>(
  function Slider({ onLtInput, onLtChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<SliderEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtInput) return;
      const h = (ev: Event) => onLtInput!(ev as CustomEvent);
      el.addEventListener('lt-input', h);
      return () => el.removeEventListener('lt-input', h);
    }, [onLtInput]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtChange) return;
      const h = (ev: Event) => onLtChange!(ev as CustomEvent);
      el.addEventListener('lt-change', h);
      return () => el.removeEventListener('lt-change', h);
    }, [onLtChange]);

    return (
      <lt-slider ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-slider>
    );
  }
);
Slider.displayName = 'Slider';
