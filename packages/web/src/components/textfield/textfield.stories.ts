import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './textfield';

/**
 * Storybook configuration for the Textfield component.
 *
 * Demonstrates all variants, sizes, states, input types, and icon configurations.
 */
const meta: Meta = {
  title: 'Components/Textfield',
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'url', 'number', 'multiline'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    value: { control: 'text' },
    rows: { control: 'number' }
  },
  args: {
    variant: 'default',
    size: 'md',
    type: 'text',
    disabled: false,
    required: false,
    readonly: false,
    label: 'Label',
    placeholder: 'Enter text...',
    helperText: '',
    value: ''
  }
};

export default meta;
type Story = StoryObj;

/**
 * Interactive playground for experimenting with all textfield properties.
 * Use Storybook controls to adjust variant, size, type, and other attributes.
 */
export const Playground: Story = {
  render: (args) => html`
    <lt-textfield
      variant=${args.variant}
      size=${args.size}
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      value=${args.value}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?readonly=${args.readonly}
    ></lt-textfield>
  `
};

/**
 * Demonstrates the three available sizes: small (sm), medium (md), and large (lg).
 */
export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 400px;">
      <lt-textfield size="sm" label="Small" placeholder="Small textfield"></lt-textfield>
      <lt-textfield size="md" label="Medium" placeholder="Medium textfield"></lt-textfield>
      <lt-textfield size="lg" label="Large" placeholder="Large textfield"></lt-textfield>
    </div>
  `
};

/**
 * Demonstrates all four variants with their automatic end icons:
 * - default: No end icon
 * - success: Green styling with check-circle icon
 * - warning: Yellow styling with warning-triangle icon
 * - error: Red styling with xmark-circle icon
 */
export const Variants: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 400px;">
      <lt-textfield variant="default" label="Default" placeholder="Default state"></lt-textfield>
      <lt-textfield
        variant="success"
        label="Success"
        placeholder="Success state"
        helper-text="This is a success message"
      ></lt-textfield>
      <lt-textfield
        variant="warning"
        label="Warning"
        placeholder="Warning state"
        helper-text="This is a warning message"
      ></lt-textfield>
      <lt-textfield
        variant="error"
        label="Error"
        placeholder="Error state"
        helper-text="This is an error message"
      ></lt-textfield>
    </div>
  `
};

/**
 * Demonstrates different input states:
 * - Normal (enabled)
 * - Disabled
 * - Readonly
 * - Required (shows asterisk in label)
 */
export const States: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 400px;">
      <lt-textfield label="Default" placeholder="Normal state"></lt-textfield>
      <lt-textfield label="Disabled" placeholder="Disabled state" disabled></lt-textfield>
      <lt-textfield label="Readonly" placeholder="Readonly state" value="Read only value" readonly></lt-textfield>
      <lt-textfield label="Required" placeholder="Required field" required></lt-textfield>
    </div>
  `
};

/**
 * Demonstrates all supported HTML input types:
 * - text
 * - email
 * - password (includes automatic visibility toggle)
 * - tel
 * - url
 * - number
 * - multiline (renders as textarea)
 */
export const Types: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 400px;">
      <lt-textfield type="text" label="Text" placeholder="Enter text"></lt-textfield>
      <lt-textfield type="email" label="Email" placeholder="Enter email"></lt-textfield>
      <lt-textfield type="password" label="Password" placeholder="Enter password"></lt-textfield>
      <lt-textfield type="tel" label="Phone" placeholder="Enter phone number"></lt-textfield>
      <lt-textfield type="url" label="URL" placeholder="Enter URL"></lt-textfield>
      <lt-textfield type="number" label="Number" placeholder="Enter number"></lt-textfield>
      <lt-textfield type="multiline" label="Multiline" placeholder="Enter multiple lines" rows="4"></lt-textfield>
    </div>
  `
};

/**
 * Demonstrates icon usage:
 * - Custom start icons (icon-start attribute)
 * - Automatic password visibility toggle (password type)
 * - Automatic variant end icons (variant attribute)
 *
 * Note: End icons are automatically managed and not customizable.
 */
export const WithIcons: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 400px;">
      <lt-textfield label="Search" placeholder="Search..." icon-start="search"></lt-textfield>
      <lt-textfield label="Email" placeholder="Enter email" icon-start="user" type="email"></lt-textfield>
      <lt-textfield label="Password" placeholder="Enter password" type="password" value="secretpassword"></lt-textfield>
      <lt-textfield
        label="Success with Icon"
        placeholder="Valid input"
        icon-start="edit"
        variant="success"
        value="Valid value"
      ></lt-textfield>
    </div>
  `
};

/**
 * Demonstrates the multiline type (textarea) with various configurations:
 * - Default rows (3)
 * - Custom rows count
 * - Different sizes
 * - With variants and helper text
 * - Resizable vertically
 */
export const Multiline: Story = {
  render: () => html`
    <div style="display:flex; flex-direction: column; gap: var(--lt-spacing-4); max-width: 600px;">
      <lt-textfield
        type="multiline"
        label="Comments"
        placeholder="Enter your comments..."
        rows="3"
      ></lt-textfield>
      <lt-textfield
        type="multiline"
        label="Description"
        placeholder="Enter a detailed description..."
        rows="5"
        helper-text="Provide as much detail as possible"
      ></lt-textfield>
      <lt-textfield
        type="multiline"
        size="sm"
        label="Small Textarea"
        placeholder="Small multiline input"
        rows="3"
      ></lt-textfield>
      <lt-textfield
        type="multiline"
        size="lg"
        label="Large Textarea"
        placeholder="Large multiline input"
        rows="4"
      ></lt-textfield>
      <lt-textfield
        type="multiline"
        variant="error"
        label="Feedback"
        placeholder="Enter your feedback..."
        rows="4"
        helper-text="This field is required"
        required
      ></lt-textfield>
    </div>
  `
};
