import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Progress as ProgressEl } from '@latty/web';

export type ProgressProps = {
  value?: number;
  variant?: ProgressEl['variant'];
  size?: ProgressEl['size'];
  label?: string;
  indeterminate?: boolean;
  children?: ReactNode;
};

export const Progress = forwardRef<ProgressEl, ProgressProps>(function Progress({ children, ...props }, forwardedRef) {
  const innerRef = useRef<ProgressEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-progress ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-progress>
  );
});
Progress.displayName = 'Progress';
