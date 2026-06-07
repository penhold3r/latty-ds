import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Dialog as DialogEl } from '@latty-ds/web';

export type DialogProps = HTMLAttributes<DialogEl> & {
  size?: DialogEl['size'];
  open?: boolean;
  title?: string;
  noCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  uppercase?: boolean;
  backdropBlur?: boolean;
  onDialogOpen?: (event: CustomEvent) => void;
  onClose?: (event: CustomEvent) => void;
  onDialogClose?: (event: CustomEvent) => void;
  onOpen?: (event: CustomEvent) => void;
};

export const Dialog = forwardRef<DialogEl, DialogProps>(function Dialog(
  { onDialogOpen, onClose, onDialogClose, onOpen, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DialogEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onDialogOpen) return;
    const h = (ev: Event) => onDialogOpen!(ev as CustomEvent);
    el.addEventListener('dialog-open', h);
    return () => el.removeEventListener('dialog-open', h);
  }, [onDialogOpen]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = (ev: Event) => onClose!(ev as CustomEvent);
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onDialogClose) return;
    const h = (ev: Event) => onDialogClose!(ev as CustomEvent);
    el.addEventListener('dialog-close', h);
    return () => el.removeEventListener('dialog-close', h);
  }, [onDialogClose]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onOpen) return;
    const h = (ev: Event) => onOpen!(ev as CustomEvent);
    el.addEventListener('open', h);
    return () => el.removeEventListener('open', h);
  }, [onOpen]);

  return (
    <lt-dialog ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-dialog>
  );
});
Dialog.displayName = 'Dialog';
