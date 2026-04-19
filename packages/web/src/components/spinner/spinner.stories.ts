import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './spinner';

const meta: Meta = {
  title: 'Components/Spinner',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'neutral', 'current'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  },
  args: { variant: 'primary', size: 'md' }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html` <lt-spinner variant=${args.variant} size=${args.size}> ${args.label} </lt-spinner> `
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-spinner variant="primary">Primary</lt-spinner>
      <lt-spinner variant="secondary">Secondary</lt-spinner>
      <lt-spinner variant="neutral">Neutral</lt-spinner>
      <lt-spinner variant="success">Success</lt-spinner>
      <lt-spinner variant="warning">Warning</lt-spinner>
      <lt-spinner variant="error">Error</lt-spinner>
      <lt-spinner variant="info">Info</lt-spinner>
    </div>
  `
};
