import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Button as ButtonEl, LattyIconName } from '@latty-ds/web';

export type ButtonProps = HTMLAttributes<ButtonEl> & {
  formAssociated?: boolean;
  variant?: ButtonEl['variant'];
  appearance?: ButtonEl['appearance'];
  size?: ButtonEl['size'];
  disabled?: boolean;
  loading?: boolean;
  iconStart?: LattyIconName;
  iconEnd?: LattyIconName;
  fullWidth?: boolean;
  uppercase?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  type?: ButtonEl['type'];
};

export const Button = forwardRef<ButtonEl, ButtonProps>(function Button({ children, ...props }, forwardedRef) {
  const innerRef = useRef<ButtonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-button ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-button>
  );
});
Button.displayName = 'Button';
