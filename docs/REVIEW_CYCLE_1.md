# Expert Review Cycle 1 — Functional Safety, Accessibility & Reliability

Date: 2026-08-13

## Panel input

### Mobile UX / field researcher
- Convert the sighting form into a true sequential wizard rather than displaying all steps simultaneously.
- Prevent progression until GPS is captured and at least one photo is available.
- Keep the final submit button only on the review step.
- Preserve an interrupted sighting draft on-device.

### Accessibility specialist
- Add correct `aria-current` state to navigation.
- Make modal dialogs use native modal behaviour, restore focus on close, and trap focus within the dialog.
- Update the document title per route and move focus to the page heading after navigation.
- Ensure progress state exposes `aria-current="step"`.

### Security architect
- Prefer session-scoped storage for staff authentication tokens instead of persistent local storage.
- Refresh expired Supabase sessions and retry one failed authorised request.
- Never retry or queue bot-verification tokens; they must be reacquired when synchronising.

### Reliability / offline engineer
- Use a stable client submission UUID for the whole sighting session, rather than regenerating IDs during quality-preview calculations.
- Save the structured form draft locally (without photos or precise coordinates in localStorage) and clear it only after successful/queued submission.
- Make offline sync error reporting distinguish queued work from successful synchronisation.

## Implementation decision
All findings accepted for Cycle 1.
