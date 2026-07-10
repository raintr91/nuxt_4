import Link from 'next/link';
import { cn } from '@/lib/utils';
import { dataTestId } from '@/lib/test-id';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function MoBreadcrumbNav({
  items,
  className,
  testId,
}: {
  items: BreadcrumbItem[];
  className?: string;
  testId?: string;
}) {
  return (
    <nav aria-label="breadcrumb" className={cn(className)} {...dataTestId(testId)}>
      <ol className="m-0 flex list-none flex-wrap items-center bg-transparent p-0 font-[Montserrat,sans-serif] uppercase">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const linkTestId = testId ? `${testId}-link-${index}` : undefined;
          const itemTestId = testId ? `${testId}-item-${index}` : undefined;
          const currentTestId = testId ? `${testId}-current` : undefined;

          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center pl-0 before:px-[5px] before:text-xs before:font-bold before:text-[#515050] before:content-['›'] first:before:content-none"
              {...dataTestId(itemTestId)}
            >
              {item.href && !isLast ? (
                item.href.startsWith('/') ? (
                  <Link
                    href={item.href}
                    className="mx-[5px] text-[10.5px] font-normal tracking-wider text-[#7b7d82]"
                    {...dataTestId(linkTestId)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="mx-[5px] text-[10.5px] font-normal tracking-wider text-[#7b7d82]"
                    {...dataTestId(linkTestId)}
                  >
                    {item.label}
                  </a>
                )
              ) : (
                <span
                  className="mx-[5px] text-[10.5px] font-medium tracking-wider text-[#0090d9]"
                  {...dataTestId(isLast ? currentTestId : linkTestId)}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
