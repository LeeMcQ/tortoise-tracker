# Architecture

## Public path

`Browser PWA → controlled public RPC / public-sighting Edge Function → PostgreSQL/PostGIS + private Storage`

Approved animal profile images remain in the private Storage bucket and are exposed only through the `public-profile-photo` Edge Function after checking that the image is the active animal's designated profile photograph.

The public client never queries the raw observation table. Public spatial RPCs return only observations that are verified, outside the configured recent-location delay and spatially generalised by the database.

## Scientific domain

`Taxon → Animal → Identifier`

`Animal → Observation → Photos`

`Observation → Review(s)`

`Observation → Correction(s)`

`Animal → Measurement(s)`

`Observation/Animal → Health Case → Health Case Event(s)`

`Animal + Device → Deployment → Telemetry Event(s)`

The deployment is the time-bounded association between device and animal.

## Offline path

`Field form → IndexedDB pending queue → reconnect → idempotent Edge Function upload`

`client_submission_id` is generated before upload and is unique in the database, preventing duplicate records during retry/reconnect.

## Spatial-security defaults

- Latest public position generalisation: 500 m
- Historical public generalisation: 250 m
- Public release delay: 24 h
- Staff/research raw coordinates: exact subject to role

These values are configurable without changing the scientific record.
