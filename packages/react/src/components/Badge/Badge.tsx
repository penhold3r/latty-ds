import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Badge as BadgeEl } from '@latty/web';

export type BadgeProps = {
  appearance?: BadgeEl['appearance'];
  variant?: BadgeEl['variant'];
  size?: BadgeEl['size'];
  content?: string;
  dot?: boolean;
  children?: ReactNode;
};

export const Badge = forwardRef<BadgeEl, BadgeProps>(
  function Badge({ children, ...props }, forwardedRef) {
    const innerRef = useRef<BadgeEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-badge ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-badge>
    );
  }
);
Badge.displayName = 'Badge';
