# Expert Recommendation Implementation Register

| # | Professional workstream | Implementation in V2 | Status |
|---|---|---|---|
| 1 | Herpetology | Taxon/animal/identifier separation; sex confidence, age method and identifying features supported in schema; measurement provenance added. Physical attachment method is gated. | Implemented + external approval gate |
| 2 | Wildlife veterinary | Health cases, severity, follow-up, outcome and detailed `health_case_events` clinical fields; injury/death sightings auto-open cases. | Implemented |
| 3 | Movement ecology | `animal → deployment → device → telemetry_event`; device is not permanent animal identity; Movebank-style event export. | Implemented |
| 4 | Conservation security | Exact public historical location removed. Public functions only emit verified, delayed, generalised points; raw coordinates remain staff-only. | Implemented |
| 5 | GIS/PostGIS | PostGIS points/zones, reserve boundary and management-zone model, spatial indexes, public spatial functions, GeoJSON export and lazy GIS map. | Implemented; real GIS layers still need import |
| 6 | Field ecology | Automated observation quality score and append-only review workflow; questionable records retained. | Implemented |
| 7 | Mobile UX | Five-stage flow, one-handed large controls, permission context, offline state, minimal typing, photo guidance. | Implemented |
| 8 | Accessibility | Skip link, keyboard-focus styles, semantic forms/fieldsets, accessible map list, reduced-motion handling and large targets. WCAG audit remains a release gate. | Implemented + audit gate |
| 9 | Visual/product design | Nautilus Bay coastal/fynbos visual system, storytelling profiles and non-corporate public UX. | Implemented |
| 10 | Conservation engagement | Citizen-science language, impact framing and explicit no-handle/no-feed/no-chase guidance. | Implemented |
| 11 | Front-end architecture | UI/features separated into domain services/modules; map lazy-loaded. The current deploy remains no-build ES modules instead of React to preserve direct GitHub Pages deployment and zero runtime package dependency. | Architecture implemented; React recommendation intentionally superseded |
| 12 | Backend/cloud | Supabase/PostgreSQL/PostGIS/Auth/Storage/Edge Functions and dev/staging/prod deployment model. | Implemented |
| 13 | Data architecture | Append-only observations, correction/review tables, audit log, provenance, identifiers, measurements and event model. | Implemented |
| 14 | Cybersecurity | RLS, admin AAL2 requirement, private storage, controlled upload, CSP, security headers, bot-verification hook, secret scan workflow. External penetration test remains mandatory. | Implemented + pen-test gate |
| 15 | POPIA/privacy | Anonymous public sightings, data minimisation, protected spatial data, no PII in UX analytics, PIIA template and privacy release gate. | Implemented + legal sign-off gate |
| 16 | DevSecOps/SRE | CI checks, staged-environment plan, service worker versioning, audit logs and recovery/monitoring requirements documented. | Implemented baseline |
| 17 | Performance | No-build app shell, lazy Leaflet loading, client image compression, spatial indexes and reduced external dependencies. Core Web Vitals must be measured on production traffic. | Implemented + measurement gate |
| 18 | QA/test automation | Node unit tests, static-asset integrity test, device/network/failure acceptance matrix. | Implemented baseline + field testing gate |
| 19 | Data science/CV | Multi-photo protocol, view-type and quality fields, human-reviewed future candidate matching architecture. No autonomous identity merge. | Data-readiness implemented; AI future phase |
| 20 | IoT/RF telemetry | Devices, deployments, sensor suite, firmware/battery metadata and telemetry event schema. Site RF/coverage study remains future work. | Implemented architecture + future field study |
| 21 | FAIR/research data | Data dictionary, provenance, CSV/GeoJSON/Movebank-style export and stable IDs. | Implemented |
| 22 | Language/content | Centralised English/Afrikaans UI strings; architecture allows additional language packs. | Implemented |
| 23 | Product analytics | Privacy-safe event allow-list; blocked coordinate/name/email/notes properties; server event table/function available. | Implemented |
| 24 | Systems assurance | Requirements/release-gate structure, implementation traceability and verification plan. | Implemented |
