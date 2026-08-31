import Link from '@docusaurus/Link';
import './RecipeGrid.styles.css';

const RECIPES = [
  {
    label: 'Login Form',
    href: '/recipes/login-form',
    desc: 'Sign-in form with email, password, remember me, and forgot password link'
  },
  {
    label: 'Profile Card',
    href: '/recipes/profile-card',
    desc: 'User profile widget with avatar, name, role, skill tags, and action buttons'
  },
  {
    label: 'Content Card',
    href: '/recipes/content-card',
    desc: 'Media card with image, category badge, title, excerpt, and a call-to-action'
  },
  {
    label: 'Hero Banner',
    href: '/recipes/hero-banner',
    desc: 'Full-width banner with background overlay, headline, subtext, and CTA buttons'
  },
  {
    label: 'Stats Widget',
    href: '/recipes/stats-widget',
    desc: 'Dashboard metrics panel with icon, value, label, and progress bar per stat'
  },
  {
    label: 'Empty State',
    href: '/recipes/empty-state',
    desc: 'Zero-data placeholder with icon circle, message, and a call to action'
  }
];

// Ported from docs/src/pages/recipes/introduction/index.astro's static grid.
// @docusaurus/Link instead of a plain <a>, same as ComponentGrid.
export default function RecipeGrid(): JSX.Element {
  return (
    <div className="recipe-grid">
      {RECIPES.map((r) => (
        <Link key={r.href} className="recipe-card" to={r.href}>
          {/* @ts-expect-error -- lt-surface is a custom element, not a typed JSX intrinsic */}
          <lt-surface elevation="1">
            {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
            <lt-text variant="label">{r.label}</lt-text>
            {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
            <lt-text variant="caption">{r.desc}</lt-text>
            {/* @ts-expect-error -- lt-surface is a custom element, not a typed JSX intrinsic */}
          </lt-surface>
        </Link>
      ))}
    </div>
  );
}
