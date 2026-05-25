import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Dialog as DialogEl } from '@latty/web';

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
  onDialogClose?: (event: CustomEvent) => void;
};

export const Dialog = forwardRef<DialogEl, DialogProps>(function Dialog(
  { onDialogOpen, onDialogClose, children, ...props },
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
    if (!el || !onDialogClose) return;
    const h = (ev: Event) => onDialogClose!(ev as CustomEvent);
    el.addEventListener('dialog-close', h);
    return () => el.removeEventListener('dialog-close', h);
  }, [onDialogClose]);

  return (
    <lt-dialog ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-dialog>
  );
});
Dialog.displayName = 'Dialog';
