import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './icon';
import { commonIcons } from '../providers/iconoir-icons';

const meta: Meta = {
  title: 'Components/Icon',
  argTypes: {
    name: { control: 'select', options: Object.keys(commonIcons) },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    name: 'check',
    size: 'md'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-icon name=${args.name} size=${args.size}></lt-icon>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-icon name="check" size="xs"></lt-icon>
      <lt-icon name="check" size="sm"></lt-icon>
      <lt-icon name="check" size="md"></lt-icon>
      <lt-icon name="check" size="lg"></lt-icon>
      <lt-icon name="check" size="xl"></lt-icon>
    </div>
  `
};

export const Colors: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-icon name="check" size="lg" style="color: var(--lt-color-primary-500)"></lt-icon>
      <lt-icon name="check" size="lg" style="color: var(--lt-color-success-500)"></lt-icon>
      <lt-icon name="check" size="lg" style="color: var(--lt-color-warning-500)"></lt-icon>
      <lt-icon name="check" size="lg" style="color: var(--lt-color-error-500)"></lt-icon>
      <lt-icon name="check" size="lg" style="color: var(--lt-color-neutral-500)"></lt-icon>
    </div>
  `
};

export const AllIcons: Story = {
  render: () => {
    const iconNames = Object.keys(commonIcons);
    return html`
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: var(--lt-spacing-4);">
        ${iconNames.map(
          name => html`
            <div style="display: flex; flex-direction: column; align-items: center; gap: var(--lt-spacing-2); padding: var(--lt-spacing-3); border: 1px solid var(--lt-color-neutral-200); border-radius: var(--lt-border-radius);">
              <lt-icon name=${name} size="lg"></lt-icon>
              <span style="font-size: 0.75rem; text-align: center; word-break: break-word;">${name}</span>
            </div>
          `
        )}
      </div>
    `;
  }
};

export const Navigation: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-icon name="arrow-left" size="lg"></lt-icon>
      <lt-icon name="arrow-right" size="lg"></lt-icon>
      <lt-icon name="arrow-up" size="lg"></lt-icon>
      <lt-icon name="arrow-down" size="lg"></lt-icon>
      <lt-icon name="nav-arrow-left" size="lg"></lt-icon>
      <lt-icon name="nav-arrow-right" size="lg"></lt-icon>
    </div>
  `
};

export const Actions: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-icon name="check" size="lg"></lt-icon>
      <lt-icon name="xmark" size="lg"></lt-icon>
      <lt-icon name="plus" size="lg"></lt-icon>
      <lt-icon name="minus" size="lg"></lt-icon>
      <lt-icon name="edit" size="lg"></lt-icon>
      <lt-icon name="trash" size="lg"></lt-icon>
      <lt-icon name="save" size="lg"></lt-icon>
      <lt-icon name="download" size="lg"></lt-icon>
      <lt-icon name="upload" size="lg"></lt-icon>
    </div>
  `
};

export const Status: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-icon name="info-circle" size="lg" style="color: var(--lt-color-info-500)"></lt-icon>
      <lt-icon name="warning-triangle" size="lg" style="color: var(--lt-color-warning-500)"></lt-icon>
      <lt-icon name="check-circle" size="lg" style="color: var(--lt-color-success-500)"></lt-icon>
      <lt-icon name="xmark-circle" size="lg" style="color: var(--lt-color-error-500)"></lt-icon>
    </div>
  `
};
