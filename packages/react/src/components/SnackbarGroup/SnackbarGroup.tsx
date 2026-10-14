import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { SnackbarGroup as SnackbarGroupEl } from '@latty-ds/web';

export type SnackbarGroupProps = HTMLAttributes<SnackbarGroupEl> & {
  maxVisible?: number;
};

export const SnackbarGroup = forwardRef<SnackbarGroupEl, SnackbarGroupProps>(function SnackbarGroup(
  { children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SnackbarGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-snackbar-group ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-snackbar-group>
  );
});
SnackbarGroup.displayName = 'SnackbarGroup';
