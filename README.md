# Nautilus Bay Digital Conservation Platform V7 — Three Profiles + HOA Nature Integration

V7 preserves the adaptive app/web, GIS, analytics, offline and native-ready architecture while consolidating access to exactly three profiles — Public, Scientist and Administrator — and deepening the public About experience with reserve and nature information sourced from the Nautilus Bay HOA website. The requested Gallery_3 and Gallery_7 images are used for the Shelly and Atlas demonstration profiles.

See `docs/BRAND_INTEGRATION_REVIEW.md`, `docs/ADAPTIVE_EXPERT_REVIEW.md` and `docs/MOBILE_NATIVE_STRATEGY.md`.

Production-oriented upgrade of the Nautilus Bay Tortoise Tracker. The public experience remains a fast mobile PWA, while the protected backend is designed for research provenance, health-case management, spatial security, offline field capture and future telemetry.

## Run the working demo

No package installation is required.

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/#/`.

Three demo access profiles are available under **Staff**: **Public**, **Scientist** and **Administrator**. Public requires no sign-in. Scientist consolidates the former ranger, researcher and veterinarian workflows. All demo animal records are synthetic.

## Quality checks

```bash
npm run qa
```

The codebase has no runtime npm dependencies; map code is lazy-loaded only when a map is requested. Production Supabase Edge Functions use server-side dependencies in Deno.

## What V7 implements

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
- CSV, GeoJSON, OGC KML and Movebank-style event exports.
- Public thematic mapping for species, recency, density and observation points.
- Staff Spatial Analysis Lab for condition, quality, verification, recency and density mapping.
- GPS uncertainty circles, metric scale, straight-line measurement and filtered map exports.
- Public and staff Insights dashboards with accessible SVG charts and underlying data tables.
- Production Supabase/PostGIS schema with RLS and consolidated Scientist/Administrator protected roles.
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
2. Run all SQL migrations in `supabase/migrations/` in numeric order. `001_world_class.sql` defines the V7 baseline; `002_consolidate_staff_roles.sql` safely converts an existing V6 Ranger/Researcher/Veterinarian database to Scientist.
3. Deploy Edge Functions:
   - `public-sighting`
   - `health-alert`
   - `public-profile-photo`
   - `qr-svg`
   - `product-event` (optional telemetry ingestion)
4. Configure production secrets documented in `docs/DEPLOYMENT.md`.
5. Create protected Auth users and `public.profiles` rows using only `scientist` or `admin`. Public users remain anonymous.
6. Enrol MFA for every administrator before granting admin access.
7. Set `config.js` Supabase URL/publishable key and `demoMode:false`.
8. Import the reserve boundary and management layers into `reserve_zones`.
9. Complete all release gates in `docs/RELEASE_GATES.md`.

## V7 access model

- **Public** — no account required; identify animals, submit sightings, view conservation-safe profiles, maps and insights.
- **Scientist** — one protected scientific workspace combining field verification, GIS, health/clinical case management, measurements, deployments, telemetry review and research exports.
- **Administrator** — all Scientist capabilities plus QR, audit, user/system administration and MFA-protected privileged functions.

## Nautilus Bay About / nature content

The public About page now includes reserve facts and nature context drawn from the Nautilus Bay HOA website: 600 ha reserve, 400 ha of fynbos trails, 9 km of pristine beach access, location west of Mossel Bay, whales/dolphins, rich birdlife, small buck/other mammals, dunes and indigenous fynbos. A source note links back to the HOA About page.

The project no longer requires a top-level `assets/` folder for GitHub Pages deployment; local fallback tortoise artwork is stored under `icons/`.

## Important governance boundary

The software supports QR, visible IDs, PIT/RFID and future electronic devices, but it does **not** approve any physical marking or attachment method. Wildlife/veterinary approval is a mandatory release gate.

## Spatial Analytics and Insights

The platform includes two analytical surfaces:

- **Public Conservation Map / Insights:** conservation-safe thematic views generated from delayed/generalised public positions and aggregate observations.
- **Staff Map Lab / Insights:** exact authorised positions with advanced themes, temporal filters, GPS uncertainty, spatial measurement and research exports.

### Thematic map modes

Public: species, recency, density and observation points.  
Staff: species, condition, data quality, verification, recency, density and observation points.

### Research exports

- CSV animal registry
- CSV observations
- GeoJSON observations
- OGC KML observations
- KML with explicitly labelled inferred observation connections
- Movebank-style event CSV

KML point exports do not claim a route travelled. Any connection-line KML is explicitly labelled as an analytical connection between recorded observation positions.