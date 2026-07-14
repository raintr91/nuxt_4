# #derived-data

Use when BE adds fields/tables not in FE spec for search, sort, compute, or snapshots.

Requirements:

- `backendOnly: true`
- `sourceOfTruth`, `refresh` strategy
- `staleness` if not realtime
- Do not hide wrong relationship design with derived tables

## Grill / platform-mark

- Grill flags BE-only fields → ask member
