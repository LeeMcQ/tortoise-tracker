# Expert Review Cycle 3 — Release Engineering, Localisation & PWA Assurance

Date: 2026-08-13

## Panel input

### Release / PWA engineer
- The current service worker deletes every cache on the `github.io` origin during activation. On GitHub Pages that could interfere with unrelated applications on the same user origin. Cache cleanup must be restricted to the Nautilus application prefix only.
- Do not force-activate a new worker silently. Present a clear update action, send `SKIP_WAITING` only when the user accepts, then reload after `controllerchange`.
- Use a new cache version for this release and network-first behaviour for navigation/configuration.

### Security / supply-chain specialist
- The map dependency is loaded from a CDN. Add Subresource Integrity hashes published by Leaflet for version 1.9.4.
- Keep CDN dependency pinned to an exact version.

### QA / localisation specialist
- The English/Afrikaans dictionaries drifted during earlier changes; add an automated parity test so every English key must exist in Afrikaans and vice versa.
- Translate all remaining public-facing headings/statuses, including GPS acquisition, QR errors, navigation labels, error pages and the footer.
- Fix duplicate directory links introduced during the previous iteration.

### Front-end reliability specialist
- Missing profile-image URLs currently resolve to a same-origin `/undefined` URL instead of the intended fallback illustration. Fix the URL guard.
- Map popups must respect the selected language.
- Add regression tests for translation-key parity and static PWA cache integrity.

## Implementation decision
All findings accepted for Cycle 3.
