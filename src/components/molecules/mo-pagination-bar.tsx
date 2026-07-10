'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { dataTestId } from '@/lib/test-id';

export function MoPaginationBar({
  page,
  totalPages,
  testId,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  testId?: string;
  onPageChange: (page: number) => void;
}) {
  const pageItems = useMemo(() => {
    const total = Math.max(1, totalPages);
    const current = Math.max(1, Math.min(total, page));
    const windowStart = Math.max(1, current - 2);
    const windowEnd = Math.min(total, current + 2);
    const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];

    if (windowStart > 1) {
      items.push(1);
      if (windowStart > 2) items.push('ellipsis-start');
    }

    for (let p = windowStart; p <= windowEnd; p++) items.push(p);

    if (windowEnd < total) {
      if (windowEnd < total - 1) items.push('ellipsis-end');
      items.push(total);
    }

    return items;
  }, [page, totalPages]);

  function go(n: number) {
    onPageChange(Math.max(1, Math.min(totalPages, n)));
  }

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-3 py-2"
      role="navigation"
      aria-label="Pagination"
      {...dataTestId(testId)}
    >
      <Button
        variant="outline"
        size="sm"
        className="min-w-16 rounded border bg-white text-xs shadow-none"
        disabled={page <= 1}
        {...dataTestId(testId ? `${testId}-prev-btn` : undefined)}
        onClick={() => go(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        <span>前へ</span>
      </Button>

      {pageItems.map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-1 text-sm text-muted-foreground" aria-hidden>
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant="outline"
            size="icon"
            className={`h-8 min-w-8 rounded border bg-white text-sm shadow-none ${
              item === page ? 'border-[#4EAAFF] bg-[#4EAAFF]/10 text-[#4EAAFF]' : 'text-foreground'
            }`}
            aria-current={item === page ? 'page' : undefined}
            {...dataTestId(testId ? `${testId}-page-${item}` : undefined)}
            onClick={() => go(item)}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        className="min-w-16 rounded border bg-white text-xs shadow-none"
        disabled={page >= totalPages}
        {...dataTestId(testId ? `${testId}-next-btn` : undefined)}
        onClick={() => go(page + 1)}
      >
        <span>次へ</span>
        <ChevronRight className="size-4" aria-hidden />
      </Button>
    </nav>
  );
}
