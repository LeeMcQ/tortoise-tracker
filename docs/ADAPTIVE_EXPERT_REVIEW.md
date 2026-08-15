# Adaptive App/Web Expert Review — V5

## Mobile/PWA UX specialist
**Finding:** The previous responsive site still behaved like a website on phones. Core destinations required header/menu interaction and field controls did not occupy the thumb zone consistently.
**Implemented:** persistent bottom tabs, safe-area app bar, bottom-sheet overflow menu, compact mobile hero, sticky sighting actions, larger touch controls, installed-mode styling.

## Tablet UX specialist
**Finding:** Tablet widths should not simply stretch phone UI or prematurely become desktop navigation.
**Implemented:** app navigation remains through 1024 px, with a centred/floating tab bar on medium widths; cards and analysis remain multi-column where useful.

## Desktop product designer
**Finding:** Mobile patterns must not reduce desktop information density or professional navigation.
**Implemented:** desktop header navigation, staff side navigation, wide tables, dashboards and GIS analysis remain active above 1024 px; mobile tab/sheet UI is removed.

## Field ecologist
**Finding:** A sighting workflow should remain one-handed and stable outdoors without changing scientific fields.
**Implemented:** sticky Back/Next actions, larger controls, haptic success cues, compact steps and unchanged append-first scientific payloads.

## GIS specialist
**Finding:** Map functionality must not be lost to mobile simplification.
**Implemented:** the same thematic mapping/filter/export logic is preserved. Small screens gain larger viewport-relative map canvases; authorised data and public generalisation rules are unchanged.

## Accessibility specialist
**Finding:** App-like navigation must remain semantic and labelled rather than icon-only.
**Implemented:** bottom navigation is a real `nav`, each destination has visible text, active routes use `aria-current`, sheet controls are labelled, 48 px coarse-pointer targets are enforced, and list/table alternatives remain.

## Cybersecurity / POPIA specialist
**Finding:** Native packaging must never create a second trust model or expose privileged Supabase secrets.
**Implemented:** platform adaptation occurs above repository/API layers; the same RLS/Edge Function architecture remains. Capacitor/TWA guidance explicitly prohibits embedding service credentials.

## PWA/native architect
**Finding:** Browser APIs were directly scattered through UI code, increasing future native-wrapper cost.
**Implemented:** `src/platform.js` centralises camera, GPS, haptics, sharing, native back handling and display-mode detection. Capacitor staging configuration and a TWA Asset Links template are included.

## Performance engineer
**Finding:** Do not add a heavy UI framework solely to imitate a native app.
**Implemented:** adaptive behaviour remains CSS/vanilla JS and adds no runtime framework dependency.

## QA lead
**Finding:** Mobile, standalone and APK readiness need explicit regression controls.
**Implemented:** manifest/platform/native-readiness tests, static service-worker inclusion, translation parity checks, and existing scientific/export/privacy tests remain in the QA suite.
