import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './switch';

const meta: Meta = {
  title: 'Components/Switch',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'info'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' }
  },
  args: {
    variant: 'primary',
    size: 'md',
    checked: false,
    disabled: false,
    required: false,
    label: 'Switch label'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-switch
      variant=${args.variant}
      size=${args.size}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      label=${args.label}
    ></lt-switch>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-switch variant="primary" label="Primary" checked></lt-switch>
      <lt-switch variant="secondary" label="Secondary" checked></lt-switch>
      <lt-switch variant="success" label="Success" checked></lt-switch>
      <lt-switch variant="error" label="Error" checked></lt-switch>
      <lt-switch variant="info" label="Info" checked></lt-switch>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-switch size="sm" label="Small switch" checked></lt-switch>
      <lt-switch size="md" label="Medium switch (default)" checked></lt-switch>
      <lt-switch size="lg" label="Large switch" checked></lt-switch>
    </div>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-switch label="Unchecked (off)"></lt-switch>
      <lt-switch label="Checked (on)" checked></lt-switch>
      <lt-switch label="Disabled" disabled></lt-switch>
      <lt-switch label="Disabled + Checked" disabled checked></lt-switch>
      <lt-switch label="Required" required></lt-switch>
    </div>
  `
};

export const WithoutLabels: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-switch></lt-switch>
      <lt-switch checked></lt-switch>
      <lt-switch variant="success" checked></lt-switch>
      <lt-switch variant="error" checked></lt-switch>
    </div>
  `
};

export const Settings: Story = {
  render: () => html`
    <lt-surface elevation="2" style="max-width: 400px;">
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-5) 0; color: var(--lt-color-neutral-900);">
          Notification Settings
        </h3>
        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--lt-color-neutral-900);">Email notifications</div>
              <div style="font-size: 0.875rem; color: var(--lt-color-neutral-600); margin-top: var(--lt-spacing-1);">
                Receive notifications via email
              </div>
            </div>
            <lt-switch name="email" checked></lt-switch>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--lt-color-neutral-900);">Push notifications</div>
              <div style="font-size: 0.875rem; color: var(--lt-color-neutral-600); margin-top: var(--lt-spacing-1);">
                Receive push notifications on your device
              </div>
            </div>
            <lt-switch name="push"></lt-switch>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--lt-color-neutral-900);">SMS notifications</div>
              <div style="font-size: 0.875rem; color: var(--lt-color-neutral-600); margin-top: var(--lt-spacing-1);">
                Receive notifications via SMS
              </div>
            </div>
            <lt-switch name="sms"></lt-switch>
          </div>

          <hr style="border: none; border-top: 1px solid var(--lt-color-neutral-200); margin: var(--lt-spacing-2) 0;" />

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--lt-color-neutral-900);">Dark mode</div>
              <div style="font-size: 0.875rem; color: var(--lt-color-neutral-600); margin-top: var(--lt-spacing-1);">
                Use dark theme across the application
              </div>
            </div>
            <lt-switch variant="info" name="dark-mode" checked></lt-switch>
          </div>
        </div>
      </div>
    </lt-surface>
  `
};

export const FormExample: Story = {
  render: () => html`
    <lt-surface elevation="2" style="max-width: 450px;">
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-5) 0; color: var(--lt-color-neutral-900);">
          Privacy Preferences
        </h3>
        <form style="display: flex; flex-direction: column; gap: var(--lt-spacing-5);">
          <lt-switch
            label="Allow cookies"
            name="cookies"
            checked
          ></lt-switch>

          <lt-switch
            label="Share analytics data"
            name="analytics"
          ></lt-switch>

          <lt-switch
            variant="success"
            label="Enable two-factor authentication"
            name="2fa"
            checked
          ></lt-switch>

          <lt-switch
            variant="error"
            label="Allow third-party tracking"
            name="tracking"
          ></lt-switch>

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

export const Interactive: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
          Click the switches to toggle them
        </h4>
        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
          <lt-switch label="Airplane Mode"></lt-switch>
          <lt-switch label="Wi-Fi" checked></lt-switch>
          <lt-switch label="Bluetooth"></lt-switch>
          <lt-switch variant="success" label="Do Not Disturb"></lt-switch>
        </div>
      </div>
    </div>
  `
};
