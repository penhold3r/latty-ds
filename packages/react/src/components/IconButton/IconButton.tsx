import { useRef, useImperativeHandle, forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import type { IconButton as IconButtonEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<IconButtonEl> & AnchorHTMLAttributes<IconButtonEl>,
  'label' | 'size' | 'disabled' | 'href'
> & {
  icon?: LattyIconName;
  label?: string;
  variant?: IconButtonEl['variant'];
  appearance?: IconButtonEl['appearance'];
  bordered?: boolean;
  size?: IconButtonEl['size'];
  disabled?: boolean;
  href?: string;
  round?: boolean;
};

export const IconButton = forwardRef<IconButtonEl, IconButtonProps>(function IconButton(
  { bordered, disabled, round, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<IconButtonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-icon-button
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      bordered={bordered || undefined}
      disabled={disabled || undefined}
      round={round || undefined}
    >
      {children}
    </lt-icon-button>
  );
});
IconButton.displayName = 'IconButton';
