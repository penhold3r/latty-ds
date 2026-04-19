import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './select';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' }
];

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'mango', label: 'Mango' },
  { value: 'strawberry', label: 'Strawberry' }
];

const meta: Meta = {
  title: 'Components/Select',
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' }
  },
  args: {
    variant: 'default',
    size: 'md',
    disabled: false,
    required: false,
    label: 'Select a country',
    placeholder: 'Choose one',
    helperText: ''
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-select
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?required=${args.required}
      label=${args.label}
      placeholder=${args.placeholder}
      helper-text=${args.helperText}
      .options=${countries}
    ></lt-select>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-select variant="default" label="Default" .options=${fruits}></lt-select>
      <lt-select variant="success" label="Success" helper-text="Selection successful" .options=${fruits}></lt-select>
      <lt-select variant="warning" label="Warning" helper-text="Please review your selection" .options=${fruits}></lt-select>
      <lt-select variant="error" label="Error" helper-text="Invalid selection" .options=${fruits}></lt-select>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-select size="sm" label="Small" .options=${fruits}></lt-select>
      <lt-select size="md" label="Medium (default)" .options=${fruits}></lt-select>
      <lt-select size="lg" label="Large" .options=${fruits}></lt-select>
    </div>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-select label="Normal" .options=${fruits}></lt-select>
      <lt-select label="Required" required .options=${fruits}></lt-select>
      <lt-select label="Disabled" disabled .options=${fruits}></lt-select>
      <lt-select label="With disabled option" .options=${fruits}></lt-select>
    </div>
  `
};

export const WithHelperText: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-select
        label="Country"
        helper-text="Select your country of residence"
        .options=${countries}
      ></lt-select>
      <lt-select
        variant="error"
        label="Required field"
        helper-text="This field is required"
        required
        .options=${countries}
      ></lt-select>
    </div>
  `
};

export const LongList: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <lt-select label="Country" placeholder="Select a country" .options=${countries}></lt-select>
    </div>
  `
};
