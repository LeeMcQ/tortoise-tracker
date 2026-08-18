# Verification & Acceptance Test Plan

## Public workflow
- QR success, QR unsupported fallback, unknown QR.
- Manual ID lookup and unknown ID.
- Untagged observation.
- GPS permission accepted/denied/timeout.
- Accuracy at 10 m, 50 m, 100 m and above rejection threshold.
- Camera allowed/denied; JPEG/PNG/WebP; oversized/corrupt image.
- 1, 2 and 3 photos; image compression.
- Injury, shell damage, unusual behaviour and dead-animal escalation.
- English/Afrikaans route-by-route review.

## Offline
- Start online then lose coverage mid-form.
- Start offline from cached PWA.
- Queue sighting, close browser, reopen, reconnect and sync.
- Repeat retry of same `client_submission_id`; confirm one database row.
- Failed sync must remain queued.

## Security
- Anonymous cannot select raw observations/photos/health/telemetry.
- Public map contains no raw coordinates in network response.
- Public/Scientist/Administrator access-profile matrices.
- Admin AAL1 blocked from admin-only operations; AAL2 succeeds.
- Service-role key absent from browser/repository.
- Unsupported upload MIME/size rejected server-side.
- XSS strings in names/notes safely rendered.

## Accessibility
- Full keyboard navigation.
- Screen reader labels/forms/status messages.
- Visible focus.
- 200% zoom/reflow.
- Map information available as list.
- Reduced motion.

## Performance/resilience
- Low-end Android, current/older iPhone, tablet and desktop.
- LTE/slow/high-latency/offline profiles.
- Map lazy-load does not block sighting form.
- PWA update does not discard queued data.
