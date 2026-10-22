import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes
} from 'react';
import type { Button as ButtonEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<ButtonEl> & AnchorHTMLAttributes<ButtonEl>,
  'onToggle' | 'size' | 'disabled' | 'loading' | 'href' | 'type'
> & {
  variant?: ButtonEl['variant'];
  appearance?: ButtonEl['appearance'];
  bordered?: boolean;
  size?: ButtonEl['size'];
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  toggle?: boolean;
  pressed?: boolean;
  iconStart?: LattyIconName;
  iconEnd?: LattyIconName;
  fullWidth?: boolean;
  uppercase?: boolean;
  href?: string;
  type?: ButtonEl['type'];
  onToggle?: (event: CustomEvent<{ pressed: boolean }>) => void;
};

export const Button = forwardRef<ButtonEl, ButtonProps>(function Button(
  {
    onToggle,
    bordered,
    disabled,
    loading,
    loadingLabel,
    toggle,
    pressed,
    iconStart,
    iconEnd,
    fullWidth,
    uppercase,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<ButtonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onToggle) return;
    const h = (ev: Event) => onToggle!(ev as CustomEvent<{ pressed: boolean }>);
    el.addEventListener('toggle', h);
    return () => el.removeEventListener('toggle', h);
  }, [onToggle]);

  return (
    <lt-button
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      bordered={bordered || undefined}
      disabled={disabled || undefined}
      loading={loading || undefined}
      loading-label={loadingLabel}
      toggle={toggle || undefined}
      pressed={pressed || undefined}
      icon-start={iconStart}
      icon-end={iconEnd}
      full-width={fullWidth || undefined}
      uppercase={uppercase || undefined}
    >
      {children}
    </lt-button>
  );
});
Button.displayName = 'Button';
