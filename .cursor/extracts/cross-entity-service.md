# #cross-entity-service

Rare: one API orchestrates two **independent** internal aggregates synchronously.

Reject first if relationship, async side effect, or split APIs suffice.

## Backend spec

- Tag `cross-entity-service`, `services`, `serviceRefs`, `alternativesConsidered`

## Grill / platform-mark

- Grill flags multi-aggregate sync → ask member
