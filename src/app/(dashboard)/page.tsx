import { DataListPage, DataPageHeader, MoBreadcrumbNav } from '@/components/common';

const demoColumns = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Name', sortable: true },
  { key: 'status', title: 'Status' },
];

const demoItems = [
  { id: 1, name: 'Sample Item A', status: 'active' },
  { id: 2, name: 'Sample Item B', status: 'draft' },
  { id: 3, name: 'Sample Item C', status: 'active' },
];

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page" className="space-y-6">
      <MoBreadcrumbNav
        testId="dashboard-breadcrumb"
        items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
      />
      <DataPageHeader
        testId="dashboard-page-header"
        title="ホーム"
        description="Portal Next.js base — common components ready."
      />
      <DataListPage
        testId="dashboard-demo-list"
        title="Demo list"
        columns={demoColumns}
        items={demoItems}
        total={demoItems.length}
        rowTestId="dashboard-demo-row"
      />
    </div>
  );
}
