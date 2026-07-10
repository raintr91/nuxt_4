'use client';

import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoPaginationBar } from '@/components/molecules/mo-pagination-bar';
import type { DataTableColumn } from '@/components/molecules/data-table-types';
import { useDataTable } from '@/hooks/use-data-table';
import { cellValue } from '@/lib/data-table-logic';
import { cn } from '@/lib/utils';
import { dataTestId } from '@/lib/test-id';

function alignClass(align?: DataTableColumn['align']) {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

function overflowClass(overflow: DataTableColumn['overflow'] = 'truncate-tooltip') {
  if (overflow === 'nowrap') return 'whitespace-nowrap';
  if (overflow === 'wrap-2-lines') return 'line-clamp-2 whitespace-normal';
  if (overflow === 'wrap-free') return 'whitespace-normal';
  return 'max-w-[220px] truncate whitespace-nowrap';
}

export function MoDataTable({
  columns,
  items,
  searchPlaceholder = '検索...',
  pageSize = 10,
  searchKeys,
  rowTestId,
  paginationTestId,
  className,
  testId,
  renderCell,
}: {
  columns: DataTableColumn[];
  items: Record<string, unknown>[];
  searchPlaceholder?: string | false;
  pageSize?: number;
  searchKeys?: string[];
  rowTestId?: string;
  paginationTestId?: string;
  className?: string;
  testId?: string;
  renderCell?: (key: string, row: Record<string, unknown>, value: unknown) => ReactNode;
}) {
  const {
    search,
    setSearch,
    sortKey,
    sortOrder,
    page,
    setPage,
    totalPages,
    paginatedItems,
    toggleSort,
  } = useDataTable({ columns, items, pageSize, searchKeys });

  return (
    <div className={cn('space-y-4', className)} {...dataTestId(testId)}>
      {searchPlaceholder !== false ? (
        <div className="flex justify-end">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder || '検索...'}
            className="max-w-xs"
          />
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    alignClass(col.align),
                    col.sortable ? 'cursor-pointer select-none hover:bg-muted/60' : '',
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.title}
                    {col.sortable && sortKey === col.key ? (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    ) : null}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((row, i) => (
              <TableRow key={i} {...dataTestId(rowTestId)}>
                {columns.map((col) => {
                  const value = cellValue(row, col.key);
                  return (
                    <TableCell
                      key={col.key}
                      className={cn(alignClass(col.align), overflowClass(col.overflow))}
                      style={col.maxWidth ? { maxWidth: col.maxWidth } : undefined}
                      title={
                        col.overflow === 'truncate-tooltip' || col.overflow === 'nowrap'
                          ? String(value ?? '')
                          : undefined
                      }
                    >
                      {renderCell ? renderCell(col.key, row, value) : String(value ?? '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 ? (
        <MoPaginationBar
          page={page}
          totalPages={totalPages}
          testId={paginationTestId}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
