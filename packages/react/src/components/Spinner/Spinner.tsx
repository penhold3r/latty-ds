import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Spinner as SpinnerEl } from '@latty-ds/web';

export type SpinnerProps = HTMLAttributes<SpinnerEl> & {
  size?: SpinnerEl['size'];
  variant?: SpinnerEl['variant'];
};

export const Spinner = forwardRef<SpinnerEl, SpinnerProps>(function Spinner({ children, ...props }, forwardedRef) {
  const innerRef = useRef<SpinnerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-spinner ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-spinner>
  );
});
Spinner.displayName = 'Spinner';
