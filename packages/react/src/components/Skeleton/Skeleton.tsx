import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Skeleton as SkeletonEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type SkeletonProps = Omit<HTMLAttributes<SkeletonEl>, 'width' | 'height'> & {
  shape?: SkeletonEl['shape'];
  width?: string;
  height?: string;
  animated?: boolean;
};

export const Skeleton = forwardRef<SkeletonEl, SkeletonProps>(function Skeleton(
  { animated, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SkeletonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-skeleton
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      animated={animated || undefined}
    >
      {children}
    </lt-skeleton>
  );
});
Skeleton.displayName = 'Skeleton';
