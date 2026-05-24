import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Skeleton as SkeletonEl } from '@latty/web';

export type SkeletonProps = HTMLAttributes<SkeletonEl> & {
  shape?: SkeletonEl['shape'];
  width?: string;
  height?: string;
  animated?: boolean;
};

export const Skeleton = forwardRef<SkeletonEl, SkeletonProps>(function Skeleton({ children, ...props }, forwardedRef) {
  const innerRef = useRef<SkeletonEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-skeleton ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-skeleton>
  );
});
Skeleton.displayName = 'Skeleton';
