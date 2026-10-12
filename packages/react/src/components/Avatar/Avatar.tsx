import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Avatar as AvatarEl } from '@latty-ds/web';

export type AvatarProps = HTMLAttributes<AvatarEl> & {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarEl['size'];
  shape?: AvatarEl['shape'];
  color?: AvatarEl['color'];
  status?: AvatarEl['status'];
  statusLabel?: string;
};

export const Avatar = forwardRef<AvatarEl, AvatarProps>(function Avatar({ status, children, ...props }, forwardedRef) {
  const innerRef = useRef<AvatarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (status !== undefined) el.status = status;
  }, [status]);

  return (
    <lt-avatar ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-avatar>
  );
});
Avatar.displayName = 'Avatar';
