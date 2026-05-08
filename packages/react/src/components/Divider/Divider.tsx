import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Divider as DividerEl } from '@latty/web';

export type DividerProps = {
  orientation?: DividerEl['orientation'];
  variant?: DividerEl['variant'];
  label?: string;
  children?: ReactNode;
};

export const Divider = forwardRef<DividerEl, DividerProps>(
  function Divider({ children, ...props }, forwardedRef) {
    const innerRef = useRef<DividerEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-divider ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-divider>
    );
  }
);
Divider.displayName = 'Divider';
