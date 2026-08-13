# Requirements Traceability Matrix

| ID | Requirement | Implementation | Verification |
|---|---|---|---|
| FR-ID-001 | Identify registered animal by visible ID | `#/identify`, repository lookup | Functional test |
| FR-ID-002 | Identify by QR and retain QR provenance | QR scanner + `?source=qr` encoded in generated QR | Functional/field scan |
| FR-ID-003 | Report untagged animal without creating master animal | `#/untagged`, nullable animal ID | Functional test |
| FR-GPS-001 | Capture latitude/longitude and horizontal accuracy | Browser geolocation flow | Device test |
| FR-GPS-002 | Explain purpose before permission request | Step-1 location preamble | UX inspection |
| FR-GPS-003 | Reject extremely poor GPS by configurable threshold | `gpsRejectMetres` | Boundary test |
| FR-PHOTO-001 | Public sighting requires photo | Client + Edge Function validation | Functional/API test |
| FR-PHOTO-002 | Support 1–3 photos and client compression | Canvas compression | Device test |
| FR-SIGHT-001 | Preserve observed time separately from received time | DB schema | SQL inspection |
| FR-SIGHT-002 | Prevent duplicate reconnect submissions | UUID unique `client_submission_id` | Retry test |
| FR-SIGHT-003 | Raw observation cannot be updated/deleted | DB trigger/RLS | SQL security test |
| FR-SIGHT-004 | Corrections are append-only and auditable | corrections table/UI/audit | Functional + DB test |
| FR-QUAL-001 | Score observation quality | `quality.js` + DB field | Unit test |
| FR-REV-001 | Review as verified/questionable/rejected | review table/UI | Functional test |
| FR-OFF-001 | Capture without connectivity | IndexedDB queue | Offline field test |
| FR-OFF-002 | Sync automatically after reconnect | online event + sync queue | Offline/reconnect test |
| FR-MAP-001 | Show public map and history | lazy map module | Functional test |
| FR-MAP-002 | Public coordinates never expose raw protected point | database public RPCs | Network/security test |
| FR-MAP-003 | Generalise historical public positions | PostGIS snap-to-grid | SQL/unit test |
| FR-MAP-004 | Delay recent public locations | reserve config/public RPC | SQL test |
| FR-ACC-001 | Provide non-map equivalent | accessible observation list | Accessibility test |
| FR-LANG-001 | English/Afrikaans UI | central i18n module | Route review |
| FR-HEALTH-001 | Potential injury creates health workflow | ingest SQL + health cases | API test |
| FR-HEALTH-002 | Clinical case events preserve assessment/treatment | health event schema/UI | Functional test |
| FR-RES-001 | Measurements preserve unit/method/confidence/recorder | measurements schema/UI | Functional test |
| FR-IOT-001 | Device can be deployed to different animals over time | deployments table | Schema review |
| FR-IOT-002 | Telemetry references deployment, not permanent animal ID | telemetry schema | Schema review |
| FR-EXP-001 | CSV registry export | export module | Unit test |
| FR-EXP-002 | GeoJSON exact staff export | export module | Unit test |
| FR-EXP-003 | Movebank-style event export | export module | Unit test |
| SEC-001 | Anonymous cannot query raw observations | RLS/no public grants | Security test |
| SEC-002 | Admin operations require AAL2 | RLS helper + MFA login flow | Auth test |
| SEC-003 | Photos stored private | storage bucket/RLS | Storage test |
| SEC-004 | Browser never contains service-role key | architecture/CI secret check | CI + review |
| SEC-005 | Bot verification available server-side | Turnstile validation hook | API test |
| PRIV-001 | Public sightings require no PII | public form | UX/privacy review |
| PRIV-002 | Product analytics exclude coordinates/PII | analytics allow/block lists + DB constraint | Unit/API review |
| NFR-PERF-001 | Map does not block core app load | lazy map import | Performance test |
| NFR-PERF-002 | Capture Core Web Vitals telemetry | performance observers | Production measurement |
| NFR-A11Y-001 | Keyboard/focus/reduced motion support | CSS/semantic markup | WCAG audit |
| NFR-OPS-001 | Dev/staging/prod separation | deployment plan | Release audit |
| NFR-OPS-002 | CI runs syntax/integrity/unit tests | GitHub Actions workflow | CI run |
