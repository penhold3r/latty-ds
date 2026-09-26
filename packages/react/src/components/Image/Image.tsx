import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Image as ImageEl } from '@latty-ds/web';

export type ImageProps = Omit<HTMLAttributes<ImageEl>, 'onLoad' | 'onError'> & {
  src?: string;
  alt?: string;
  rounded?: ImageEl['rounded'];
  responsive?: boolean;
  loading?: ImageEl['loading'];
  onLoad?: (event: CustomEvent<{ src: string }>) => void;
  onError?: (event: CustomEvent<{ src: string }>) => void;
};

export const Image = forwardRef<ImageEl, ImageProps>(function Image(
  { onLoad, onError, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ImageEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLoad) return;
    const h = (ev: Event) => onLoad!(ev as CustomEvent<{ src: string }>);
    el.addEventListener('load', h);
    return () => el.removeEventListener('load', h);
  }, [onLoad]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onError) return;
    const h = (ev: Event) => onError!(ev as CustomEvent<{ src: string }>);
    el.addEventListener('error', h);
    return () => el.removeEventListener('error', h);
  }, [onError]);

  return (
    <lt-image ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-image>
  );
});
Image.displayName = 'Image';
