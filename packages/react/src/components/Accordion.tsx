import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Accordion as AccordionEl } from '@latty/web';

export type AccordionProps = {
  label?: string;
  icon?: string;
  variant?: AccordionEl['variant'];
  open?: boolean;
  disabled?: boolean;
  onToggle?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Accordion = forwardRef<AccordionEl, AccordionProps>(
  function Accordion({ onToggle, children, ...props }, forwardedRef) {
    const innerRef = useRef<AccordionEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onToggle) return;
      const h = (ev: Event) => onToggle!(ev as CustomEvent);
      el.addEventListener('toggle', h);
      return () => el.removeEventListener('toggle', h);
    }, [onToggle]);

    return (
      <lt-accordion ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-accordion>
    );
  }
);
Accordion.displayName = 'Accordion';
