import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { ListItem as ListItemEl, LattyIconName } from '@latty/web';

export type ListItemProps = {
  icon?: LattyIconName;
  iconEnd?: LattyIconName;
  children?: ReactNode;
};

export const ListItem = forwardRef<ListItemEl, ListItemProps>(
  function ListItem({ children, ...props }, forwardedRef) {
    const innerRef = useRef<ListItemEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-list-item ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-list-item>
    );
  }
);
ListItem.displayName = 'ListItem';
