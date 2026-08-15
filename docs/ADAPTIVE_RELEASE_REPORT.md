# V5 Adaptive App/Web Release Report

## Objective
Make the same Nautilus Bay conservation platform feel like an installed application on phone/tablet while remaining a conventional professional website on desktop and reducing future Android APK conversion cost.

## Implemented interface behaviour
### Phone / small tablet
- Compact sticky app bar.
- Persistent bottom tab navigation for high-frequency destinations.
- Bottom-sheet overflow navigation.
- Safe-area support for notches and gesture bars.
- Thumb-sized controls and sticky sighting actions.
- Compact home hero and app-like content rhythm.
- Maps use viewport-relative height without removing accessible lists.
- Native/Web Share on animal profiles where supported.
- Haptic feedback for navigation, QR success and GPS success where supported.

### Medium tablet
- App navigation retained through 1024 px.
- Centred/floating tab bar and bottom sheet.
- Two-column information structures retained where useful.
- Full spatial-analysis functionality remains available.

### Desktop
- Conventional header navigation.
- Full-width professional sections and dashboards.
- Staff sidebar navigation.
- Dense data tables and GIS analysis preserved.
- No fixed mobile tab bar or mobile bottom sheet.

## PWA / installed application
- `standalone` display mode with `minimal-ui` fallback.
- PWA app shortcuts to Identify, Report and Map.
- Launch handler prefers an existing application window.
- Android/iOS mobile-web-app metadata and safe-area styling.
- Service worker remains for web/PWA but is skipped in a future native wrapper, where application assets are bundled locally.

## Future APK readiness
- Device-specific capabilities consolidated in `src/platform.js`.
- Capacitor config and reproducible `dist-native` staging included.
- Trusted Web Activity Asset Links template included as an alternative packaging route.
- Native back handling integration point included.
- Security architecture remains the existing Supabase/RLS/Edge Function model.

## Expert operational impact
| Discipline | Effect | Decision |
|---|---|---|
| Field ecology | Less thumb travel and fewer navigation context switches | Approved |
| GIS | No loss of thematic mapping/filter/export capability | Approved |
| Research | Same provenance and exports on all form factors | Approved |
| Wildlife health | Same health-case actions; mobile controls enlarged | Approved |
| Accessibility | Visible labels retained with icons; 48 px coarse-pointer targets | Approved subject to real-device audit |
| Security/POPIA | No new privileged client trust or additional database | Approved subject to production security gates |
| Desktop UX | Information density and conventional web navigation preserved | Approved |
| PWA architecture | Standalone install experience improved without desktop titlebar overlay complexity | Approved |
| Native architecture | Capacitor primary route; TWA viable alternative | Approved for future implementation |
| QA | Added automated adaptive/native-readiness regression coverage | Approved; real-device field testing remains required |

## Remaining real-device release gates
- Android Chrome installed-PWA test.
- Samsung Internet/browser test as applicable.
- iPhone Safari/Add-to-Home-Screen test.
- iPad portrait/landscape test.
- Android tablet portrait/landscape test.
- Virtual keyboard/rotation testing during a sighting.
- Camera and GPS permission-denial/recovery tests.
- Offline queue test across app termination/relaunch.
- If APK is produced: signed build, App Links/TWA verification as applicable, native permissions, store compliance and penetration testing.
