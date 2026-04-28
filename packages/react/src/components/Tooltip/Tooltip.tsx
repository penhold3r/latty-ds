import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Tooltip as TooltipEl } from '@latty/web';

export type TooltipProps = {
  content?: string;
  position?: TooltipEl['position'];
  disabled?: boolean;
  backgroundColor?: string;
  color?: string;
  children?: ReactNode;
};

export const Tooltip = forwardRef<TooltipEl, TooltipProps>(
  function Tooltip({ children, ...props }, forwardedRef) {
    const innerRef = useRef<TooltipEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-tooltip ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-tooltip>
    );
  }
);
Tooltip.displayName = 'Tooltip';
