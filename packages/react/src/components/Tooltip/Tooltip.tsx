import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Tooltip as TooltipEl } from '@latty-ds/web';

export type TooltipProps = HTMLAttributes<TooltipEl> & {
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
      {...(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      hoverable={hoverable || undefined}
      touch={touch || undefined}
    >
      {children}
    </lt-tooltip>
  );
});
Tooltip.displayName = 'Tooltip';
