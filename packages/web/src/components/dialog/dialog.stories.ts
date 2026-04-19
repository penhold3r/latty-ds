import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './dialog';
import '../button';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'lt-dialog',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
      description: 'The size of the dialog',
    },
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    title: {
      control: 'text',
      description: 'Dialog title displayed in the header',
    },
    hideCloseButton: {
      control: 'boolean',
      description: 'Whether to hide the close button',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Whether clicking the backdrop closes the dialog',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing Escape closes the dialog',
    },
  },
  args: {
    size: 'md',
    open: true,
    title: 'Dialog Title',
    hideCloseButton: false,
    closeOnBackdropClick: true,
    closeOnEscape: true,
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic dialog with title and content.',
      },
    },
  },
  render: (args) => html`
    <lt-button @click=${(e: Event) => {
      const dialog = (e.target as HTMLElement).nextElementSibling as any;
      dialog?.show();
    }}>
      Open Dialog
    </lt-button>
    <lt-dialog
      size=${args.size}
      title=${args.title}
      ?hide-close-button=${args.hideCloseButton}
      ?close-on-backdrop-click=${args.closeOnBackdropClick}
      ?close-on-escape=${args.closeOnEscape}
    >
      <p>This is a basic dialog with some content. You can close it by clicking the X button, clicking outside, or pressing Escape.</p>
    </lt-dialog>
  `,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialogs come in multiple sizes: sm, md (default), lg, xl, and fullscreen.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-3); flex-wrap: wrap;">
      <lt-button @click=${(e: Event) => {
        const dialog = document.getElementById('dialog-sm') as any;
        dialog?.show();
      }}>
        Small
      </lt-button>
      <lt-button @click=${(e: Event) => {
        const dialog = document.getElementById('dialog-md') as any;
        dialog?.show();
      }}>
        Medium
      </lt-button>
      <lt-button @click=${(e: Event) => {
        const dialog = document.getElementById('dialog-lg') as any;
        dialog?.show();
      }}>
        Large
      </lt-button>
      <lt-button @click=${(e: Event) => {
        const dialog = document.getElementById('dialog-xl') as any;
        dialog?.show();
      }}>
        Extra Large
      </lt-button>
      <lt-button @click=${(e: Event) => {
        const dialog = document.getElementById('dialog-fullscreen') as any;
        dialog?.show();
      }}>
        Fullscreen
      </lt-button>
    </div>

    <lt-dialog id="dialog-sm" size="sm" title="Small Dialog">
      <p>This is a small dialog (400px max width).</p>
    </lt-dialog>

    <lt-dialog id="dialog-md" size="md" title="Medium Dialog">
      <p>This is a medium dialog (600px max width).</p>
    </lt-dialog>

    <lt-dialog id="dialog-lg" size="lg" title="Large Dialog">
      <p>This is a large dialog (800px max width).</p>
    </lt-dialog>

    <lt-dialog id="dialog-xl" size="xl" title="Extra Large Dialog">
      <p>This is an extra large dialog (1000px max width).</p>
    </lt-dialog>

    <lt-dialog id="dialog-fullscreen" size="fullscreen" title="Fullscreen Dialog">
      <p>This is a fullscreen dialog that covers the entire viewport.</p>
    </lt-dialog>
  `,
};

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialog with a footer for action buttons.',
      },
    },
  },
  render: () => html`
    <lt-button @click=${(e: Event) => {
      const dialog = document.getElementById('dialog-footer') as any;
      dialog?.show();
    }}>
      Open Dialog
    </lt-button>

    <lt-dialog id="dialog-footer" title="Confirm Action">
      <p>Are you sure you want to proceed with this action?</p>
      <div slot="footer">
        <lt-button
          variant="neutral"
          appearance="outlined"
          @click=${() => {
            const dialog = document.getElementById('dialog-footer') as any;
            dialog?.hide();
          }}
        >
          Cancel
        </lt-button>
        <lt-button
          variant="primary"
          @click=${() => {
            const dialog = document.getElementById('dialog-footer') as any;
            dialog?.hide();
          }}
        >
          Confirm
        </lt-button>
      </div>
    </lt-dialog>
  `,
};

export const CustomHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialog with custom header content using the header slot.',
      },
    },
  },
  render: () => html`
    <lt-button @click=${(e: Event) => {
      const dialog = document.getElementById('dialog-custom-header') as any;
      dialog?.show();
    }}>
      Open Dialog
    </lt-button>

    <lt-dialog id="dialog-custom-header">
      <div slot="header" style="display: flex; align-items: center; gap: var(--lt-spacing-3);">
        <lt-icon name="bell" style="color: var(--lt-color-primary-500); font-size: 1.5rem;"></lt-icon>
        <div>
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Custom Header</h2>
          <p style="margin: 0; font-size: 0.875rem; color: var(--lt-color-neutral-600);">With subtitle and icon</p>
        </div>
      </div>
      <p>This dialog has a custom header with an icon and subtitle.</p>
    </lt-dialog>
  `,
};

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialog with long scrollable content.',
      },
    },
  },
  render: () => html`
    <lt-button @click=${(e: Event) => {
      const dialog = document.getElementById('dialog-scrollable') as any;
      dialog?.show();
    }}>
      Open Dialog
    </lt-button>

    <lt-dialog id="dialog-scrollable" title="Terms and Conditions">
      <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
      <div slot="footer">
        <lt-button
          variant="neutral"
          appearance="outlined"
          @click=${() => {
            const dialog = document.getElementById('dialog-scrollable') as any;
            dialog?.hide();
          }}
        >
          Decline
        </lt-button>
        <lt-button
          variant="primary"
          @click=${() => {
            const dialog = document.getElementById('dialog-scrollable') as any;
            dialog?.hide();
          }}
        >
          Accept
        </lt-button>
      </div>
    </lt-dialog>
  `,
};

export const NoCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialog without a close button. Must be closed programmatically or via footer actions.',
      },
    },
  },
  render: () => html`
    <lt-button @click=${(e: Event) => {
      const dialog = document.getElementById('dialog-no-close') as any;
      dialog?.show();
    }}>
      Open Dialog
    </lt-button>

    <lt-dialog
      id="dialog-no-close"
      title="Important Notice"
      hide-close-button
      ?close-on-backdrop-click=${false}
      ?close-on-escape=${false}
    >
      <p>This dialog has no close button and cannot be dismissed by clicking outside or pressing Escape.</p>
      <div slot="footer">
        <lt-button
          variant="primary"
          @click=${() => {
            const dialog = document.getElementById('dialog-no-close') as any;
            dialog?.hide();
          }}
        >
          Acknowledge
        </lt-button>
      </div>
    </lt-dialog>
  `,
};

export const FormDialog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Dialog containing a form.',
      },
    },
  },
  render: () => html`
    <lt-button @click=${(e: Event) => {
      const dialog = document.getElementById('dialog-form') as any;
      dialog?.show();
    }}>
      Open Form
    </lt-button>

    <lt-dialog id="dialog-form" title="Contact Form">
      <form style="display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
        <lt-textfield label="Name" required></lt-textfield>
        <lt-textfield label="Email" type="email" required></lt-textfield>
        <lt-textfield label="Message" multiline rows="4"></lt-textfield>
      </form>
      <div slot="footer">
        <lt-button
          variant="neutral"
          appearance="outlined"
          @click=${() => {
            const dialog = document.getElementById('dialog-form') as any;
            dialog?.hide();
          }}
        >
          Cancel
        </lt-button>
        <lt-button
          variant="primary"
          @click=${() => {
            const dialog = document.getElementById('dialog-form') as any;
            dialog?.hide();
          }}
        >
          Submit
        </lt-button>
      </div>
    </lt-dialog>
  `,
};
