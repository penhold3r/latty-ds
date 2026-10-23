import { useRef, useImperativeHandle, forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import type { ListItem as ListItemEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type ListItemProps = Omit<
  ButtonHTMLAttributes<ListItemEl> & AnchorHTMLAttributes<ListItemEl>,
  'href' | 'disabled'
> & {
  iconStart?: LattyIconName;
  iconEnd?: LattyIconName;
  clickable?: boolean;
  href?: string;
  disabled?: boolean;
};

export const ListItem = forwardRef<ListItemEl, ListItemProps>(function ListItem(
  { iconStart, iconEnd, clickable, disabled, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ListItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-list-item
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      icon-start={iconStart}
      icon-end={iconEnd}
      clickable={clickable || undefined}
      disabled={disabled || undefined}
    >
      {children}
    </lt-list-item>
  );
});
ListItem.displayName = 'ListItem';
