import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Image as ImageEl } from '@latty/web';

export type ImageProps = HTMLAttributes<ImageEl> & {
  src?: string;
  alt?: string;
  rounded?: ImageEl['rounded'];
  responsive?: boolean;
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
