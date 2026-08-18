# V8 Production Regression Audit — Nautilus Bay Tortoise Tracker

Date: 18 August 2026  
Scope: exact V7 deployment package, screenshot evidence from the deployed QR screen, production Supabase adapter, public/staff routes, GIS/mapping, QR, animal/photo management, offline/PWA, role/authentication and scientific data-correction paths.

> This was a multidisciplinary engineering review by role (front-end/PWA, Supabase/backend, GIS/PostGIS, data governance, wildlife/research UX, cybersecurity/privacy and QA). It is not represented as an independent external penetration test or field trial.

## Executive result

The audit found several true regressions and integration defects. The most visible one in the supplied screenshot — the QR page stating that production must use the `qr-svg` Edge Function — was caused by V7 intentionally rendering a placeholder in demo mode instead of a QR. Several less visible defects would also have affected a real Supabase deployment. All items below are repaired in V8 unless explicitly marked as a deployment/field validation gate.

## Findings and repairs

| ID | Severity | Function | Root cause | V8 repair | Verification |
|---|---|---|---|---|---|
| PR-001 | Critical | QR creator in deployed demo | V7 deliberately opened an instructional placeholder instead of generating a QR | Real self-contained QR SVGs for demo; Admin production path calls `qr-svg`; open/print + download actions | Static QR decoding for T0047/T0128/T0387 |
| PR-002 | Critical | Production QR Edge Function | Missing CORS/OPTIONS handling for GitHub Pages cross-origin call | Added CORS preflight and authenticated Admin validation | Regression test + syntax/static audit |
| PR-003 | Critical | Public Supabase calls | Publishable key was also sent as `Authorization: Bearer`, which is not an Auth user JWT | `apikey` always; `Authorization` only when a valid signed-in session exists | Automated regression test |
| PR-004 | High | Individual tortoise movement map | Public profile/history fetch failures could leave an unusable/loading map; no map fallback | Explicit loading/empty/error states; local geographic SVG fallback if Leaflet/CDN unavailable | Automated regression test + served build |
| PR-005 | High | Demo movement history | Observation reviews were not applied to the effective demo record | Effective observation now applies latest review and cumulative corrections | Automated tests |
| PR-006 | High | Public observation release | Demo release logic did not require effective verification status | Public release now requires verified + delayed + generalised record | Privacy regression tests |
| PR-007 | High | Corrected production coordinates | SQL effective view used original coordinates even after a scientific correction | Migration 003 applies cumulative corrected lat/lng in effective/public map/history | Migration static audit + regression test |
| PR-008 | High | Scientist dashboard | Staff snapshot always queried admin-only `audit_log`; RLS denial could fail the entire Scientist workspace | Audit fetch is non-fatal for Scientist; Admin still receives audit data | Automated regression test |
| PR-009 | High | Animal/profile image management | No complete UI/API path to replace/remove profile images | Image preview, upload/change, remove; private Supabase storage through protected Edge Function | Automated regression test |
| PR-010 | High | Incorrect animal master data | Editor omitted several scientifically relevant correction fields/status controls | Edit name, species, sex, confidence, life stage, age, DOB, registration date, distinguishing features and status | Automated regression test |
| PR-011 | High | Staff sighting-photo review | Private sighting images existed but were not conveniently reviewable | Scientist/Admin protected photo gallery via `staff-photo` Edge Function | Static/API audit |
| PR-012 | Medium | GPS accuracy display | Staff UI expected `accuracy_m`; production effective view exposes `gps_accuracy_m` | Supports both fields | Static audit |
| PR-013 | Medium | Public privacy | Public history carried GPS accuracy unnecessarily | Migration 003 removes GPS accuracy from public history; public objects drop accuracy fields | SQL/privacy audit |
| PR-014 | Medium | QR target URL | Function fallback could point at a future/custom domain before it existed | Defaults to current GitHub Pages URL, overridden by `PUBLIC_SITE_URL` | Static audit |
| PR-015 | Medium | Edge Function deployment | Public vs protected JWT verification requirements were easy to deploy incorrectly | Added one deployment script with correct `--no-verify-jwt` split | Automated regression test |
| PR-016 | Medium | PWA stale deployment | V7 service-worker cache and local demo DB could preserve broken behaviour after files were replaced | V8 cache namespace + V8 demo storage key | Static/PWA QA |
| PR-017 | Medium | QR popup | Async QR generation could be blocked as a popup | Window opened synchronously, then populated after QR retrieval | Code audit |
| PR-018 | Medium | Administrator first login | Admin MFA was mandatory but there was no enrolment screen if no factor existed | Added TOTP enrolment QR/secret, challenge and verification flow; AAL2 remains mandatory | Automated regression test; Supabase staging validation required |
| PR-019 | Low | Demo Padloper taxon | Production seed did not include the demo Padloper taxon | Migration 003 adds `Homopus sp.` / Padloper | Migration review |
| PR-020 | Low | Movement deep-link | `?tab=movement` was not honoured consistently | Profile route now focuses/scrolls to movement section | Code audit |

## Functional audit matrix

### Public
- Home / Nautilus Bay nature content — PASS (code/static)
- Tortoise directory/search/filter — PASS
- Manual identification — PASS
- QR deep link provenance — PASS
- Individual animal profile — PASS
- Profile image / fallback image — PASS
- Individual movement/history map — PASS with local fallback; exact live tile service still requires network
- Public thematic map — PASS in code; live CDN/tile access requires deployment validation
- Insights/charts — PASS
- Public sighting wizard — PASS
- GPS capture/accuracy gate — PASS in code; physical-device validation remains required
- Photo capture/compression — PASS in code; physical-device validation remains required
- Offline queue/sync — PASS in code/tests; field validation remains required

### Scientist
- Dashboard — PASS after audit-log/RLS repair
- Animal list/edit — PASS
- Change/remove profile image — PASS
- Observation review/correction — PASS
- Review private sighting photos — PASS
- Health cases/clinical events — PASS in code
- Measurements — PASS in code
- Map Lab/thematic mapping — PASS in code
- KML/GeoJSON/CSV/Movebank exports — PASS automated tests
- Devices/deployments/telemetry views — PASS for implemented scope

### Administrator
- Scientist capability — PASS
- QR generation/open/print/download — PASS in demo; Supabase Edge Function staging validation required for production
- Audit — PASS for Admin
- MFA challenge — PASS in code
- MFA first-time enrolment — PASS in V8 code; Supabase staging validation required

## Database / Supabase changes

Run migrations in order:
1. `001_world_class.sql`
2. `002_consolidate_staff_roles.sql`
3. `003_production_regression_repairs.sql`

Migration 003 fixes effective corrected positions, public release/history/map behaviour, DOB support, Padloper taxon and public-list last-seen logic.

Deploy Edge Functions using `scripts/deploy_supabase_functions.ps1`. This deploys public endpoints without JWT gateway verification and protected staff/admin endpoints with JWT verification.

## Evidence collected

- 29/29 automated tests pass.
- Static asset and regression guard suite passes.
- T0047, T0128 and T0387 generated SVG QR codes were rendered and decoded back to their exact GitHub Pages deep links.
- Native staging bundle rebuild passes.
- HTTP-served checks return 200 for app shell, core JS, map module, QR SVG, service worker and manifest.

## Remaining release gates (not software defects)

The following cannot be honestly marked complete without the deployed Supabase project / physical devices:
- apply migration 003 to Supabase staging and then production;
- deploy all V8 Edge Functions and secrets;
- verify Admin TOTP enrolment and AAL2 against the actual Supabase tenant;
- test private image upload/retrieval against actual Storage/RLS;
- test Android/iPhone GPS, camera and offline recovery in the reserve;
- final live GitHub Pages cache/service-worker update validation;
- independent penetration test and field acceptance test.
