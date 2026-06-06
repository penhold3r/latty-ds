import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Divider as DividerEl } from '@latty-ds/web';

export type DividerProps = HTMLAttributes<DividerEl> & {
  orientation?: DividerEl['orientation'];
  appearance?: DividerEl['appearance'];
  label?: string;
};

export const Divider = forwardRef<DividerEl, DividerProps>(function Divider({ children, ...props }, forwardedRef) {
  const innerRef = useRef<DividerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-divider ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-divider>
  );
});
Divider.displayName = 'Divider';
