import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Progress as ProgressEl } from '@latty-ds/web';

export type ProgressProps = HTMLAttributes<ProgressEl> & {
  value?: number;
  variant?: ProgressEl['variant'];
  size?: ProgressEl['size'];
  label?: string;
  max?: number;
  valueText?: string;
  indeterminate?: boolean;
};

export const Progress = forwardRef<ProgressEl, ProgressProps>(function Progress(
  { valueText, indeterminate, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ProgressEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-progress
      ref={innerRef}
      {...(props as Record<string, unknown>)}
      value-text={valueText}
      indeterminate={indeterminate || undefined}
    >
      {children}
    </lt-progress>
  );
});
Progress.displayName = 'Progress';
