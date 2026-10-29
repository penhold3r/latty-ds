// codegen:manual
import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Icon as IconEl, LattyIconName, IconSize } from '@latty-ds/icons';
import '@latty-ds/icons';
import { normalizeNativeProps } from '../../normalize-props';

export type IconProps = HTMLAttributes<IconEl> & {
  name: LattyIconName;
  size?: IconSize;
  /** Accessible label. When set, the icon is informative (`role="img"` + `aria-label`). When absent, decorative (`aria-hidden="true"`). */
  label?: string;
};

export const Icon = forwardRef<IconEl, IconProps>(function Icon(props, forwardedRef) {
  const innerRef = useRef<IconEl>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);
  return <lt-icon ref={innerRef} {...normalizeNativeProps(props as unknown as Record<string, unknown>)} />;
});
Icon.displayName = 'Icon';
