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
  onDialogOpen?: () => void;
  onClose?: () => void;
  onDialogClose?: () => void;
  onOpen?: () => void;
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
    const h = () => onDialogOpen!();
    el.addEventListener('dialog-open', h);
    return () => el.removeEventListener('dialog-open', h);
  }, [onDialogOpen]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onClose) return;
    const h = () => onClose!();
    el.addEventListener('close', h);
    return () => el.removeEventListener('close', h);
  }, [onClose]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onDialogClose) return;
    const h = () => onDialogClose!();
    el.addEventListener('dialog-close', h);
    return () => el.removeEventListener('dialog-close', h);
  }, [onDialogClose]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onOpen) return;
    const h = () => onOpen!();
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
