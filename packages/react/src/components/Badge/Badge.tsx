import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Badge as BadgeEl } from '@latty-ds/web';

export type BadgeProps = HTMLAttributes<BadgeEl> & {
  appearance?: BadgeEl['appearance'];
  variant?: BadgeEl['variant'];
  size?: BadgeEl['size'];
  content?: string;
  max?: BadgeEl['max'];
  dot?: boolean;
};

export const Badge = forwardRef<BadgeEl, BadgeProps>(function Badge({ max, children, ...props }, forwardedRef) {
  const innerRef = useRef<BadgeEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (max !== undefined) el.max = max;
  }, [max]);

  return (
    <lt-badge ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-badge>
  );
});
Badge.displayName = 'Badge';
