import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { EmptyState as EmptyStateEl, LattyIconName } from '@latty/web';

export type EmptyStateProps = {
  icon?: LattyIconName;
  title?: string;
  description?: string;
  size?: EmptyStateEl['size'];
  children?: ReactNode;
};

export const EmptyState = forwardRef<EmptyStateEl, EmptyStateProps>(function EmptyState(
  { children, ...props },
  forwardedRef
) {
  const innerRef = useRef<EmptyStateEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-empty-state ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-empty-state>
  );
});
EmptyState.displayName = 'EmptyState';
