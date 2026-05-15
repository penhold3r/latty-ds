import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { SidePanel as SidePanelEl } from '@latty/web';

export type SidePanelProps = {
  open?: boolean;
  anchor?: SidePanelEl['anchor'];
  size?: string;
  label?: string;
  noCloseButton?: boolean;
  backdropBlur?: boolean;
  overlayOpacity?: number;
  onLtClose?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const SidePanel = forwardRef<SidePanelEl, SidePanelProps>(function SidePanel(
  { onLtClose, noCloseButton, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SidePanelEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtClose) return;
    const h = (ev: Event) => onLtClose!(ev as CustomEvent);
    el.addEventListener('lt-close', h);
    return () => el.removeEventListener('lt-close', h);
  }, [onLtClose]);
  // React 18 lowercases camelCase props on custom elements — set as attribute directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (noCloseButton) el.setAttribute('no-close-button', '');
    else el.removeAttribute('no-close-button');
  }, [noCloseButton]);

  return (
    <lt-sidepanel ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-sidepanel>
  );
});
SidePanel.displayName = 'SidePanel';
