import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Image as ImageEl } from '@latty/web';

export type ImageProps = {
  src?: string;
  alt?: string;
  rounded?: ImageEl['rounded'];
  responsive?: boolean;
  children?: ReactNode;
};

export const Image = forwardRef<ImageEl, ImageProps>(function Image({ children, ...props }, forwardedRef) {
  const innerRef = useRef<ImageEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-image ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-image>
  );
});
Image.displayName = 'Image';
