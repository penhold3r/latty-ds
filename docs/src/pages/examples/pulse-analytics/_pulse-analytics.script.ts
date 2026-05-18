import '@latty/web';

const table = document.getElementById('activity-table') as any;

table.columns = [
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'region', label: 'Region' },
  { key: 'revenue', label: 'Revenue', sortable: true, align: 'right' },
  {
    key: 'growth',
    label: 'Growth',
    width: '160px',
    render: (value: number) => {
      const el = document.createElement('lt-progress');
      el.setAttribute('value', String(value));
      el.setAttribute('label', `Growth: ${value}%`);
      el.setAttribute('variant', value >= 50 ? 'success' : value >= 25 ? 'primary' : 'warning');
      el.setAttribute('size', 'sm');
      return el;
    }
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => {
      const variantMap: Record<string, string> = { Active: 'success', Paused: 'warning', Churned: 'error' };
      const el = document.createElement('lt-badge');
      el.setAttribute('variant', variantMap[value] ?? 'neutral');
      el.setAttribute('content', value);
      return el;
    }
  },
  { key: 'sessions', label: 'Sessions', sortable: true, align: 'right' }
];

table.data = [
  {
    customer: 'Apex Solutions',
    region: 'North America',
    revenue: '$18,400',
    growth: 72,
    status: 'Active',
    sessions: 1840
  },
  { customer: 'Orion Labs', region: 'Europe', revenue: '$14,200', growth: 55, status: 'Active', sessions: 1230 },
  { customer: 'Tide Media', region: 'Asia-Pacific', revenue: '$9,800', growth: 38, status: 'Active', sessions: 980 },
  {
    customer: 'Crestwood Inc.',
    region: 'North America',
    revenue: '$7,600',
    growth: 29,
    status: 'Paused',
    sessions: 760
  },
  { customer: 'Nova Collective', region: 'Europe', revenue: '$6,900', growth: 22, status: 'Active', sessions: 690 },
  {
    customer: 'Skyline Partners',
    region: 'Latin America',
    revenue: '$5,400',
    growth: 15,
    status: 'Paused',
    sessions: 540
  },
  { customer: 'Meridian Group', region: 'Middle East', revenue: '$3,200', growth: 8, status: 'Churned', sessions: 320 },
  { customer: 'Vanguard Tech', region: 'Asia-Pacific', revenue: '$2,100', growth: 5, status: 'Churned', sessions: 210 }
];

const rangeSelect = document.getElementById('time-range') as any;
rangeSelect.options = [
  { value: 'last-7', label: 'Last 7 days' },
  { value: 'last-30', label: 'Last 30 days' },
  { value: 'last-90', label: 'Last 90 days' },
  { value: 'this-year', label: 'This year' }
];
rangeSelect.value = 'last-30';

rangeSelect.addEventListener('change', (e: CustomEvent<{ value: string }>) => {
  const opt = rangeSelect.options.find((o: any) => o.value === e.detail.value);
  const label = document.getElementById('range-label');
  if (label) label.textContent = opt?.label ?? e.detail.value;
});

document.querySelectorAll<any>('lt-chip[deletable]').forEach((chip) => {
  chip.addEventListener('lt-delete', () => chip.remove());
});
