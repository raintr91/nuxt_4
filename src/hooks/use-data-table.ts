'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '@/components/molecules/data-table-types';
import {
  filterItemsBySearch,
  getNextSortState,
  getTotalPages,
  paginateItems,
  sortItems,
  type SortOrder,
} from '@/lib/data-table-logic';

export function useDataTable(props: {
  columns: DataTableColumn[];
  items: Record<string, unknown>[];
  pageSize?: number;
  searchKeys?: string[];
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);

  const pageSize = props.pageSize ?? 10;
  const searchKeys = props.searchKeys ?? props.columns.map((c) => c.key);

  const filteredItems = useMemo(
    () => filterItemsBySearch(props.items, search, searchKeys),
    [props.items, search, searchKeys],
  );

  const sortedItems = useMemo(
    () => sortItems(filteredItems, sortKey, sortOrder),
    [filteredItems, sortKey, sortOrder],
  );

  const totalPages = useMemo(
    () => getTotalPages(sortedItems.length, pageSize),
    [sortedItems.length, pageSize],
  );

  const paginatedItems = useMemo(
    () => paginateItems(sortedItems, page, pageSize),
    [sortedItems, page, pageSize],
  );

  useEffect(() => {
    if (page > totalPages) setPage(Math.max(1, totalPages));
  }, [page, totalPages]);

  function toggleSort(key: string) {
    const next = getNextSortState(sortKey, sortOrder, key);
    setSortKey(next.sortKey);
    setSortOrder(next.sortOrder);
  }

  return {
    search,
    setSearch,
    sortKey,
    sortOrder,
    page,
    setPage,
    totalPages,
    paginatedItems,
    toggleSort,
  };
}
