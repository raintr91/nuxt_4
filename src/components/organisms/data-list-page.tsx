'use client';

import type { ReactNode } from 'react';
import { MoAppBar } from '@/components/molecules/mo-app-bar';
import { MoDataTable } from '@/components/molecules/mo-data-table';
import type { DataTableColumn } from '@/components/molecules/data-table-types';
import { dataTestId } from '@/lib/test-id';

export function DataListPage({
  title,
  testId,
  filterTestId,
  tableTestId,
  dataTableTestId,
  rowTestId,
  toolbarTestId,
  totalTestId,
  paginationTestId,
  total,
  totalLabel = '合計',
  columns,
  items,
  pageSize,
  searchKeys,
  pending,
  actions,
  aboveToolbar,
  toolbarEnd,
  extraActions,
  below,
  renderCell,
}: {
  title?: string;
  testId?: string;
  filterTestId?: string;
  tableTestId?: string;
  dataTableTestId?: string;
  rowTestId?: string;
  toolbarTestId?: string;
  totalTestId?: string;
  paginationTestId?: string;
  total?: number;
  totalLabel?: string;
  columns: DataTableColumn[];
  items: Record<string, unknown>[];
  pageSize?: number;
  searchKeys?: string[];
  pending?: boolean;
  actions?: ReactNode;
  aboveToolbar?: ReactNode;
  toolbarEnd?: ReactNode;
  extraActions?: ReactNode;
  below?: ReactNode;
  renderCell?: (key: string, row: Record<string, unknown>, value: unknown) => ReactNode;
}) {
  return (
    <div className="space-y-4" {...dataTestId(testId)}>
      {title ? <MoAppBar title={title} actions={actions} /> : null}
      {aboveToolbar}
      {total !== undefined || extraActions || toolbarEnd ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          {...dataTestId(toolbarTestId ?? 'data-list-toolbar-actions')}
        >
          <div className="flex flex-wrap items-center gap-3">
            {total !== undefined ? (
              <button
                type="button"
                className="pointer-events-none min-w-[120px] rounded-[5px] bg-[#48b0f7] px-4 py-2 text-sm font-semibold text-white shadow-none"
                aria-disabled
                {...dataTestId(totalTestId)}
              >
                {totalLabel} {total}
              </button>
            ) : null}
            {extraActions}
          </div>
          {toolbarEnd ? <div className="flex flex-wrap items-center gap-2">{toolbarEnd}</div> : null}
        </div>
      ) : null}
      <div {...dataTestId(tableTestId)} aria-busy={pending}>
        <MoDataTable
          columns={columns}
          items={items}
          pageSize={pageSize}
          searchKeys={searchKeys}
          rowTestId={rowTestId}
          paginationTestId={paginationTestId}
          testId={dataTableTestId}
          searchPlaceholder={false}
          renderCell={renderCell}
        />
      </div>
      {below}
      <div className="hidden" {...dataTestId(filterTestId)} />
    </div>
  );
}
