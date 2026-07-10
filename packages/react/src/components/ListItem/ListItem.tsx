import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { ListItem as ListItemEl, LattyIconName } from '@latty-ds/web';

export type ListItemProps = HTMLAttributes<ListItemEl> & {
  iconStart?: LattyIconName;
  iconEnd?: LattyIconName;
  clickable?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
};

export const ListItem = forwardRef<ListItemEl, ListItemProps>(function ListItem({ children, ...props }, forwardedRef) {
  const innerRef = useRef<ListItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-list-item ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-list-item>
  );
});
ListItem.displayName = 'ListItem';
