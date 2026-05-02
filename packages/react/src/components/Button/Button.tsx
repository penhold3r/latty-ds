import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Button as ButtonEl, LattyIconName } from '@latty/web';

export type ButtonProps = {
  variant?: ButtonEl['variant'];
  appearance?: ButtonEl['appearance'];
  size?: ButtonEl['size'];
  disabled?: boolean;
  loading?: boolean;
  icon?: LattyIconName;
  iconEnd?: LattyIconName;
  fullWidth?: boolean;
  children?: ReactNode;
};

export const Button = forwardRef<ButtonEl, ButtonProps>(
  function Button({ children, ...props }, forwardedRef) {
    const innerRef = useRef<ButtonEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-button ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-button>
    );
  }
);
Button.displayName = 'Button';
