# #call-external

When spec/prompt has `#call-external`, payment, webhook, OAuth, SMS, shipping, ERP, MES/CMMS, or third-party API.

## Backend spec

- Tag `call-external`, document `externalCalls`, endpoint `externalCallRefs`
- Secrets from config/env only

## Code

- Service/integration client only — not in router/UI entry
- Log provider request id, status, failure reason

## Grill / platform-mark

- Grill flags suspicious outbound calls → ask member
- Member confirms → `/platform-mark` adds `technicalMarks` + `externalCalls`
