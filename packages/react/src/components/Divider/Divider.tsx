import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Divider as DividerEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type DividerProps = Omit<HTMLAttributes<DividerEl>, 'label'> & {
  orientation?: DividerEl['orientation'];
  appearance?: DividerEl['appearance'];
  label?: string;
};

export const Divider = forwardRef<DividerEl, DividerProps>(function Divider({ children, ...props }, forwardedRef) {
  const innerRef = useRef<DividerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-divider ref={innerRef} suppressHydrationWarning {...normalizeNativeProps(props as Record<string, unknown>)}>
      {children}
    </lt-divider>
  );
});
Divider.displayName = 'Divider';
