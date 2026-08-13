# Scientific Data Dictionary — Key Entities

| Entity | Purpose | Key provenance/security notes |
|---|---|---|
| `taxa` | Scientific/common taxonomy | Research/admin maintained |
| `animals` | Permanent individual animal record | Stable UUID + human public ID |
| `animal_identifiers` | QR/visible/RFID/PIT/natural/device identifiers | Identifiers can be retired without deleting animal history |
| `observations` | Raw field observation | Append-only; exact PostGIS point; client idempotency key |
| `observation_corrections` | Scientific correction overlay | Original record is not overwritten |
| `observation_reviews` | Verification decisions | Review history retained |
| `photos` | Controlled image metadata | Private object storage; view/quality/people flags |
| `measurements` | Mass/shell/body measurements | Value + unit + method + confidence + recorder |
| `health_cases` | Triage/case ownership | Restricted to staff roles |
| `health_case_events` | Assessment/treatment/follow-up | Veterinary detail; restricted |
| `devices` | Physical electronic tag/tracker inventory | Device identity is not animal identity |
| `deployments` | Time-bounded animal-device association | Supports device replacement/reuse |
| `telemetry_events` | Machine sensor events | Preserves deployment/source/time/payload |
| `reserve_zones` | Boundary/habitat/restricted layers | Sensitivity classification + spatial index |
| `audit_log` | Administrative/scientific provenance | Admin/AAL2 read |
| `product_events` | UX reliability metrics | Schema rejects obvious PII/spatial keys |
