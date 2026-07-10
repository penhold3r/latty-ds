import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Image as ImageEl } from '@latty-ds/web';

export type ImageProps = HTMLAttributes<ImageEl> & {
  src?: string;
  alt?: string;
  rounded?: ImageEl['rounded'];
  responsive?: boolean;
  loading?: ImageEl['loading'];
  onName?: () => void;
  onLoad?: (detail: { src: string }) => void;
  onError?: (detail: { src: string }) => void;
};

export const Image = forwardRef<ImageEl, ImageProps>(function Image(
  { onName, onLoad, onError, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ImageEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onName) return;
    const h = () => onName!();
    el.addEventListener('name', h);
    return () => el.removeEventListener('name', h);
  }, [onName]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLoad) return;
    const h = (ev: Event) => onLoad!((ev as CustomEvent).detail);
    el.addEventListener('lt-load', h);
    return () => el.removeEventListener('lt-load', h);
  }, [onLoad]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onError) return;
    const h = (ev: Event) => onError!((ev as CustomEvent).detail);
    el.addEventListener('lt-error', h);
    return () => el.removeEventListener('lt-error', h);
  }, [onError]);

  return (
    <lt-image ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-image>
  );
});
Image.displayName = 'Image';
