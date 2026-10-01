import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Dialog as DialogEl } from '@latty-ds/web';

export type DialogProps = HTMLAttributes<DialogEl> & {
  size?: DialogEl['size'];
  open?: boolean;
  heading?: string;
  title?: string;
  noCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  uppercase?: boolean;
  backdropBlur?: boolean;
  elevation?: DialogEl['elevation'];
  appearance?: DialogEl['appearance'];
  labels?: DialogEl['labels'];
  onOpen?: (event: CustomEvent) => void;
  onClose?: (event: CustomEvent) => void;
};

export const Dialog = forwardRef<DialogEl, DialogProps>(function Dialog(
  { onOpen, onClose, labels, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DialogEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onOpen) return;
    const h = (ev: Event) => onOpen!(ev as CustomEvent);
    el.addEventListener('open', h);
    return () => el.removeEventListener('open', h);
  }, [onOpen]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = (ev: Event) => onClose!(ev as CustomEvent);
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-dialog ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-dialog>
  );
});
Dialog.displayName = 'Dialog';
