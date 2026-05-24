import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { IconButton as IconButtonEl, LattyIconName } from '@latty/web';

export type IconButtonProps = HTMLAttributes<IconButtonEl> & {
  icon?: LattyIconName;
  label?: string;
  variant?: IconButtonEl['variant'];
  appearance?: IconButtonEl['appearance'];
  size?: IconButtonEl['size'];
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  round?: boolean;
};

export const IconButton = forwardRef<IconButtonEl, IconButtonProps>(function IconButton(
  { children, ...props },
  forwardedRef
) {
  const innerRef = useRef<IconButtonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-icon-button ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-icon-button>
  );
});
IconButton.displayName = 'IconButton';
