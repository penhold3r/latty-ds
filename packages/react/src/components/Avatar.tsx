import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Avatar as AvatarEl } from '@latty/web';

export type AvatarProps = {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarEl['size'];
  shape?: AvatarEl['shape'];
  color?: AvatarEl['color'];
  children?: ReactNode;
};

export const Avatar = forwardRef<AvatarEl, AvatarProps>(
  function Avatar({ children, ...props }, forwardedRef) {
    const innerRef = useRef<AvatarEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-avatar ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-avatar>
    );
  }
);
Avatar.displayName = 'Avatar';
