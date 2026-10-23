// codegen:manual — extended to set no-close-button attribute directly (React 18 lowercases camelCase on custom elements)
import { useRef, useEffect, useLayoutEffect, useImperativeHandle, forwardRef, type DialogHTMLAttributes } from 'react';
import type { SidePanel as SidePanelEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type SidePanelProps = Omit<DialogHTMLAttributes<SidePanelEl>, 'open' | 'size' | 'label'> & {
  open?: boolean;
  anchor?: SidePanelEl['anchor'];
  size?: string;
  label?: string;
  noCloseButton?: boolean;
  backdropBlur?: boolean;
  overlayOpacity?: number;
  labels?: SidePanelEl['labels'];
  onClose?: (event: CustomEvent) => void;
};

export const SidePanel = forwardRef<SidePanelEl, SidePanelProps>(function SidePanel(
  { onClose, open, noCloseButton, backdropBlur, overlayOpacity, labels, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SidePanelEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = (ev: Event) => onClose!(ev as CustomEvent);
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);
  // React 18 lowercases camelCase props on custom elements — set as attribute directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (noCloseButton) el.setAttribute('no-close-button', '');
    else el.removeAttribute('no-close-button');
  }, [noCloseButton]);
  // React 18 stringifies non-primitive JSX props into a DOM attribute instead of setting the property (see
  // scripts/codegen-wrappers.mjs) — assign labels imperatively via the ref instead of spreading it as a JSX prop.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-sidepanel
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      open={open || undefined}
      no-close-button={noCloseButton || undefined}
      backdrop-blur={backdropBlur || undefined}
      overlay-opacity={overlayOpacity}
    >
      {children}
    </lt-sidepanel>
  );
});
SidePanel.displayName = 'SidePanel';
