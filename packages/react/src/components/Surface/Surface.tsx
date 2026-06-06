import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Surface as SurfaceEl } from '@latty-ds/web';

export type SurfaceProps = HTMLAttributes<SurfaceEl> & {
  elevation?: SurfaceEl['elevation'];
  appearance?: SurfaceEl['appearance'];
  background?: string;
};

export const Surface = forwardRef<SurfaceEl, SurfaceProps>(function Surface({ children, ...props }, forwardedRef) {
  const innerRef = useRef<SurfaceEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-surface ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-surface>
  );
});
Surface.displayName = 'Surface';
