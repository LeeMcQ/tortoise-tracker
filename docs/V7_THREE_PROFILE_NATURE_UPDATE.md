# V7 Three-Profile and Nautilus Bay Nature Update

## Access profiles

1. **Public** — anonymous public-facing conservation experience.
2. **Scientist** — consolidated Ranger + Researcher + Veterinarian operational profile.
3. **Administrator** — Scientist capabilities plus privileged administration; MFA/AAL2 remains mandatory for admin in production.

The frontend normalises any legacy V6 Ranger/Researcher/Veterinarian session to Scientist. `002_consolidate_staff_roles.sql` updates an existing V6 database and recreates role-sensitive RLS policies.

## Requested image changes

- Shelly / Leopard demo profile: `https://nautilusbayhoa.co.za/wp-content/uploads/2017/10/Gallery_3.jpg`
- Atlas / Angulate demo profile: `https://nautilusbayhoa.co.za/wp-content/uploads/2017/10/Gallery_7.jpg`

Approved HOA-hosted images are allowed by the image sanitiser and page CSP. Production animal profile photographs still use the existing private Supabase photo pathway where applicable.

## About / nature content

The public About page now summarises information published by the Nautilus Bay HOA website, including the reserve's 600 ha extent, 400 ha of fynbos walking landscape, 9 km of pristine beach access, Garden Route / Mossel Bay setting, whales and dolphins, rich birdlife, small buck/other mammals, dunes and indigenous fynbos.

The UI explicitly labels this information as HOA-sourced reserve context so it is not confused with the platform's separately governed scientific animal records.

## GitHub Pages upload simplification

There is no longer a top-level `assets/` folder. Remaining local fallback tortoise SVGs are under `icons/`, which also keeps service-worker and native staging paths simple.
