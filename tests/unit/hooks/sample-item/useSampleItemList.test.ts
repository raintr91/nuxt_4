import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockSearch = vi.fn();

vi.mock('@/services/sample-item.service', () => ({
  createSampleItemService: () => ({
    search: (...args: unknown[]) => mockSearch(...args),
  }),
}));

import { useSampleItemList } from '@/hooks/sample-item/useSampleItemList';

describe('hooks/sample-item/useSampleItemList', () => {
  const validRow = {
    id: 1,
    name: 'Contract gen pilot A',
    managers: [{ id: 101, full_name: 'Manager A' }],
  } as const;

  beforeEach(() => {
    mockSearch.mockReset();
    mockSearch.mockResolvedValue({ items: [validRow], total: 1 });
  });

  it('load() fills items and total from service.search', async () => {
    const { result } = renderHook(() => useSampleItemList());

    await act(async () => {
      await result.current.load();
    });

    expect(mockSearch).toHaveBeenCalled();
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(validRow);
    expect(result.current.total).toBe(1);
    expect(result.current.pending).toBe(false);
  });

  it('onReset() restores default per_page and reloads', async () => {
    const { result } = renderHook(() => useSampleItemList());

    act(() => {
      result.current.setQuery({ per_page: 20, page: 2 });
    });

    await act(async () => {
      await result.current.onReset();
    });

    expect(result.current.query).toEqual({ per_page: 10 });
    expect(mockSearch).toHaveBeenCalled();
  });
});
