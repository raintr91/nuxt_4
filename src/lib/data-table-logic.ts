export type SortOrder = 'asc' | 'desc';

function getValueByPath(row: Record<string, unknown>, key: string): unknown {
  if (!key.includes('.')) return row[key];
  return key.split('.').reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[part];
  }, row);
}

export function filterItemsBySearch(
  items: Record<string, unknown>[],
  search: string,
  searchKeys: string[],
): Record<string, unknown>[] {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((row) =>
    searchKeys.some((key) => {
      const v = getValueByPath(row, key);
      return v != null && String(v).toLowerCase().includes(q);
    }),
  );
}

export function sortItems(
  items: Record<string, unknown>[],
  sortKey: string | null,
  sortOrder: SortOrder,
): Record<string, unknown>[] {
  if (!sortKey) return items;
  const order = sortOrder === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const va = getValueByPath(a, sortKey);
    const vb = getValueByPath(b, sortKey);
    if (va == null && vb == null) return 0;
    if (va == null) return order;
    if (vb == null) return -order;
    return String(va).localeCompare(String(vb), undefined, { numeric: true }) * order;
  });
}

export function getTotalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function paginateItems(
  items: Record<string, unknown>[],
  page: number,
  pageSize: number,
): Record<string, unknown>[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getNextSortState(
  currentKey: string | null,
  currentOrder: SortOrder,
  clickedKey: string,
): { sortKey: string; sortOrder: SortOrder } {
  if (currentKey === clickedKey) {
    return { sortKey: clickedKey, sortOrder: currentOrder === 'asc' ? 'desc' : 'asc' };
  }
  return { sortKey: clickedKey, sortOrder: 'asc' };
}

export function cellValue(row: Record<string, unknown>, key: string): string | number | unknown {
  return getValueByPath(row, key) ?? '';
}
