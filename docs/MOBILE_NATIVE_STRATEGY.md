# Mobile, Tablet, Desktop and Future Android Strategy

## Decision
Maintain one web codebase and one scientific data/API model. Adapt presentation and device capabilities by platform rather than forking mobile and desktop applications.

## Current mobile/tablet presentation
- Persistent five-destination bottom navigation at touch-oriented widths up to 1024 px.
- Safe-area aware top app bar and bottom navigation for notches/home indicators.
- Bottom-sheet overflow navigation rather than a desktop hamburger menu.
- Larger touch targets, sticky field workflow actions, compact public hero and touch-friendly forms.
- Mobile maps use more of the available viewport while retaining accessible list/table alternatives.
- Installed PWA/standalone mode receives the same app shell without normal browser URL chrome. Desktop Window Controls Overlay is intentionally not enabled; the desktop web experience remains conventional and predictable.

## Current desktop presentation
- Desktop navigation remains across the header above 1024 px.
- Staff side navigation, wide map analysis, tables and multi-column dashboards remain desktop-first.
- The fixed mobile tab bar and bottom sheet are not rendered as desktop navigation.

## Platform adapter
`src/platform.js` owns camera-stream access, geolocation, haptics, sharing, native back-button integration and display-mode detection. Browser APIs are the default. A future native wrapper can provide Capacitor plugins without rewriting domain, repository, offline, GIS or scientific modules.

## Recommended Android APK route: Capacitor
1. `npm run native:stage`
2. Install Capacitor when native packaging begins:
   `npm install @capacitor/cli @capacitor/core @capacitor/android`
3. `npx cap add android`
4. `npx cap sync android`
5. Configure Android permissions/plugins and build/sign using Android Studio/CI.

Use native plugins only where they add value (Camera, Geolocation, Haptics, Share, App lifecycle). Keep Supabase service/secret credentials backend-only; the APK uses the same public client/API security model as the PWA.

## Alternative Android route: Trusted Web Activity
If no substantial native SDK integration is required, use Bubblewrap/PWA Builder to package the production PWA as a Trusted Web Activity. Publish the production signing certificate association at `/.well-known/assetlinks.json` using the template supplied in this repository. TWA verification requires the website and Android application to prove the same developer relationship.

## Deep-link and routing compatibility
Public QR links remain HTTPS/hash routes (for example `/#/t/T0047?source=qr`). This works in the browser/PWA today and can be handed to an Android wrapper later. Do not introduce APK-only identifiers into scientific records.

## Native release gates
- Android package ID and signing-key custody approved.
- Production hostname stable and HTTPS.
- Digital Asset Links completed if TWA/App Links are used.
- Android Camera/Location permissions tested on supported OS versions.
- Offline queue survives lifecycle interruption and process restart.
- Native back navigation tested on all primary routes.
- Security/POPIA controls remain identical to web production.
