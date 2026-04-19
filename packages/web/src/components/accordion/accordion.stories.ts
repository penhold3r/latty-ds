import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './accordion';

const meta: Meta = {
  title: 'Components/Accordion',
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'text' },
    variant: { control: 'select', options: ['default', 'filled', 'outlined'] },
    open: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  args: {
    label: 'Accordion title',
    icon: '',
    variant: 'default',
    open: false,
    disabled: false
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-accordion
      label=${args.label}
      icon=${args.icon}
      variant=${args.variant}
      ?open=${args.open}
      ?disabled=${args.disabled}
    >
      This is the accordion content. It can contain any HTML content including text, images, and other components.
    </lt-accordion>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-accordion variant="default" label="Default variant" open>
        This accordion uses the default variant with a white background and border.
      </lt-accordion>

      <lt-accordion variant="filled" label="Filled variant">
        This accordion uses the filled variant with a light gray background.
      </lt-accordion>

      <lt-accordion variant="outlined" label="Outlined variant">
        This accordion uses the outlined variant with a transparent background and border.
      </lt-accordion>
    </div>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-accordion label="Closed accordion">Content is hidden by default.</lt-accordion>

      <lt-accordion label="Open accordion" open>
        This accordion is open by default. Click the header to collapse it.
      </lt-accordion>

      <lt-accordion label="Disabled accordion" disabled>
        This accordion is disabled and cannot be toggled.
      </lt-accordion>
    </div>
  `
};

export const FAQ: Story = {
  render: () => html`
    <div style="max-width: 700px;">
      <h2 style="margin: 0 0 var(--lt-spacing-5) 0; color: var(--lt-color-neutral-900);">
        Frequently Asked Questions
      </h2>
      <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
        <lt-accordion label="What is Latty?" open>
          Latty is a framework-agnostic design system built on design tokens and Web Components. It follows a
          "tokens first, components second" philosophy where design tokens generate CSS variables, and components
          consume them.
        </lt-accordion>

        <lt-accordion label="How do I install Latty?">
          You can install Latty using npm or pnpm:
          <pre style="background: var(--lt-color-neutral-100); padding: var(--lt-spacing-3); border-radius: var(--lt-border-radius); margin-top: var(--lt-spacing-2); overflow-x: auto;">pnpm add @latty/web @latty/tokens</pre>
        </lt-accordion>

        <lt-accordion label="Is Latty accessible?">
          Yes! Latty components are built with accessibility in mind. We use semantic HTML, proper ARIA attributes,
          keyboard navigation, and follow WCAG guidelines. The accordion component uses native details/summary
          elements for built-in accessibility.
        </lt-accordion>

        <lt-accordion label="Can I use Latty with React?">
          Absolutely! Latty provides React wrappers for all Web Components in the @latty/react package. You can also
          use the Web Components directly in React with proper type definitions.
        </lt-accordion>

        <lt-accordion label="How do I customize the design tokens?">
          Design tokens are defined in tokens.config.json. You can customize colors, spacing, typography, and
          elevation. The build system generates CSS variables that all components consume automatically.
        </lt-accordion>
      </div>
    </div>
  `
};

export const WithRichContent: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-accordion variant="filled" label="Accordion with list">
        <h4 style="margin: 0 0 var(--lt-spacing-2) 0;">Features:</h4>
        <ul style="margin: 0; padding-left: var(--lt-spacing-5);">
          <li>Design tokens system</li>
          <li>Web Components</li>
          <li>Framework wrappers</li>
          <li>Accessibility built-in</li>
          <li>TypeScript support</li>
        </ul>
      </lt-accordion>

      <lt-accordion variant="default" label="Accordion with code">
        <p style="margin: 0 0 var(--lt-spacing-2) 0;">Here's how to use a button:</p>
        <pre
          style="background: var(--lt-color-neutral-900); color: var(--lt-color-neutral-50); padding: var(--lt-spacing-4); border-radius: var(--lt-border-radius); margin: 0; overflow-x: auto;"
        >&lt;lt-button variant="primary"&gt;
  Click me
&lt;/lt-button&gt;</pre>
      </lt-accordion>

      <lt-accordion variant="outlined" label="Accordion with image">
        <p style="margin: 0 0 var(--lt-spacing-3) 0;">This accordion contains an image:</p>
        <div
          style="width: 100%; height: 200px; background: linear-gradient(135deg, var(--lt-color-primary-500), var(--lt-color-secondary-500)); border-radius: var(--lt-border-radius);"
        ></div>
      </lt-accordion>
    </div>
  `
};

export const Nested: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <lt-accordion label="Parent accordion" variant="default" open>
        <p style="margin: 0 0 var(--lt-spacing-3) 0;">This is the parent accordion content.</p>

        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-2);">
          <lt-accordion label="Nested accordion 1" variant="filled">
            Content of the first nested accordion.
          </lt-accordion>

          <lt-accordion label="Nested accordion 2" variant="filled">
            Content of the second nested accordion.
          </lt-accordion>
        </div>
      </lt-accordion>
    </div>
  `
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-accordion label="Settings" icon="settings" variant="default">
        Configure your application settings and preferences.
      </lt-accordion>

      <lt-accordion label="User Profile" icon="user" variant="filled">
        View and edit your profile information.
      </lt-accordion>

      <lt-accordion label="Notifications" icon="bell" variant="outlined" open>
        Manage your notification preferences.
      </lt-accordion>

      <lt-accordion label="Security" icon="shield-check" variant="default">
        Update your security settings and password.
      </lt-accordion>

      <lt-accordion label="Help & Support" icon="help-circle" variant="filled">
        Find answers to common questions and contact support.
      </lt-accordion>
    </div>
  `
};

export const CustomSummary: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-accordion variant="default">
        <div slot="summary" style="display: flex; align-items: center; gap: var(--lt-spacing-2);">
          <span
            style="width: 8px; height: 8px; border-radius: 50%; background: var(--lt-color-success-500);"
          ></span>
          <span style="font-weight: 500;">Active Status</span>
        </div>
        This accordion uses a custom summary with a status indicator.
      </lt-accordion>

      <lt-accordion variant="filled">
        <div slot="summary" style="display: flex; align-items: center; gap: var(--lt-spacing-2);">
          <span style="font-size: 1.25rem;">🎨</span>
          <span style="font-weight: 500;">Custom Summary with Emoji</span>
        </div>
        You can add any content to the summary slot including emojis, icons, badges, etc.
      </lt-accordion>
    </div>
  `
};
