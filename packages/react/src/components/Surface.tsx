import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Surface as SurfaceEl } from '@latty/web';

export type SurfaceProps = {
  elevation?: SurfaceEl['elevation'];
  variant?: SurfaceEl['variant'];
  backgroundColor?: string;
  children?: ReactNode;
};

export const Surface = forwardRef<SurfaceEl, SurfaceProps>(
  function Surface({ children, ...props }, forwardedRef) {
    const innerRef = useRef<SurfaceEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-surface ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-surface>
    );
  }
);
Surface.displayName = 'Surface';
