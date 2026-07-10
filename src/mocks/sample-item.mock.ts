import type { SampleItem, SampleItemListResponse } from '@portal/models/sample-item';

const PAGE1: SampleItem[] = [
  {
    "id": 1,
    "name": "Contract gen pilot A",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 2,
    "name": "Contract gen pilot B",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 3,
    "name": "Contract gen pilot C",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
];
const PAGE2: SampleItem[] = [
  {
    "id": 101,
    "name": "Contract gen pilot A (page 2)",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 102,
    "name": "Contract gen pilot B (page 2)",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 103,
    "name": "Contract gen pilot C (page 2)",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
];

/**
 * Prototype mock search — replace with service.search on /wire.
 */
export async function sampleItemMockSearch(
  query: Record<string, unknown> = {},
): Promise<SampleItemListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const page = Number(query.page ?? 1);
  const perPage = Number(query.per_page ?? 10);
  const source = page <= 1 ? PAGE1 : PAGE2;
  const items = source.slice(0, perPage);

  return {
    items,
    total: PAGE1.length + PAGE2.length,
  };
}
