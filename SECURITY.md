# Security Policy

## Production principles
- Least privilege and Supabase RLS are mandatory.
- Raw animal coordinates, health records and telemetry are never public tables.
- Administrator privileges require an AAL2/MFA session.
- `SUPABASE_SERVICE_ROLE_KEY`, email API keys and bot-verification secrets are server-only.
- Anonymous photo uploads pass through the validated `public-sighting` Edge Function into a private bucket.
- Observation records are append-only; administrative correction is auditable.

## Vulnerability reporting
Before public launch, designate the reserve's security contact and publish a responsible-disclosure route. Do not use a public issue containing animal locations, personal data, credentials or exploit details.

## Release requirement
A qualified independent penetration test must be completed against the staging/production-equivalent environment before operational launch, and all critical/high findings must be remediated or formally risk-accepted by the responsible owner.
