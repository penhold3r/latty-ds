import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { List as ListEl } from '@latty/web';

export type ListProps = {
  type?: ListEl['type'];
  size?: ListEl['size'];
  markerColor?: string;
  children?: ReactNode;
};

export const List = forwardRef<ListEl, ListProps>(
  function List({ children, ...props }, forwardedRef) {
    const innerRef = useRef<ListEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-list ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-list>
    );
  }
);
List.displayName = 'List';
