import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './checkbox';

const meta: Meta = {
  title: 'Components/Checkbox',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'info'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' }
  },
  args: {
    variant: 'primary',
    size: 'md',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    label: 'Checkbox label'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-checkbox
      variant=${args.variant}
      size=${args.size}
      ?checked=${args.checked}
      ?indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?required=${args.required}
      label=${args.label}
    ></lt-checkbox>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-checkbox variant="primary" label="Primary" checked></lt-checkbox>
      <lt-checkbox variant="secondary" label="Secondary" checked></lt-checkbox>
      <lt-checkbox variant="success" label="Success" checked></lt-checkbox>
      <lt-checkbox variant="error" label="Error" checked></lt-checkbox>
      <lt-checkbox variant="info" label="Info" checked></lt-checkbox>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-checkbox size="sm" label="Small checkbox" checked></lt-checkbox>
      <lt-checkbox size="md" label="Medium checkbox (default)" checked></lt-checkbox>
      <lt-checkbox size="lg" label="Large checkbox" checked></lt-checkbox>
    </div>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-checkbox label="Unchecked"></lt-checkbox>
      <lt-checkbox label="Checked" checked></lt-checkbox>
      <lt-checkbox label="Indeterminate" indeterminate></lt-checkbox>
      <lt-checkbox label="Disabled" disabled></lt-checkbox>
      <lt-checkbox label="Disabled + Checked" disabled checked></lt-checkbox>
      <lt-checkbox label="Required" required></lt-checkbox>
    </div>
  `
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
          Indeterminate state example (e.g., "Select all" when some items are selected)
        </h4>
        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
          <lt-checkbox label="Select all" indeterminate></lt-checkbox>
          <div style="padding-left: var(--lt-spacing-6); display: flex; flex-direction: column; gap: var(--lt-spacing-2);">
            <lt-checkbox label="Option 1" checked></lt-checkbox>
            <lt-checkbox label="Option 2"></lt-checkbox>
            <lt-checkbox label="Option 3" checked></lt-checkbox>
          </div>
        </div>
      </div>
    </div>
  `
};

export const WithoutLabels: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-checkbox></lt-checkbox>
      <lt-checkbox checked></lt-checkbox>
      <lt-checkbox indeterminate></lt-checkbox>
      <lt-checkbox variant="success" checked></lt-checkbox>
      <lt-checkbox variant="error" checked></lt-checkbox>
    </div>
  `
};

export const FormExample: Story = {
  render: () => html`
    <lt-surface elevation="2" style="max-width: 400px;">
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-4) 0; color: var(--lt-color-neutral-900);">
          Preferences
        </h3>
        <form style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
          <lt-checkbox label="Enable email notifications" name="email" checked></lt-checkbox>
          <lt-checkbox label="Enable push notifications" name="push"></lt-checkbox>
          <lt-checkbox label="Enable SMS notifications" name="sms"></lt-checkbox>
          <lt-checkbox
            variant="success"
            label="I agree to the terms and conditions"
            name="terms"
            required
          ></lt-checkbox>
          <div style="display: flex; gap: var(--lt-spacing-3); margin-top: var(--lt-spacing-2);">
            <button
              type="submit"
              style="flex: 1; padding: var(--lt-spacing-3) var(--lt-spacing-4); background: var(--lt-color-primary-500); color: white; border: none; border-radius: var(--lt-border-radius); cursor: pointer; font-family: inherit;"
            >
              Save Preferences
            </button>
            <button
              type="button"
              style="flex: 1; padding: var(--lt-spacing-3) var(--lt-spacing-4); background: transparent; border: 1px solid var(--lt-color-neutral-300); border-radius: var(--lt-border-radius); cursor: pointer; font-family: inherit;"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </lt-surface>
  `
};
