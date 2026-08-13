# Operations, Monitoring & Recovery

## Operational metrics
Monitor at minimum:
- public submission success/failure rate;
- offline queue depth and sync success;
- photo upload errors;
- auth/MFA failures;
- Edge Function 4xx/5xx rates;
- database latency/storage growth;
- health-alert delivery failures;
- Core Web Vitals (LCP/CLS/INP-like event duration telemetry);
- client JavaScript error rate with privacy filtering.

## Alert classes
- **P1:** data loss/corruption, raw coordinate exposure, credential compromise, complete production outage.
- **P2:** public sighting submission unavailable, photo uploads failing, staff auth unavailable, health alert pipeline failing.
- **P3:** map/provider degradation, translation/UI defects, non-critical analytics failures.

## Backup/recovery
The database and private photo objects require separate recovery plans. Define and approve RPO/RTO before production. Run a restore exercise on staging at least annually and after major architecture changes.

Suggested initial targets for approval:
- Database RPO: 24 h or better.
- Operational RTO: 4 h or better.
- Photographs: versioned/object backup strategy appropriate to research retention policy.

## Change control
All production changes should pass pull request review, automated QA, staging validation and named release approval. Database migrations are immutable after production application; create a new migration for changes.
