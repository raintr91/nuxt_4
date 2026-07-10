'use client';

import { useCallback, useMemo, useState } from 'react';
import type { SampleItem } from '@portal/models/sample-item';
import type { DataTableColumn } from '@/components/molecules/data-table-types';
import { createSampleItemService } from '@/services/sample-item.service';

/** Contract gen pilot — list wired to fast-api-base GET /sample-items */
export function useSampleItemList() {
  const service = useMemo(() => createSampleItemService(), []);

  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [items, setItems] = useState<SampleItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [query, setQuery] = useState<Record<string, unknown>>({ per_page: 10 });

  const filters = useMemo(() => [], []);

  const columns = useMemo<DataTableColumn[]>(
    () => [
      { key: 'name', title: '' },
      { key: 'managers', title: '' },
    ],
    [],
  );

  const searchKeys = useMemo(() => columns.map((column) => column.key), [columns]);

  const load = useCallback(async () => {
    setPending(true);
    setErrorMsg(null);
    try {
      const result = await service.search(query);
      setItems(result.items);
      setTotal(result.total ?? result.items.length);
    } catch (error: unknown) {
      setErrorMsg((error as Error)?.message ?? 'Cannot load Contract gen pilot');
      setItems([]);
      setTotal(null);
    } finally {
      setPending(false);
    }
  }, [query, service]);

  const onSearch = useCallback(() => load(), [load]);

  const onReset = useCallback(async () => {
    const nextQuery = { per_page: 10 };
    setQuery(nextQuery);
    setPending(true);
    setErrorMsg(null);
    try {
      const result = await service.search(nextQuery);
      setItems(result.items);
      setTotal(result.total ?? result.items.length);
    } catch (error: unknown) {
      setErrorMsg((error as Error)?.message ?? 'Cannot load Contract gen pilot');
      setItems([]);
      setTotal(null);
    } finally {
      setPending(false);
    }
  }, [service]);

  return {
    pending,
    errorMsg,
    items,
    total,
    query,
    setQuery,
    filters,
    columns,
    searchKeys,
    load,
    onSearch,
    onReset,
    service,
  };
}
