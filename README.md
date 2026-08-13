# Nautilus Bay Tortoise Tracker

Version-1 PWA prototype for identifying and recording tortoises in Nautilus Bay Nature Reserve.

## What is implemented

- Mobile-first PWA shell and install manifest
- English / Afrikaans language switch
- Public tortoise profiles with demo records
- Manual tortoise ID lookup
- Native browser QR scanning using `BarcodeDetector` where supported
- GPS location and accuracy capture
- Camera/gallery photo capture and client-side compression
- Visitor photo requirement
- Behaviour and condition classification
- Untagged tortoise reporting
- Persistent observation history (demo mode)
- Public map with latest location generalisation
- Clear warning that map lines are inferred connections, not actual travelled paths
- IndexedDB offline queue + reconnect synchronisation
- Idempotent `client_submission_id` architecture
- Staff demo login, dashboard, registry, sightings and QR page
- Supabase/PostgreSQL/PostGIS production schema
- Row Level Security design that blocks public access to raw observations
- Public-safe RPCs for profiles/history
- Supabase Edge Function skeleton for anonymous submissions
- Future `devices -> telemetry` schema

## Run locally

A secure HTTP origin is needed for camera, service workers and reliable geolocation. `localhost` is considered secure by modern browsers.

```bash
cd nautilus-tortoise-tracker
python3 -m http.server 8080
```

Then open:

`http://localhost:8080`

For testing from a phone on the same Wi-Fi network, camera/geolocation generally require HTTPS rather than a plain LAN HTTP address. Deploy the folder to Cloudflare Pages/GitHub Pages or use a trusted HTTPS development tunnel.

## Demo data

The prototype starts with T0047 (Shelly), T0128 (Atlas) and T0387 (Sandy). These are clearly synthetic demonstration records and should be deleted/replaced before operational use.

Use **Staff login** and select a demonstration role. This is UI-only demo authentication; production staff authentication must use Supabase Auth.

## Production deployment

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial.sql`.
3. Create a **private** Storage bucket named `sighting-photos`.
4. Deploy `supabase/functions/public-sighting`.
5. Add rate limiting / Cloudflare Turnstile before enabling anonymous public submission.
6. Create staff users in Supabase Auth and matching rows in `public.profiles`.
7. Update `config.js` with the Supabase URL and anon key and set `demoMode: false`.
8. Wire the front-end data calls to `supabase-client.js` (public RPCs + Edge Function). The adapter is included.
9. Deploy the static site to an HTTPS host, recommended subdomain: `tortoise.nautilusbayhoa.co.za`.
10. Add the reserve boundary later to `reserve_config.boundary` when KML/KMZ/GeoJSON is available.

## Security notes

- Do not expose a Supabase service-role key in browser code.
- Raw `observations`, health records, and telemetry are protected by RLS.
- Public map/profile reads should use only the security-definer public-safe functions.
- The latest public position is rounded in SQL, not merely hidden by the user interface.
- Public photo upload should go through a controlled server/Edge Function path; do not make the photo bucket broadly public-write/list/read.
- Add bot/rate protection and server-side MIME/size validation before launch.
- Review POPIA notices and retention periods before collecting visitor contact details. Version 1 intentionally does not require visitor accounts.

## Mapping note

Leaflet is loaded from a CDN and the prototype uses the standard OpenStreetMap tile endpoint. This is suitable for development/light testing only. Select an appropriate production tile provider or self-hosted solution before significant public usage, and do not bulk-prefetch standard OSM tiles for offline use.

## Recommended next engineering increment

- Wire demo data provider to Supabase adapter
- Add private photo upload path to Edge Function / signed URL flow
- Implement staff Supabase Auth session handling
- Add add/edit/archive tortoise forms
- Add review/verification workflow and email notification for injured tortoise flags
- Import actual reserve boundary
- Add automated browser tests for QR/GPS permission fallbacks and offline queue recovery
