import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './radio';

const meta: Meta = {
  title: 'Components/Radio',
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
    label: 'Radio label'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-radio
      variant=${args.variant}
      size=${args.size}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      label=${args.label}
      name="playground"
      value="option"
    ></lt-radio>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-radio variant="primary" name="variant" value="primary" label="Primary" checked></lt-radio>
      <lt-radio variant="secondary" name="variant" value="secondary" label="Secondary"></lt-radio>
      <lt-radio variant="success" name="variant" value="success" label="Success"></lt-radio>
      <lt-radio variant="error" name="variant" value="error" label="Error"></lt-radio>
      <lt-radio variant="info" name="variant" value="info" label="Info"></lt-radio>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-radio size="sm" name="size" value="sm" label="Small radio" checked></lt-radio>
      <lt-radio size="md" name="size" value="md" label="Medium radio (default)"></lt-radio>
      <lt-radio size="lg" name="size" value="lg" label="Large radio"></lt-radio>
    </div>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
      <lt-radio name="state1" value="unchecked" label="Unchecked"></lt-radio>
      <lt-radio name="state2" value="checked" label="Checked" checked></lt-radio>
      <lt-radio name="state3" value="disabled" label="Disabled" disabled></lt-radio>
      <lt-radio name="state4" value="disabled-checked" label="Disabled + Checked" disabled checked></lt-radio>
      <lt-radio name="state5" value="required" label="Required" required></lt-radio>
    </div>
  `
};

export const RadioGroups: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6);">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
          Choose your plan
        </h4>
        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
          <lt-radio name="plan" value="free" label="Free - $0/month"></lt-radio>
          <lt-radio name="plan" value="pro" label="Pro - $9/month" checked></lt-radio>
          <lt-radio name="plan" value="enterprise" label="Enterprise - $29/month"></lt-radio>
        </div>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
          Shipping method
        </h4>
        <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
          <lt-radio name="shipping" value="standard" label="Standard shipping (5-7 days)" checked></lt-radio>
          <lt-radio name="shipping" value="express" label="Express shipping (2-3 days)"></lt-radio>
          <lt-radio name="shipping" value="overnight" label="Overnight shipping"></lt-radio>
        </div>
      </div>
    </div>
  `
};

export const WithoutLabels: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-radio name="no-label" value="1"></lt-radio>
      <lt-radio name="no-label" value="2" checked></lt-radio>
      <lt-radio variant="success" name="no-label" value="3"></lt-radio>
      <lt-radio variant="error" name="no-label" value="4"></lt-radio>
    </div>
  `
};

export const FormExample: Story = {
  render: () => html`
    <lt-surface elevation="2" style="max-width: 400px;">
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-4) 0; color: var(--lt-color-neutral-900);">
          Account Type
        </h3>
        <form style="display: flex; flex-direction: column; gap: var(--lt-spacing-5);">
          <div>
            <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
              <lt-radio name="account-type" value="personal" label="Personal Account" checked></lt-radio>
              <div style="padding-left: var(--lt-spacing-6); color: var(--lt-color-neutral-600); font-size: 0.875rem;">
                For individual use and personal projects
              </div>
            </div>
          </div>

          <div>
            <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
              <lt-radio name="account-type" value="business" label="Business Account"></lt-radio>
              <div style="padding-left: var(--lt-spacing-6); color: var(--lt-color-neutral-600); font-size: 0.875rem;">
                For teams and organizations
              </div>
            </div>
          </div>

          <div>
            <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-3);">
              <lt-radio name="account-type" value="enterprise" label="Enterprise Account"></lt-radio>
              <div style="padding-left: var(--lt-spacing-6); color: var(--lt-color-neutral-600); font-size: 0.875rem;">
                Custom solutions for large organizations
              </div>
            </div>
          </div>

          <div style="display: flex; gap: var(--lt-spacing-3); margin-top: var(--lt-spacing-2);">
            <button
              type="submit"
              style="flex: 1; padding: var(--lt-spacing-3) var(--lt-spacing-4); background: var(--lt-color-primary-500); color: white; border: none; border-radius: var(--lt-border-radius); cursor: pointer; font-family: inherit;"
            >
              Continue
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
