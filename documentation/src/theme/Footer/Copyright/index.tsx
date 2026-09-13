import React from 'react';

// Swizzled from @docusaurus/theme-classic's theme/Footer/Copyright to render
// via lt-text instead of a bare <div>. `copyright` is arbitrary HTML from
// docusaurus.config.ts's themeConfig.footer.copyright (currently just a plain
// text string, but the type allows markup) — kept as dangerouslySetInnerHTML,
// just moved onto lt-text's own slot instead of a plain div's.
interface FooterCopyrightProps {
  copyright: string;
}

export default function FooterCopyright({ copyright }: FooterCopyrightProps): JSX.Element {
  return (
    <lt-text
      variant="caption"
      class="footer__copyright"
      // Developer provided the HTML, so assume it's safe (same as the original).
      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  );
}
