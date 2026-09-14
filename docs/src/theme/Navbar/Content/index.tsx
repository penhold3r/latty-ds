import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames, useColorMode } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
// Reads the repo-root lerna.json for the version badge — same pattern the
// Astro site's BaseLayout uses (root-level version metadata, not another
// workspace package's src, so this isn't the cross-package relative import
// check:boundaries polices).
import lernaJson from '../../../../../lerna.json';

// Swizzled to match the Astro site's BaseLayout header (lt-header background="primary",
// with a version badge, theme toggle, and GitHub link built from lt-icon-button/lt-badge) —
// see _agent-plans/DOCUSAURUS-MIGRATION-PLAN.md's deferred "chrome swizzle" item.
//
// Deliberately narrow: only the *content* inside Docusaurus's own <nav> wrapper is replaced.
// `Navbar/Layout` (hide-on-scroll, mobile sidebar backdrop/coordination, ARIA label) and the
// mobile sidebar toggle/logo (`Navbar/MobileSidebar/Toggle`, `Navbar/Logo`) stay the stock
// components — reimplementing those correctly (focus trapping, scroll-lock, aria-expanded
// wiring) isn't worth the risk for what's a purely visual/branding change. `themeConfig.navbar`
// still drives the colored bar (`style: 'primary'`) and the logo image/link.
export default function NavbarContent(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const { colorMode, setColorMode } = useColorMode();
  const version = `v${lernaJson.version}`;

  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items')}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
      </div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        <lt-badge class="navbar__version-badge" content={version} variant="neutral" appearance="filled" size="sm" />
        <lt-icon-button
          class="navbar__header-btn"
          label="Toggle theme"
          icon="moon"
          size="sm"
          round
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
        />
        <lt-icon-button
          class="navbar__header-btn"
          label="View on GitHub"
          icon="github"
          size="sm"
          href="https://github.com/penhold3r/latty-ds"
          target="_blank"
          rel="noopener noreferrer"
          round
        />
      </div>
    </div>
  );
}
