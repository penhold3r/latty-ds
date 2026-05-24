// codegen:manual
import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Icon as IconEl, LattyIconName, IconSize } from '@latty/icons';
import '@latty/icons';

export type IconProps = HTMLAttributes<IconEl> & {
  name: LattyIconName;
  size?: IconSize;
};

export const Icon = forwardRef<IconEl, IconProps>(function Icon(props, forwardedRef) {
  const innerRef = useRef<IconEl>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);
  return <lt-icon ref={innerRef} {...(props as unknown as Record<string, unknown>)} />;
});
Icon.displayName = 'Icon';
