import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { AvatarGroup as AvatarGroupEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type AvatarGroupProps = Omit<HTMLAttributes<AvatarGroupEl>, 'size' | 'max'> & {
  size?: AvatarGroupEl['size'];
  max?: AvatarGroupEl['max'];
  overflowLabel?: string;
};

export const AvatarGroup = forwardRef<AvatarGroupEl, AvatarGroupProps>(function AvatarGroup(
  { size, max, overflowLabel, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<AvatarGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (size !== undefined) el.size = size;
    if (max !== undefined) el.max = max;
  }, [size, max]);

  return (
    <lt-avatar-group
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      overflow-label={overflowLabel}
    >
      {children}
    </lt-avatar-group>
  );
});
AvatarGroup.displayName = 'AvatarGroup';
