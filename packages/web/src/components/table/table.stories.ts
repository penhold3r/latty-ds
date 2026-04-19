import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './table';
import type { TableColumn } from './table.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  salary: number;
}

const sampleData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    status: 'active',
    joinDate: '2023-01-15',
    salary: 85000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Product Manager',
    status: 'active',
    joinDate: '2022-08-22',
    salary: 95000,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Designer',
    status: 'inactive',
    joinDate: '2023-03-10',
    salary: 75000,
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'Software Engineer',
    status: 'active',
    joinDate: '2021-11-05',
    salary: 92000,
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'DevOps Engineer',
    status: 'active',
    joinDate: '2022-06-18',
    salary: 88000,
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: 'Data Scientist',
    status: 'active',
    joinDate: '2023-02-28',
    salary: 98000,
  },
];

const basicColumns: TableColumn<User>[] = [
  { key: 'name', label: 'Name', sortable: true, sticky: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' },
];

const meta: Meta = {
  title: 'Components/Table',
  component: 'lt-table',
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
      description: 'The density/spacing of the table',
    },
    responsiveMode: {
      control: 'select',
      options: ['scroll', 'stack'],
      description: 'How the table behaves on small screens',
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether rows have a hover effect',
    },
    striped: {
      control: 'boolean',
      description: 'Whether to show alternating row colors',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to show borders around cells',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the table is in a loading state',
    },
  },
  args: {
    density: 'normal',
    responsiveMode: 'scroll',
    hoverable: true,
    striped: false,
    bordered: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic table with sortable columns. Click on headers to sort.',
      },
    },
  },
  render: (args) => {
    const table = document.createElement('lt-table') as any;
    table.columns = basicColumns;
    table.data = sampleData;
    table.density = args.density;
    table.responsiveMode = args.responsiveMode;
    table.hoverable = args.hoverable;
    table.striped = args.striped;
    table.bordered = args.bordered;
    table.loading = args.loading;
    return table;
  },
};

export const Sortable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with sortable columns. Click headers to sort by that column.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'id', label: 'ID', sortable: true, width: '80px', align: 'right' },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'salary', label: 'Salary', sortable: true, align: 'right' },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.hoverable = true;
    return table;
  },
};

export const CustomRenderer: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with custom cell renderers for formatting and styling.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        align: 'center',
        render: (value: string) => {
          const color = value === 'active' ? 'var(--lt-color-success-500)' : 'var(--lt-color-neutral-400)';
          const bgColor = value === 'active' ? 'var(--lt-color-success-50)' : 'var(--lt-color-neutral-50)';
          return `<span style="background: ${bgColor}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; font-weight: 500;">${value}</span>`;
        },
      },
      {
        key: 'salary',
        label: 'Salary',
        sortable: true,
        align: 'right',
        render: (value: number) => {
          return `$${value.toLocaleString()}`;
        },
      },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.hoverable = true;
    table.striped = true;
    return table;
  },
};

export const Density: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tables support three density levels: compact, normal, and comfortable.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6);">
      <div>
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Compact</h3>
        ${(() => {
          const table = document.createElement('lt-table') as any;
          table.columns = basicColumns;
          table.data = sampleData.slice(0, 3);
          table.density = 'compact';
          table.bordered = true;
          return table;
        })()}
      </div>

      <div>
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Normal</h3>
        ${(() => {
          const table = document.createElement('lt-table') as any;
          table.columns = basicColumns;
          table.data = sampleData.slice(0, 3);
          table.density = 'normal';
          table.bordered = true;
          return table;
        })()}
      </div>

      <div>
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Comfortable</h3>
        ${(() => {
          const table = document.createElement('lt-table') as any;
          table.columns = basicColumns;
          table.data = sampleData.slice(0, 3);
          table.density = 'comfortable';
          table.bordered = true;
          return table;
        })()}
      </div>
    </div>
  `,
};

export const ResponsiveScroll: Story = {
  parameters: {
    docs: {
      description: {
        story: 'In scroll mode, the table scrolls horizontally on small screens. Resize window to see.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'id', label: 'ID', sortable: true, width: '80px' },
      { key: 'name', label: 'Name', sortable: true, minWidth: '150px' },
      { key: 'email', label: 'Email', sortable: true, minWidth: '200px' },
      { key: 'role', label: 'Role', sortable: true, minWidth: '150px' },
      { key: 'status', label: 'Status', sortable: true, minWidth: '100px' },
      { key: 'joinDate', label: 'Join Date', sortable: true, minWidth: '120px' },
      { key: 'salary', label: 'Salary', sortable: true, align: 'right', minWidth: '120px' },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.responsiveMode = 'scroll';
    table.hoverable = true;
    table.bordered = true;
    return table;
  },
};

export const ResponsiveStack: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In stack mode, the table converts to cards on small screens. Resize window to see the effect.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.responsiveMode = 'stack';
    table.hoverable = true;
    return table;
  },
};

export const HideMobileColumns: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Columns can be hidden on mobile devices. Resize window to see email and join date columns disappear.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true, hideOnMobile: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'joinDate', label: 'Join Date', sortable: true, hideOnMobile: true },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.responsiveMode = 'scroll';
    table.hoverable = true;
    table.striped = true;
    return table;
  },
};

export const StripedAndBordered: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with zebra stripes (alternating row colors) and borders for better readability in large tables.',
      },
    },
  },
  render: () => {
    const table = document.createElement('lt-table') as any;
    table.columns = basicColumns;
    table.data = sampleData;
    table.striped = true;
    table.bordered = true;
    table.hoverable = true;
    return table;
  },
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with no data shows an empty state message.',
      },
    },
  },
  render: () => {
    const table = document.createElement('lt-table') as any;
    table.columns = basicColumns;
    table.data = [];
    table.emptyMessage = 'No users found';
    table.bordered = true;
    return table;
  },
};

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with loading overlay and spinner.',
      },
    },
  },
  render: () => {
    const table = document.createElement('lt-table') as any;
    table.columns = basicColumns;
    table.data = sampleData;
    table.loading = true;
    table.hoverable = true;
    return table;
  },
};

export const StickyColumn: Story = {
  parameters: {
    docs: {
      description: {
        story: 'First column is sticky and remains visible when scrolling horizontally. Notice the solid background and shadow effect.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true, sticky: true, minWidth: '150px' },
      { key: 'email', label: 'Email', sortable: true, minWidth: '200px' },
      { key: 'role', label: 'Role', sortable: true, minWidth: '180px' },
      { key: 'status', label: 'Status', sortable: true, minWidth: '120px' },
      { key: 'joinDate', label: 'Join Date', sortable: true, minWidth: '150px' },
      { key: 'salary', label: 'Salary', sortable: true, align: 'right', minWidth: '150px' },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.hoverable = true;
    table.striped = true;
    table.bordered = true;
    return table;
  },
};

export const CustomSort: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with custom sort function for the join date column.',
      },
    },
  },
  render: () => {
    const columns: TableColumn<User>[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      {
        key: 'joinDate',
        label: 'Join Date',
        sortable: true,
        sortFn: (a: User, b: User, direction: 'asc' | 'desc') => {
          const dateA = new Date(a.joinDate).getTime();
          const dateB = new Date(b.joinDate).getTime();
          return direction === 'asc' ? dateA - dateB : dateB - dateA;
        },
        render: (value: string) => {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
      { key: 'salary', label: 'Salary', sortable: true, align: 'right' },
    ];

    const table = document.createElement('lt-table') as any;
    table.columns = columns;
    table.data = sampleData;
    table.hoverable = true;
    table.striped = true;
    return table;
  },
};
