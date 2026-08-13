# Nautilus Bay Digital Conservation Platform — V2

Production-oriented upgrade of the Nautilus Bay Tortoise Tracker. The public experience remains a fast mobile PWA, while the protected backend is designed for research provenance, health-case management, spatial security, offline field capture and future telemetry.

## Run the working demo

No package installation is required.

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/#/`.

Demo staff roles are available under **Staff**. All demo animal records are synthetic.

## Quality checks

```bash
npm run qa
```

The codebase has no runtime npm dependencies; map code is lazy-loaded only when a map is requested. Production Supabase Edge Functions use server-side dependencies in Deno.

## What V2 implements

- Five-step public sighting flow with a GPS permission explanation before requesting location.
- QR/manual/untagged identification provenance.
- GPS accuracy capture and configurable rejection threshold.
- 1–3 client-compressed photographs with privacy/safe-observation guidance.
- Observation quality scoring.
- Full English/Afrikaans UI string system.
- Offline IndexedDB queue and duplicate-resistant client submission IDs.
- Accessible sighting lists as an alternative to maps.
- Public map locations are verified, delayed and spatially generalised.
- Append-only raw observations with separate corrections and reviews.
- Animal/taxon/identifier model.
- Measurements with units, method, confidence and recorder provenance.
- Health cases with severity, follow-up and event-ready clinical schema.
- Device/tag deployments separated from animals and telemetry events.
- CSV, GeoJSON and Movebank-style event exports.
- Production Supabase/PostGIS schema with RLS.
- Admin MFA/AAL2 enforcement in RLS and login challenge flow.
- Private photo storage and controlled anonymous upload Edge Function.
- Optional Cloudflare Turnstile verification plus server-side validation hook.
- Potential injury/death observations auto-create health cases and can trigger email alerts.
- Self-hosted QR SVG generation Edge Function.
- Privacy-safe product event model that rejects coordinate/name/email/note fields.
- Audit log, CI checks, security headers file and formal release gates.

## GitHub Pages deployment

The project is deliberately no-build so it can be copied directly into the existing `tortoise-tracker` repository. `config.js` currently points QR links at:

`https://leemcq.github.io/tortoise-tracker`

When the final subdomain is live, change `siteUrl` to `https://tortoise.nautilusbayhoa.co.za`.

## Production backend

1. Create separate **development**, **staging** and **production** Supabase projects.
2. Run `supabase/migrations/001_world_class.sql` on a fresh project.
3. Deploy Edge Functions:
   - `public-sighting`
   - `health-alert`
   - `qr-svg`
   - `product-event` (optional telemetry ingestion)
4. Configure production secrets documented in `docs/DEPLOYMENT.md`.
5. Create staff Auth users and `public.profiles` rows.
6. Enrol MFA for every administrator before granting admin access.
7. Set `config.js` Supabase URL/publishable key and `demoMode:false`.
8. Import the reserve boundary and management layers into `reserve_zones`.
9. Complete all release gates in `docs/RELEASE_GATES.md`.

## Important governance boundary

The software supports QR, visible IDs, PIT/RFID and future electronic devices, but it does **not** approve any physical marking or attachment method. Wildlife/veterinary approval is a mandatory release gate.
