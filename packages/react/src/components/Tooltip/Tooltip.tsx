import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Tooltip as TooltipEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TooltipProps = Omit<HTMLAttributes<TooltipEl>, 'content' | 'disabled' | 'color'> & {
  content?: string;
  placement?: TooltipEl['placement'];
  disabled?: boolean;
  background?: string;
  color?: string;
  delay?: number;
  hoverable?: boolean;
  touch?: boolean;
};

export const Tooltip = forwardRef<TooltipEl, TooltipProps>(function Tooltip(
  { disabled, hoverable, touch, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TooltipEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-tooltip
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      hoverable={hoverable || undefined}
      touch={touch || undefined}
    >
      {children}
    </lt-tooltip>
  );
});
Tooltip.displayName = 'Tooltip';
