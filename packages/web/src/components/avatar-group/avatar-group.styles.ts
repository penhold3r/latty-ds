import { css } from 'lit';

export const avatarGroupStyles = css`
  :host {
    align-items: center;
    display: inline-flex;
  }

  /* Overlap: each avatar (and the overflow indicator) is pulled back over the previous one. Later elements paint
     on top by default DOM order, so the stack reads left-to-right (first → last, in reading order). A ring
     matching the page background separates the overlapping edges — same technique as lt-avatar's own status
     dot, and overridable the same way via the same custom property. */
  ::slotted(lt-avatar) {
    box-shadow: 0 0 0 2px var(--lt-avatar-status-ring, var(--lt-bg-default));
    margin-inline-start: var(--lt-avatar-group-overlap, -10px);
  }

  ::slotted(lt-avatar:first-child) {
    margin-inline-start: 0;
  }

  /* The overflow indicator is only ever in the DOM when there's something to show (see render()), so no
     conditional display rule is needed here — only sizing, mirroring lt-avatar's own scale since it stands in
     for an avatar. */
  .overflow {
    align-items: center;
    background: var(--lt-avatar-bg, var(--lt-bg-overlay));
    border-radius: 999px;
    box-shadow: 0 0 0 2px var(--lt-avatar-status-ring, var(--lt-bg-default));
    box-sizing: border-box;
    color: var(--lt-avatar-color, var(--lt-text-neutral));
    display: inline-flex;
    flex-shrink: 0;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    font-weight: 600;
    justify-content: center;
    letter-spacing: 0.02em;
    line-height: 1;
    margin-inline-start: var(--lt-avatar-group-overlap, -10px);
    user-select: none;

    /* Default to lt-avatar's own "md" dimensions, used whenever size is unset on the group. */
    font-size: 0.9375rem;
    height: 40px;
    width: 40px;
  }

  :host([shape='square']) .overflow {
    border-radius: var(--lt-border-radius);
  }

  :host([size='xs']) .overflow {
    font-size: 0.625rem;
    height: 24px;
    width: 24px;
  }

  :host([size='sm']) .overflow {
    font-size: 0.75rem;
    height: 32px;
    width: 32px;
  }

  :host([size='lg']) .overflow {
    font-size: 1.125rem;
    height: 52px;
    width: 52px;
  }

  :host([size='xl']) .overflow {
    font-size: 1.5rem;
    height: 68px;
    width: 68px;
  }
`;
