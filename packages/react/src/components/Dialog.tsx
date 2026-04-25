import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Dialog as DialogEl } from '@latty/web';

export type DialogProps = {
  size?: DialogEl['size'];
  open?: boolean;
  title?: string;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  dialogElement?: DialogEl['dialogElement'];
  previouslyFocusedElement?: DialogEl['previouslyFocusedElement'];
  handleKeydown?: string;
  onLtDialogOpen?: (event: CustomEvent) => void;
  onLtDialogClose?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Dialog = forwardRef<DialogEl, DialogProps>(
  function Dialog({ onLtDialogOpen, onLtDialogClose, children, ...props }, forwardedRef) {
    const innerRef = useRef<DialogEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtDialogOpen) return;
      const h = (ev: Event) => onLtDialogOpen!(ev as CustomEvent);
      el.addEventListener('lt-dialog-open', h);
      return () => el.removeEventListener('lt-dialog-open', h);
    }, [onLtDialogOpen]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtDialogClose) return;
      const h = (ev: Event) => onLtDialogClose!(ev as CustomEvent);
      el.addEventListener('lt-dialog-close', h);
      return () => el.removeEventListener('lt-dialog-close', h);
    }, [onLtDialogClose]);

    return (
      <lt-dialog ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-dialog>
    );
  }
);
Dialog.displayName = 'Dialog';
