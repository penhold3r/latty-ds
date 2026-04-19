import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../button';

const meta: Meta = {
  title: 'Components/Button',
  component: 'lt-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'],
      description: 'The semantic variant of the button'
    },
    appearance: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'The visual appearance style'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button shows a loading state'
    },
    icon: {
      control: 'text',
      description: 'Icon name to display before the text'
    },
    iconEnd: {
      control: 'text',
      description: 'Icon name to display after the text'
    },
    label: {
      control: 'text',
      description: 'The button text content'
    }
  },
  args: {
    variant: 'primary',
    appearance: 'filled',
    size: 'md',
    disabled: false,
    loading: false,
    label: 'Button'
  }
};

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The button component supports multiple semantic variants for different use cases.'
      }
    }
  },
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button variant="primary">Primary</lt-button>
      <lt-button variant="secondary">Secondary</lt-button>
      <lt-button variant="neutral">Neutral</lt-button>
      <lt-button variant="success">Success</lt-button>
      <lt-button variant="warning">Warning</lt-button>
      <lt-button variant="error">Error</lt-button>
      <lt-button variant="info">Info</lt-button>
    </div>
  `
};

export const Outlined: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button appearance="outlined" variant="primary">Primary</lt-button>
      <lt-button appearance="outlined" variant="secondary">Secondary</lt-button>
      <lt-button appearance="outlined" variant="neutral">Neutral</lt-button>
      <lt-button appearance="outlined" variant="success">Success</lt-button>
      <lt-button appearance="outlined" variant="warning">Warning</lt-button>
      <lt-button appearance="outlined" variant="error">Error</lt-button>
      <lt-button appearance="outlined" variant="info">Info</lt-button>
    </div>
  `
};

export const Appearances: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be rendered with filled (default) or outlined appearance.'
      }
    }
  },
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button appearance="filled" variant="primary">Filled</lt-button>
      <lt-button appearance="outlined" variant="primary">Outlined</lt-button>
    </div>
  `
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three size options are available: small, medium (default), and large.'
      }
    }
  },
  render: () => html`
    <div style="display: flex; align-items: center; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button size="sm">Small</lt-button>
      <lt-button size="md">Medium</lt-button>
      <lt-button size="lg">Large</lt-button>
    </div>
  `
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap; align-items: center;">
      <lt-button icon="check">Save</lt-button>
      <lt-button icon="plus">Add</lt-button>
      <lt-button icon="trash" variant="error">Delete</lt-button>
      <lt-button appearance="outlined" icon="download">Download</lt-button>
      <lt-button appearance="outlined" icon-end="arrow-right">Next</lt-button>
      <lt-button appearance="outlined" icon="arrow-left" icon-end="arrow-right">Both</lt-button>
    </div>
  `
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The loading state displays a spinner and disables interaction.'
      }
    }
  },
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button loading>Loading</lt-button>
      <lt-button variant="secondary" loading>Processing</lt-button>
      <lt-button appearance="outlined" loading>Saving</lt-button>
      <lt-button variant="success" loading>Submit</lt-button>
    </div>
  `
};

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); flex-wrap: wrap;">
      <lt-button disabled>Disabled</lt-button>
      <lt-button variant="secondary" disabled>Disabled</lt-button>
      <lt-button appearance="outlined" disabled>Disabled</lt-button>
      <lt-button variant="success" disabled>Disabled</lt-button>
    </div>
  `
};
