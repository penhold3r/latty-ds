import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Text as TextEl } from '@latty/web';

export type TextProps = {
  variant?: TextEl['variant'];
  as?: TextEl['as'];
  children?: ReactNode;
};

export const Text = forwardRef<TextEl, TextProps>(function Text({ children, ...props }, forwardedRef) {
  const innerRef = useRef<TextEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-text ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-text>
  );
});
Text.displayName = 'Text';
