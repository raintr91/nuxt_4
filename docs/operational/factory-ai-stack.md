# Factory AI Stack — kiến trúc cụm sản phẩm

> Tổng hợp kiến trúc Factory AI Platform: portal (Next.js), fast (FastAPI), line-base (.NET desktop), integration-base (.NET gateway).  
> TODO: [`fast-api-base-todo.txt`](../../fast-api-base-todo.txt) · [`dotnet-bases-todo.txt`](../../dotnet-bases-todo.txt) (repo root).

**Cập nhật:** 2026-07-09 (bổ sung line-base + integration-base)

---

## 1. Tóm tắt — bốn base tách repo

| Base | Repo | Tech | Đối xứng | Vai trò |
|------|------|------|----------|---------|
| **portal-base** | `~/workspace/portal` | Next.js 15 | Nuxt cũ | Web engineer/admin — Knowledge, Maintenance, Agent |
| **fast-base** | `~/workspace/fast-api-base` | FastAPI | Nest / Laravel api | **API duy nhất** cho portal + line + agent tools |
| **line-base** | `~/workspace/line` | .NET 8 WinForms/WPF | portal-base (client mỏng) | Công nhân chuyền — check-in, nhận ca, QR, ack (không web) |
| **integration-base** | `~/workspace/integration` | .NET 8 ASP.NET | fast-base (adapter server) | PLC/MES/CMMS — **fast gọi xuống**, không UI công nhân |

**Tham khảo / deprecate (không runtime Factory AI):**

| Thành phần | Ghi chú |
|------------|---------|
| **Laravel `~/workspace/api`** | Read-only — docs, api-gen workflow, trait → Python map |
| **Nest `apps/api`** | Deprecate — thay bằng fast |

**Không cần:** repo/microservice deploy riêng chỉ để “call API”; mobile QC để phase sau (vẫn gọi fast).

**Nguyên tắc contract:** Cùng field keys trên FE Zod, fast Pydantic, line Contracts (OpenAPI gen) — [`portal-contract-naming`](../../.cursor/rules/portal-contract-naming.mdc). Envelope: `{ success, data, message }`.

---

## 2. Ba kênh người dùng

| Kênh | Ai dùng | Vào web portal? |
|------|---------|-----------------|
| **Portal** | Engineer, supervisor, QA, admin | Có |
| **Line client** | Công nhân, technician tại máy | **Không** |
| **Mobile** (tùy chọn) | QC walk-around | Thường không full portal |

Logic nghiệp vụ nằm trên **fast** — mỗi kênh chỉ là presentation layer mỏng.

---

## 3. Sơ đồ tổng thể (runtime)

```mermaid
flowchart TB
  subgraph Office["Văn phòng / phòng kỹ thuật"]
    P["portal<br/>Next.js 15 / portal-base"]
  end

  subgraph Line["Chuyền sản xuất — không web"]
    WF["line-base<br/>WinForms / WPF / HMI"]
    DEV["Badge / QR / camera<br/>local drivers"]
  end

  subgraph Core["Core platform"]
    F["fast<br/>FastAPI :4000"]
    KH["modules/knowledge"]
    MC["modules/maintenance"]
    WF_MOD["modules/workforce"]
    AG["modules/agent"]
  end

  subgraph OT["OT layer — server plant"]
    INT["integration-base<br/>.NET gateway"]
    PLC["PLC / line"]
    MES["MES"]
    CMMS["CMMS"]
  end

  subgraph Ref["Tham khảo — không deploy"]
    LAR["Laravel api<br/>read-only"]
  end

  P -->|"apiFetch HTTPS"| F
  WF -->|"REST same contract"| F
  DEV --> WF
  F --> KH & MC & WF_MOD & AG
  F -->|"httpx clients"| INT
  INT --> PLC & MES & CMMS
  LAR -.->|"pattern map"| F

  style Office fill:#e8f4fc
  style Line fill:#fff3e0
  style Core fill:#e8fce8
  style OT fill:#f0f0f0
  style Ref fill:#f5f5f5
```

---

## 4. Sơ đồ luồng API (request path)

### 4.1 Portal → fast

```mermaid
sequenceDiagram
  participant Page as app/page + components
  participant Hook as hooks/
  participant Svc as services/
  participant Models as @portal/models
  participant Fast as fast :4000

  Page->>Hook: user action
  Hook->>Svc: domain call
  Svc->>Models: validate / type
  Svc->>Fast: apiFetch GET/POST
  Fast-->>Svc: { success, data, message }
  Svc-->>Hook: parsed data
  Hook-->>Page: UI state
```

**Ràng buộc portal-base:** `page/component` không gọi `apiFetch` trực tiếp; không import ngược từ `models/`.

### 4.2 Line client → fast

```mermaid
sequenceDiagram
  participant UI as WinForms / HMI View
  participant VM as ViewModels/
  participant Svc as Services/ (khuyến nghị)
  participant Api as HttpClient / Refit
  participant Dev as Devices/ local SDK
  participant Fast as fast :4000

  Dev->>UI: badge scan / QR / face token
  UI->>VM: raw input
  VM->>Svc: CheckInAsync (hoặc VM→Api nếu prototype 1 màn)
  Svc->>Api: POST /workforce/check-in
  Api->>Fast: HTTPS
  Fast-->>Api: { success, data, message }
  Api-->>Svc: parsed envelope
  Svc-->>VM: result
  VM-->>UI: ack / error message
```

**Ràng buộc line-base:** Form/View không gọi PLC/MES; OT qua **integration-base**. Driver thẻ/QR chỉ ở `Devices/`.

### 4.3 fast → plant systems (integration)

```mermaid
sequenceDiagram
  participant Agent as modules/agent
  participant Fast as fast service layer
  participant INT as integration-base
  participant MES as MES
  participant PLC as PLC / OPC UA

  Agent->>Fast: tool invoke (downtime, alarm)
  Fast->>INT: HTTP / gRPC (plant gateway)
  INT->>MES: query downtime
  INT->>PLC: read tag / alarm
  MES-->>INT: plant data
  PLC-->>INT: tag snapshot
  INT-->>Fast: normalized contract keys
  Fast-->>Agent: tool result
```

---

## 5. Sơ đồ module API (fast)

```mermaid
flowchart LR
  subgraph Clients
    WEB[portal]
    LINE[line-base]
  end

  subgraph FastAPI["fast-api-base — ~/workspace/fast-api-base"]
    H["GET /health"]
    K["/knowledge/*"]
    M["/maintenance/*"]
    W["/workforce/*"]
    A["/agent/*"]
  end

  subgraph External
    LLM[LLM / RAG]
    INT[integration-base]
  end

  WEB --> H & K & M & A
  LINE --> H & M & W
  K --> LLM
  M --> INT
  A --> K & INT
  W --> INT
```

### Endpoint gợi ý (contract pilot → production)

| Module | Method | Path | Client chính | Mô tả |
|--------|--------|------|--------------|-------|
| health | GET | `/health` | all | Envelope smoke |
| knowledge | POST | `/knowledge/query` | portal, HMI subset | RAG + citation |
| maintenance | GET | `/machines/{id}` | portal, line | QR máy → context |
| maintenance | POST | `/maintenance/step/ack` | line HMI | Xác nhận bước SOP |
| maintenance | POST | `/alarms/{id}/ack` | line HMI | Ack alarm tại máy |
| workforce | POST | `/workforce/check-in` | line | Badge + station |
| workforce | POST | `/workforce/shift/handover` | line | Giao ca |
| workforce | GET | `/workforce/shift/current` | line | Ca hiện tại tại station |
| agent | POST | `/agent/chat` | portal | Tools: knowledge, MES, CMMS |

Payload HMI: ít field, response text ngắn — không full Agent UI trên panel 7".

---

## 6. Sơ đồ repo / ownership

```mermaid
flowchart TB
  subgraph PortalRepo["~/workspace/portal"]
    WEB["src — Next.js"]
    MODELS["packages/models — Zod SSOT"]
    GEN["portal:gen, contract:gen, unit-gen, testcase:gen"]
    E2E["tests/e2e Playwright"]
  end

  subgraph FastRepo["~/workspace/fast-api-base"]
    APP["src/app — FastAPI"]
    COMMON["common/ — api_response, presenters, pagination, auth"]
    MOD["modules/ — knowledge, maintenance, workforce, agent"]
    CLIENTS["clients/ — mes, cmms, llm"]
    FGEN["tools/fast_gen — Jinja2 + Typer"]
    PYTEST["tests/ pytest"]
  end

  subgraph LineRepo["~/workspace/line — line-base"]
    LC["Forms + ViewModels + Services"]
    LCON["Contracts/ — NSwag từ OpenAPI"]
  end

  subgraph IntRepo["~/workspace/integration — integration-base"]
    INT["Api + Application + Infrastructure"]
    IPRES["Presenters/ → contract keys"]
  end

  MODELS -->|"contract:gen keys"| WEB
  MODELS -.->|"OpenAPI gen (NSwag)"| LCON
  WEB -->|"apiFetch"| APP
  LC -->|"HttpClient"| APP
  APP --> CLIENTS --> INT
  GEN -.-> WEB
  FGEN -.-> APP
```

| Repo | Skill | Codegen owner |
|------|-------|---------------|
| portal | `/portal-base` | `portal:gen`, `portal:unit-gen`, `testcase:gen`, `contract:gen` |
| fast | `/fast-base` | `fast_gen`, `fast-unit-gen`, OpenAPI export |
| line | `/line-base` | NSwag/Kiota từ fast OpenAPI; `line-gen` (sau) |
| integration | `/integration-base` | `integration-gen` (sau) — route + adapter stub |

---

## 7. Sơ đồ contract SSOT

```mermaid
flowchart LR
  SPEC["docs/features/.../ir/spec.yaml"]
  CG["contract:gen"]
  ZOD["packages/models Zod"]
  PG["portal:gen → hooks, services, pages"]
  FG["fast-gen → Pydantic, router, service"]
  OAS["OpenAPI backend/02-openapi.yaml"]
  NET["line Contracts C# DTOs"]

  SPEC --> CG --> ZOD
  ZOD --> PG
  SPEC --> FG
  FG --> OAS --> NET
```

**Không rename layer:** `{ content, auth: { id, name } }` — không `content_blog`, `auth_id`.

---

## 8. Auth theo kênh

```mermaid
flowchart TB
  subgraph PortalAuth["Portal"]
    P1["Cookie / session phức tạp"]
    P2["RBAC: engineer, admin, supervisor"]
  end

  subgraph LineAuth["Line client"]
    L1["Device credential + badge/PIN"]
    L2["Session ngắn — operator role"]
    L3["Chỉ workforce + maintenance ack APIs"]
  end

  subgraph FastAuth["fast common/auth"]
    D["dependencies.get_current_user"]
    POL["policies.py — port BasePolicy"]
  end

  PortalAuth --> D
  LineAuth --> D
  D --> POL
```

| Vấn đề | Cách làm |
|--------|----------|
| Offline line (phase sau) | Queue SQLite trên WinForms → sync fast |
| HMI yếu | API payload nhỏ; knowledge trả text ngắn |
| Một nguồn OT | PLC/MES chỉ qua integration-base — không WinForms + fast cùng đọc PLC |

---

## 9. Map chức năng line → module

| Chức năng tại chuyền | UI | fast module |
|----------------------|-----|-------------|
| Check-in / nhận ca | WinForms kiosk | `workforce` |
| Nhận diện badge/face/QR | Camera SDK local → POST verify | `workforce` |
| Scan QR máy | Tablet WinForms | `maintenance` |
| Ack bước SOP / alarm | HMI 7" | `maintenance` |
| Hỏi nhanh SOP | HMI đơn giản | `knowledge` (subset) |
| Báo cáo / Agent đầy đủ | — | `agent` (portal only) |

---

## 10. Laravel common → Python fast (tham khảo)

| Laravel / Nest (cũ) | Python fast (`src/app/common/`) |
|---------------------|----------------------------------|
| BaseController + ApiResponse | `common/http/api_response.py` |
| BaseResource | `common/presenters/base.py` |
| EntrySearchTrait | `services/mixins/search_mixin.py` |
| BasePolicy | `common/auth/policies.py` |
| FormRequest | `modules/*/schemas/request.py` (Pydantic) |
| Pagination helper | `common/pagination.py` |

Pattern: router mỏng → service layer → presenter `to_contract()` — không CommandBus ceremony.

---

## 11. Thứ tự build

```mermaid
flowchart TD
  B1["1. fast-base B1–B33<br/>scaffold + common + /health + OpenAPI"]
  B2["2. portal wire P1–P5<br/>NEXT_PUBLIC_API_URL → fast"]
  B3["3. fast workforce stub"]
  B4["4. line-base mỏng<br/>1 màn check-in + Contracts gen"]
  B5["5. integration-base<br/>1 route downtime mock"]
  B6["6. Knowledge / Agent pilot<br/>chủ yếu portal"]

  B1 --> B2
  B2 --> B3
  B3 --> B4
  B4 --> B5
  B2 --> B6
```

Chi tiết checklist fast: [`fast-api-base-todo.txt`](../../fast-api-base-todo.txt).

---

## 12. line-base — .NET desktop (`~/workspace/line`)

**Vai trò:** UI tại chuyền, driver local (thẻ, QR, camera), **chỉ gọi lên fast**. **Không gộp** repo với integration-base — vai trò và layer khác hẳn.

### Stack

| Layer | Chọn gì | Ghi chú |
|-------|---------|---------|
| UI | WinForms (kiosk ổn định) hoặc WPF | HMI vendor → thin shell dùng chung ViewModel |
| MVVM | CommunityToolkit.Mvvm hoặc ReactiveUI | Tách state khỏi View — đối xứng `hooks/` |
| HTTP | `IHttpClientFactory` + Refit hoặc NSwag client | Gen từ OpenAPI fast |
| Contract | `Contracts/` (DTO gen) | Cùng keys Zod/Pydantic |
| Local | SQLite (phase 2) | Offline queue sync fast |
| Config | `appsettings.json` + device profile | `StationId`, `FastApiUrl`, `DeviceCredential` |
| Test | xUnit ViewModel | UI test / WinAppDriver — tùy chọn |

### Cấu trúc thư mục

```text
line/
  src/
    Line.App/              # WinForms/WPF entry, kiosk profiles
      Forms/               # View — binding, event, AutomationId
      ViewModels/          # state, command — đối xứng hooks/
      Services/            # gọi API, parse envelope — đối xứng services/
      Devices/             # IBadgeReader, IQrScanner — SDK vendor
    Line.Contracts/        # DTO gen OpenAPI (optional tách project)
    Line.Common.Http/      # ApiEnvelope<T>, parse — optional trong repo
  tests/
    Line.App.Tests/        # xUnit ViewModel + Service
  docs/operational/
    LINE-CLIENT-STRUCTURE.md
  .cursor/skills/line-base/
```

### line-invariants (đối xứng portal-invariants)

| Tầng | Không làm |
|------|-----------|
| Form/View | `HttpClient` trực tiếp |
| ViewModel | OPC UA / MES / SQL plant |
| Services/ | UI control, WinForms state |
| Contracts/ | import Services/ViewModels |

**Luồng chuẩn:** `View → ViewModel → Services → Contracts/HttpClient → fast`

---

## 13. integration-base — .NET server (`~/workspace/integration`)

**Vai trò:** Gateway nhà máy — fast gọi xuống; chuẩn hóa PLC/MES/CMMS → contract keys. **Không UI công nhân.**

### Stack

| Layer | Chọn gì |
|-------|---------|
| Host | ASP.NET Core 8 Minimal API hoặc Controllers |
| OT | OPC UA (Opc.UaFx / OPC Foundation) |
| MES/CMMS | HTTP/SOAP/SQL adapter tùy plant |
| Auth | API key / mTLS plant DMZ |
| Test | xUnit Application + mock PLC |

### Cấu trúc thư mục

```text
integration/
  src/
    Integration.Api/           # routes mỏng — đối xứng fast router
      Endpoints/
    Integration.Application/   # use cases — đối xứng fast services/
    Integration.Domain/        # plant models nội bộ (không leak ra fast)
    Integration.Infrastructure/
      OpcUa/                   # PLC client
      Mes/                     # MES HTTP/SQL
      Cmms/
    Integration.Presenters/    # domain → contract DTO — đối xứng BaseResource
    Integration.Common/        # ApiResponse, exception middleware
  tests/
  docs/operational/
    INTEGRATION-STRUCTURE.md
  .cursor/skills/integration-base/
```

### integration-invariants

| Tầng | Không làm |
|------|-----------|
| Api/Endpoints | OPC UA call trực tiếp |
| Application | UI, WinForms |
| Infrastructure | expose contract keys lệch spec |

**Luồng chuẩn:** `fast httpx → Api → Application → Infrastructure → PLC/MES` · presenter map response.

---

## 14. So sánh bốn base — layer map

```mermaid
flowchart TB
  subgraph PortalBase["portal-base · TS"]
    P1[app/components] --> P2[hooks] --> P3[services] --> P4["@portal/models"] --> P5[apiFetch → fast]
  end

  subgraph FastBase["fast-base · Python"]
    F1[router] --> F2[services] --> F3[presenters] --> F4[schemas] --> F5[clients → integration]
  end

  subgraph LineBase["line-base · .NET desktop"]
    L1[Forms] --> L2[ViewModels] --> L3[Services] --> L4[Contracts] --> L5[HttpClient → fast]
  end

  subgraph IntBase["integration-base · .NET server"]
    I1[Api] --> I2[Application] --> I3[Infrastructure] --> I4[PLC/MES]
    I2 --> I5[Presenters → contract]
  end

  P5 --> F1
  L5 --> F1
  F5 --> I1
```

| Base | Presentation | Orchestration | Contract | Transport |
|------|--------------|---------------|----------|-----------|
| portal-base | `app/`, `components/` | `hooks/` | `@portal/models` | `apiFetch` |
| fast-base | — | `modules/*/services/` | `schemas/` (Pydantic) | `clients/` → integration |
| line-base | `Forms/` | `ViewModels/` | `Contracts/` | `Services/` → HttpClient |
| integration-base | — | `Application/` | `Presenters/` | `Infrastructure/` → plant |

---

## 15. Contract packages C# (optional)

Tách rành như `packages/models` — **không** tách repo service deploy:

| Package | Nội dung | Khi nào tách project/NuGet |
|---------|----------|----------------------------|
| `Line.Contracts` / `Factory.Contracts` | DTO gen NSwag/Kiota | ≥2 app .NET dùng cùng OpenAPI |
| `Line.Common.Http` / `Factory.Common.Http` | `ApiEnvelope<T>`, parse `{ success, data, message }` | line + tool .NET khác |

SSOT vẫn `docs/features/.../ir/spec.yaml` (portal) → `contract:gen` → `fast_gen` → OpenAPI → gen C#.

---

## 16. Service layer — khi nào tách, khi nào không

| Câu hỏi | Trả lời |
|---------|---------|
| Repo/microservice deploy riêng chỉ để call API? | **Không** — không thêm process thứ 5 |
| Portal có `services/`? | **Bắt buộc** — portal-invariants |
| line-base có `Services/`? | **Khuyến nghị mỏng**; prototype 1 màn có thể `ViewModel → Refit` trực tiếp |
| Tách `Factory.Services` NuGet? | Chỉ khi nhiều app .NET share client; thường folder trong `line/` đủ |
| integration-base? | `Application/` = service layer — không thêm lớp nữa |

Ví dụ service mỏng line-base (~20 dòng, không repo riêng):

```csharp
public sealed class WorkforceService(IFastApiClient api)
{
    public Task<ApiResult<CheckInData>> CheckInAsync(CheckInRequest req)
        => api.PostAsync("/workforce/check-in", req);
}
```

---

## 17. Codegen / test đối xứng

| Base | Codegen | Unit test | Integration / E2E |
|------|---------|-----------|-------------------|
| portal-base | `portal:gen`, `contract:gen` | vitest `portal:unit-gen` | Playwright |
| fast-base | `fast_gen` | pytest `fast-unit-gen` | curl / pytest API |
| line-base | `line-gen` (sau) — screen + VM stub | xUnit ViewModel/Service | manual kiosk |
| integration-base | `integration-gen` (sau) | xUnit Application | mock OPC |

Mỗi repo: `docs/operational/*-STRUCTURE.md`, `.cursor/skills/*-base`, `.harness/progress.md`.

`team-projects.json` (repo root): group **`factory-ai-stack`** — `portal` · `fast-api-base` · `line` · `integration` (4 repo). [REPO-SPLIT-MAP](./REPO-SPLIT-MAP.md) · [PROJECT-MAPS](./PROJECT-MAPS.md).

---

## 18. Liên kết tài liệu portal

| Chủ đề | File |
|--------|------|
| FE layers (portal-base) | [ARCHITECTURE.md](./ARCHITECTURE.md) — sẽ cập nhật BE = fast |
| Wire phase | [WIRE-PHASE-DIAGRAM.md](./WIRE-PHASE-DIAGRAM.md) — target fast:4000 |
| Contract keys | [CONTRACT-FIELD-REGISTRY.md](./CONTRACT-FIELD-REGISTRY.md) |
| E2E testId | [E2E-TESTIDS.md](./E2E-TESTIDS.md) |
| Monorepo | [MONOREPO-STRATEGY.md](../dev-environment/MONOREPO-STRATEGY.md) |
| TODO triển khai fast | [fast-api-base-todo.txt](../../fast-api-base-todo.txt) |
| TODO line + integration | [dotnet-bases-todo.txt](../../dotnet-bases-todo.txt) |

---

## 19. Tóm một câu

**Bốn base tách repo:** `portal` + `fast` + `line` + `integration`. Portal-base = web; line-base = WinForms/HMI gọi fast; integration-base = fast gọi xuống PLC/MES. Không repo service deploy riêng để call API; `Services/` trong line là folder mỏng, không microservice.**
