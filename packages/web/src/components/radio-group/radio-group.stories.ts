import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './radio-group';
import '../radio/radio';

const meta: Meta = {
  title: 'Components/RadioGroup',
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    required: { control: 'boolean' }
  },
  args: {
    label: 'Choose an option',
    name: 'example',
    orientation: 'vertical',
    helperText: '',
    error: false,
    required: false
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-radio-group
      label=${args.label}
      name=${args.name}
      orientation=${args.orientation}
      helper-text=${args.helperText}
      ?error=${args.error}
      ?required=${args.required}
    >
      <lt-radio value="option1" label="Option 1"></lt-radio>
      <lt-radio value="option2" label="Option 2" checked></lt-radio>
      <lt-radio value="option3" label="Option 3"></lt-radio>
    </lt-radio-group>
  `
};

export const Vertical: Story = {
  render: () => html`
    <lt-radio-group label="Choose your plan" name="plan" orientation="vertical">
      <lt-radio value="free" label="Free - $0/month"></lt-radio>
      <lt-radio value="pro" label="Pro - $9/month" checked></lt-radio>
      <lt-radio value="enterprise" label="Enterprise - $29/month"></lt-radio>
    </lt-radio-group>
  `
};

export const Horizontal: Story = {
  render: () => html`
    <lt-radio-group label="Select size" name="size" orientation="horizontal">
      <lt-radio value="sm" label="Small"></lt-radio>
      <lt-radio value="md" label="Medium" checked></lt-radio>
      <lt-radio value="lg" label="Large"></lt-radio>
      <lt-radio value="xl" label="X-Large"></lt-radio>
    </lt-radio-group>
  `
};

export const WithHelperText: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-radio-group
        label="Shipping method"
        name="shipping"
        helper-text="Choose your preferred shipping method"
      >
        <lt-radio value="standard" label="Standard (5-7 days)" checked></lt-radio>
        <lt-radio value="express" label="Express (2-3 days)"></lt-radio>
        <lt-radio value="overnight" label="Overnight"></lt-radio>
      </lt-radio-group>

      <lt-radio-group
        label="Payment method"
        name="payment"
        helper-text="Select how you'd like to pay"
        error
      >
        <lt-radio value="card" label="Credit Card"></lt-radio>
        <lt-radio value="paypal" label="PayPal"></lt-radio>
        <lt-radio value="crypto" label="Cryptocurrency"></lt-radio>
      </lt-radio-group>
    </div>
  `
};

export const Required: Story = {
  render: () => html`
    <lt-radio-group
      label="Terms and Conditions"
      name="terms"
      helper-text="Please select one to continue"
      required
    >
      <lt-radio value="accept" label="I accept the terms"></lt-radio>
      <lt-radio value="decline" label="I decline the terms"></lt-radio>
    </lt-radio-group>
  `
};

export const WithVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-radio-group label="Priority Level" name="priority1">
        <lt-radio variant="success" value="low" label="Low Priority"></lt-radio>
        <lt-radio variant="primary" value="medium" label="Medium Priority" checked></lt-radio>
        <lt-radio variant="error" value="high" label="High Priority"></lt-radio>
      </lt-radio-group>

      <lt-radio-group label="Status" name="status" orientation="horizontal">
        <lt-radio variant="success" value="active" label="Active" checked></lt-radio>
        <lt-radio variant="error" value="inactive" label="Inactive"></lt-radio>
        <lt-radio variant="info" value="pending" label="Pending"></lt-radio>
      </lt-radio-group>
    </div>
  `
};

export const WithSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6); max-width: 400px;">
      <lt-radio-group label="Small Size" name="size1">
        <lt-radio size="sm" value="option1" label="Option 1" checked></lt-radio>
        <lt-radio size="sm" value="option2" label="Option 2"></lt-radio>
        <lt-radio size="sm" value="option3" label="Option 3"></lt-radio>
      </lt-radio-group>

      <lt-radio-group label="Large Size" name="size2">
        <lt-radio size="lg" value="option1" label="Option 1"></lt-radio>
        <lt-radio size="lg" value="option2" label="Option 2" checked></lt-radio>
        <lt-radio size="lg" value="option3" label="Option 3"></lt-radio>
      </lt-radio-group>
    </div>
  `
};

export const FormExample: Story = {
  render: () => html`
    <lt-surface elevation="2" style="max-width: 500px;">
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-5) 0; color: var(--lt-color-neutral-900);">
          User Registration
        </h3>
        <form style="display: flex; flex-direction: column; gap: var(--lt-spacing-5);">
          <lt-radio-group
            label="Account Type"
            name="account-type"
            helper-text="Choose the type of account you want to create"
            required
          >
            <lt-radio value="personal" label="Personal Account" checked></lt-radio>
            <lt-radio value="business" label="Business Account"></lt-radio>
          </lt-radio-group>

          <lt-radio-group
            label="Subscription Plan"
            name="plan"
            helper-text="Select your preferred plan"
            required
          >
            <lt-radio value="free" label="Free - $0/month"></lt-radio>
            <lt-radio value="pro" label="Pro - $9/month" checked></lt-radio>
            <lt-radio value="enterprise" label="Enterprise - $29/month"></lt-radio>
          </lt-radio-group>

          <lt-radio-group
            label="Newsletter Frequency"
            name="newsletter"
            orientation="horizontal"
            helper-text="How often would you like to receive updates?"
          >
            <lt-radio value="daily" label="Daily"></lt-radio>
            <lt-radio value="weekly" label="Weekly" checked></lt-radio>
            <lt-radio value="monthly" label="Monthly"></lt-radio>
            <lt-radio value="never" label="Never"></lt-radio>
          </lt-radio-group>

          <div style="display: flex; gap: var(--lt-spacing-3); margin-top: var(--lt-spacing-2);">
            <button
              type="submit"
              style="flex: 1; padding: var(--lt-spacing-3) var(--lt-spacing-4); background: var(--lt-color-primary-500); color: white; border: none; border-radius: var(--lt-border-radius); cursor: pointer; font-family: inherit;"
            >
              Register
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
