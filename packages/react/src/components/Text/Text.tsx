import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Text as TextEl } from '@latty-ds/web';

export type TextProps = HTMLAttributes<TextEl> & {
  variant?: TextEl['variant'];
  as?: TextEl['as'];
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
