# MVP Acceptance Test Checklist

## Public flow
- [ ] Home loads on mobile width without horizontal scrolling.
- [ ] T0047 opens from manual ID lookup.
- [ ] Unknown ID displays a clear error.
- [ ] QR scanner requests rear camera on a supported HTTPS browser.
- [ ] QR containing `/T0047` opens T0047.
- [ ] Sighting submission is blocked until GPS is captured.
- [ ] GPS accuracy in metres is shown.
- [ ] Accuracy above configured threshold is visually flagged.
- [ ] Visitor submission is blocked until a photograph is selected.
- [ ] Large image is compressed client-side.
- [ ] Submitted sighting creates a new historical record in demo mode.
- [ ] Untagged report creates an unassigned/pending sighting.

## Offline
- [ ] With network disabled, app shell still opens after first successful visit.
- [ ] Offline banner appears.
- [ ] A new sighting can be captured offline.
- [ ] Confirmation says saved offline.
- [ ] Queue survives page refresh.
- [ ] Reconnection triggers synchronization.
- [ ] Repeated synchronization does not duplicate same client_submission_id.

## Conservation security
- [ ] Public latest map point is rounded/generalised.
- [ ] Raw current coordinates are not available from public database SELECT policies.
- [ ] Older history follows configured exact/approximate/hidden setting.
- [ ] Veterinary/research notes are not exposed to anonymous users.

## Staff
- [ ] Staff dashboard requires staff session in production.
- [ ] Ranger/researcher can read exact authorised records.
- [ ] Admin can manage profiles/configuration.
- [ ] Public users cannot update/delete tortoise master data.

## PWA
- [ ] Manifest detected.
- [ ] Service worker registers on HTTPS/localhost.
- [ ] App can be installed to home screen on supported Android browser.
- [ ] English/Afrikaans switch persists across refresh.
