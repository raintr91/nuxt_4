'use client';

import { useEffect } from 'react';
import { DataListPage } from '@/components/common';
import { useSampleItemList } from '@/hooks/sample-item/useSampleItemList';

export default function SampleItemListPage() {
  const {
    columns,
    items,
    pending,
    total,
    searchKeys,
    load,
  } = useSampleItemList();

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <DataListPage
      title="Contract gen pilot"
      testId="sample-items-page"
      tableTestId="sample-items-table"
      toolbarTestId="sample-items-toolbar"
      paginationTestId="sample-items-pagination"
      rowTestId="sample-items-row"
      columns={columns}
      items={items}
      pending={pending}
      total={total ?? undefined}
      pageSize={10}
      searchKeys={searchKeys}
    />
  );
}
