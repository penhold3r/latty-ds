import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './surface';

const meta: Meta = {
  title: 'Components/Surface',
  argTypes: {
    elevation: { control: 'select', options: ['0', '1', '2', '3', '4', '5'] },
    variant: { control: 'select', options: ['filled', 'outlined'] }
  },
  args: {
    elevation: '1',
    variant: 'filled'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-surface elevation=${args.elevation} variant=${args.variant}>
      <div style="padding: var(--lt-spacing-6);">
        <h3 style="margin: 0 0 var(--lt-spacing-2) 0; color: var(--lt-color-neutral-900);">Surface Component</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-600);">
          This is a surface component with elevation="${args.elevation}" and variant="${args.variant}".
        </p>
      </div>
    </lt-surface>
  `
};

export const Elevations: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--lt-spacing-8);">
      ${['0', '1', '2', '3', '4', '5'].map(
        (elevation) => html`
          <lt-surface elevation=${elevation}>
            <div style="padding: var(--lt-spacing-6);">
              <h4 style="margin: 0 0 var(--lt-spacing-2) 0; color: var(--lt-color-neutral-900);">
                Elevation ${elevation}
              </h4>
              <p style="margin: 0; color: var(--lt-color-neutral-600); font-size: 0.875rem;">
                ${elevation === '0' ? 'No shadow (flat)' : ''}
                ${elevation === '1' ? 'Minimal shadow' : ''}
                ${elevation === '2' ? 'Medium shadow' : ''}
                ${elevation === '3' ? 'High shadow' : ''}
                ${elevation === '4' ? 'Very high shadow' : ''}
                ${elevation === '5' ? 'Maximum shadow' : ''}
              </p>
            </div>
          </lt-surface>
        `
      )}
    </div>
  `
};

export const Variants: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--lt-spacing-8);">
      <lt-surface variant="filled" elevation="2">
        <div style="padding: var(--lt-spacing-6);">
          <h4 style="margin: 0 0 var(--lt-spacing-2) 0; color: var(--lt-color-neutral-900);">Filled Variant</h4>
          <p style="margin: 0; color: var(--lt-color-neutral-600); font-size: 0.875rem;">
            Solid background with shadow. Great for cards and containers.
          </p>
        </div>
      </lt-surface>

      <lt-surface variant="outlined" elevation="0">
        <div style="padding: var(--lt-spacing-6);">
          <h4 style="margin: 0 0 var(--lt-spacing-2) 0; color: var(--lt-color-neutral-900);">Outlined Variant</h4>
          <p style="margin: 0; color: var(--lt-color-neutral-600); font-size: 0.875rem;">
            Transparent background with border. Perfect for subtle containers.
          </p>
        </div>
      </lt-surface>
    </div>
  `
};

export const UseCases: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-8); max-width: 800px;">
      <!-- Card example -->
      <lt-surface elevation="2">
        <div style="padding: var(--lt-spacing-6);">
          <h3 style="margin: 0 0 var(--lt-spacing-4) 0; color: var(--lt-color-neutral-900);">User Profile Card</h3>
          <div style="display: flex; gap: var(--lt-spacing-4); align-items: center; margin-bottom: var(--lt-spacing-4);">
            <div
              style="width: 60px; height: 60px; border-radius: 50%; background: var(--lt-color-primary-200);"
            ></div>
            <div>
              <div style="font-weight: 500; color: var(--lt-color-neutral-900);">Jane Doe</div>
              <div style="font-size: 0.875rem; color: var(--lt-color-neutral-600);">jane.doe@example.com</div>
            </div>
          </div>
          <p style="margin: 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
            Senior Product Designer with 8+ years of experience in creating beautiful user interfaces.
          </p>
        </div>
      </lt-surface>

      <!-- Outlined section -->
      <lt-surface variant="outlined" elevation="0">
        <div style="padding: var(--lt-spacing-5);">
          <h4 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-900);">Important Notice</h4>
          <p style="margin: 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
            This is an outlined surface component, perfect for callouts, notices, or subtle grouping of content.
          </p>
        </div>
      </lt-surface>

      <!-- High elevation (modal-like) -->
      <div style="display: flex; justify-content: center; padding: var(--lt-spacing-12); background: rgba(0,0,0,0.05);">
        <lt-surface elevation="5" style="max-width: 400px; width: 100%;">
          <div style="padding: var(--lt-spacing-6);">
            <h3 style="margin: 0 0 var(--lt-spacing-3) 0; color: var(--lt-color-neutral-900);">
              Modal Dialog Example
            </h3>
            <p style="margin: 0 0 var(--lt-spacing-5) 0; color: var(--lt-color-neutral-700); font-size: 0.875rem;">
              High elevation (5) creates strong depth, perfect for modals and overlays.
            </p>
            <div style="display: flex; gap: var(--lt-spacing-3); justify-content: flex-end;">
              <button
                style="padding: var(--lt-spacing-2) var(--lt-spacing-4); background: transparent; border: 1px solid var(--lt-color-neutral-300); border-radius: var(--lt-border-radius); cursor: pointer;"
              >
                Cancel
              </button>
              <button
                style="padding: var(--lt-spacing-2) var(--lt-spacing-4); background: var(--lt-color-primary-500); color: white; border: none; border-radius: var(--lt-border-radius); cursor: pointer;"
              >
                Confirm
              </button>
            </div>
          </div>
        </lt-surface>
      </div>
    </div>
  `
};
