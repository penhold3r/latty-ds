import { useRef, useEffect, useImperativeHandle, forwardRef, type ImgHTMLAttributes } from 'react';
import type { Image as ImageEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type ImageProps = Omit<ImgHTMLAttributes<ImageEl>, 'onLoad' | 'onError' | 'src'> & {
  src?: string;
  aspectRatio?: string;
  rounded?: ImageEl['rounded'];
  responsive?: boolean;
  onLoad?: (event: CustomEvent<{ src: string }>) => void;
  onError?: (event: CustomEvent<{ src: string }>) => void;
};

export const Image = forwardRef<ImageEl, ImageProps>(function Image(
  { onLoad, onError, aspectRatio, responsive, children, ...props },
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
    <lt-image
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      aspect-ratio={aspectRatio}
      responsive={responsive || undefined}
    >
      {children}
    </lt-image>
  );
});
Image.displayName = 'Image';
