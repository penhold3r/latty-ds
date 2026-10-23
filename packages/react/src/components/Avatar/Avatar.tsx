import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type ImgHTMLAttributes } from 'react';
import type { Avatar as AvatarEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type AvatarProps = Omit<ImgHTMLAttributes<AvatarEl>, 'src' | 'name' | 'alt' | 'size' | 'color'> & {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarEl['size'];
  shape?: AvatarEl['shape'];
  color?: AvatarEl['color'];
  status?: AvatarEl['status'];
  statusLabel?: string;
};

export const Avatar = forwardRef<AvatarEl, AvatarProps>(function Avatar(
  { status, statusLabel, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<AvatarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (status !== undefined) el.status = status;
  }, [status]);

  return (
    <lt-avatar
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      status-label={statusLabel}
    >
      {children}
    </lt-avatar>
  );
});
Avatar.displayName = 'Avatar';
