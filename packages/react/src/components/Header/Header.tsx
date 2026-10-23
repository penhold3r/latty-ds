// codegen:manual
import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { Header as HeaderEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type HeaderProps = HTMLAttributes<HeaderEl> & {
  background?: HeaderEl['background'];
  /** Far-left area — hamburger menu, back button, etc. */
  before?: ReactNode;
  /** Logo or brand mark, placed to the right of `before`. */
  logo?: ReactNode;
  /** Far-right area — user avatar, action icons, etc. */
  after?: ReactNode;
  /** Main content area (nav links, search…); stretches to fill available space. */
  children?: ReactNode;
};

export const Header = forwardRef<HeaderEl, HeaderProps>(function Header(
  { background, before, logo, after, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<HeaderEl>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-header
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      background={background}
    >
      {before && <span slot="before">{before}</span>}
      {logo && <span slot="logo">{logo}</span>}
      {children && <span slot="content">{children}</span>}
      {after && <span slot="after">{after}</span>}
    </lt-header>
  );
});
Header.displayName = 'Header';
