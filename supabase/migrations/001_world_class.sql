-- Nautilus Bay Digital Conservation Platform
-- Fresh production schema: PostgreSQL + PostGIS + Supabase Auth/RLS
-- Run in a new Supabase project. Do not mix with the prototype migration without a reviewed data migration.

create extension if not exists pgcrypto;
create extension if not exists postgis with schema extensions;

create type public.app_role as enum ('ranger','researcher','veterinarian','admin');
create type public.sex_type as enum ('unknown','female','male');
create type public.verification_status as enum ('pending','verified','questionable','rejected');
create type public.identifier_type as enum ('visible_id','qr','rfid','pit','natural','device');
create type public.health_status as enum ('open','monitoring','closed');
create type public.severity_type as enum ('low','moderate','high','critical');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.app_role not null,
  organisation text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reserve_config (
  id boolean primary key default true check (id=true),
  reserve_name text not null default 'Nautilus Bay Nature Reserve',
  public_latest_generalisation_m integer not null default 500 check (public_latest_generalisation_m between 50 and 10000),
  public_history_generalisation_m integer not null default 250 check (public_history_generalisation_m between 50 and 10000),
  public_latest_delay_hours integer not null default 24 check (public_latest_delay_hours between 0 and 8760),
  gps_warning_m numeric(8,2) not null default 50,
  gps_reject_m numeric(8,2) not null default 250,
  movement_flag_m_per_hour numeric(10,2) not null default 500,
  public_languages text[] not null default array['en','af'],
  anonymous_public_sightings boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.reserve_config(id) values(true) on conflict do nothing;

create table public.reserve_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  zone_type text not null check (zone_type in ('reserve_boundary','habitat','management','restricted','road','trail','water','fire','other')),
  sensitivity text not null default 'restricted' check (sensitivity in ('public','sensitive','restricted','highly_restricted')),
  geometry extensions.geography(geometry,4326) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reserve_zones_geometry_gix on public.reserve_zones using gist(geometry);

create table public.taxa (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null unique,
  common_name_en text,
  common_name_af text,
  conservation_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.animals (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique check (public_id ~ '^T[0-9]{3,8}$'),
  name text,
  taxon_id uuid references public.taxa(id),
  sex public.sex_type not null default 'unknown',
  sex_confidence text check (sex_confidence in ('unknown','low','medium','high','confirmed')),
  life_stage text check (life_stage in ('unknown','hatchling','juvenile','subadult','adult')),
  estimated_age_years numeric(6,2) check (estimated_age_years is null or estimated_age_years >= 0),
  age_estimation_method text,
  identifying_features text,
  registration_date date not null default current_date,
  registration_location extensions.geography(point,4326),
  status text not null default 'active' check (status in ('active','archived','deceased','missing')),
  profile_photo_id uuid,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index animals_taxon_idx on public.animals(taxon_id);
create index animals_registration_location_gix on public.animals using gist(registration_location);

create table public.animal_identifiers (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete cascade,
  identifier_type public.identifier_type not null,
  value text not null,
  issued_at timestamptz not null default now(),
  retired_at timestamptz,
  active boolean not null default true,
  attachment_or_marking_method text,
  metadata jsonb not null default '{}'::jsonb,
  unique(identifier_type,value)
);
create index animal_identifiers_animal_idx on public.animal_identifiers(animal_id);

create table public.observations (
  id uuid primary key default gen_random_uuid(),
  client_submission_id uuid not null unique,
  animal_id uuid references public.animals(id),
  reported_identifier text,
  observed_at timestamptz not null,
  received_at timestamptz not null default now(),
  location extensions.geography(point,4326) not null,
  gps_accuracy_m numeric(9,2) not null check (gps_accuracy_m >= 0),
  identification_method text not null check (identification_method in ('qr','manual','untagged','natural','rfid','device')),
  identification_confidence text not null default 'certain' check (identification_confidence in ('certain','probable','uncertain')),
  possible_species text,
  behaviour text,
  condition text,
  notes text check (char_length(notes) <= 2000),
  observer_type text not null default 'visitor' check (observer_type in ('visitor','ranger','researcher','veterinarian','admin','device_import')),
  observer_user_id uuid references auth.users(id),
  quality_score integer not null check (quality_score between 0 and 100),
  verification_status public.verification_status not null default 'pending',
  inside_reserve boolean,
  spatial_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index observations_animal_time_idx on public.observations(animal_id,observed_at desc);
create index observations_location_gix on public.observations using gist(location);
create index observations_review_idx on public.observations(verification_status,observed_at desc);

create table public.observation_corrections (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.observations(id) on delete restrict,
  changes jsonb not null check (jsonb_typeof(changes)='object'),
  reason text not null check (char_length(reason) >= 5),
  corrected_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index observation_corrections_obs_idx on public.observation_corrections(observation_id,created_at desc);

create table public.observation_reviews (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references public.observations(id) on delete restrict,
  status public.verification_status not null,
  reason text not null,
  reviewer_user_id uuid references auth.users(id),
  reviewed_at timestamptz not null default now()
);
create index observation_reviews_obs_idx on public.observation_reviews(observation_id,reviewed_at desc);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid references public.observations(id) on delete restrict,
  animal_id uuid references public.animals(id) on delete set null,
  storage_path text not null unique,
  thumbnail_path text,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  byte_size bigint not null check (byte_size > 0),
  width integer,
  height integer,
  captured_at timestamptz,
  view_type text check (view_type in ('unknown','dorsal','left_lateral','right_lateral','anterior','posterior','injury_detail')),
  photo_quality text check (photo_quality in ('unknown','poor','usable','good','excellent')),
  contains_people boolean not null default false,
  exif_retained boolean not null default false,
  created_at timestamptz not null default now()
);
create index photos_observation_idx on public.photos(observation_id);
create index photos_animal_idx on public.photos(animal_id);
alter table public.animals add constraint animals_profile_photo_fk foreign key(profile_photo_id) references public.photos(id) on delete set null;

create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete restrict,
  measured_at timestamptz not null,
  measurement_type text not null check (measurement_type in ('mass','straight_carapace_length','carapace_width','plastron_length','body_condition','other')),
  value numeric not null,
  unit text not null,
  method text not null,
  confidence text not null check (confidence in ('low','medium','high','confirmed')),
  instrument_id text,
  recorded_by uuid references auth.users(id),
  notes text,
  created_at timestamptz not null default now()
);
create index measurements_animal_time_idx on public.measurements(animal_id,measured_at desc);

create table public.health_cases (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid references public.animals(id) on delete restrict,
  source_observation_id uuid references public.observations(id) on delete restrict,
  opened_at timestamptz not null default now(),
  severity public.severity_type not null default 'moderate',
  status public.health_status not null default 'open',
  summary text not null,
  assigned_to uuid references auth.users(id),
  assigned_team text,
  follow_up_date date,
  outcome text,
  closed_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index health_cases_status_idx on public.health_cases(status,severity,opened_at desc);

create table public.health_case_events (
  id uuid primary key default gen_random_uuid(),
  health_case_id uuid not null references public.health_cases(id) on delete restrict,
  event_at timestamptz not null default now(),
  event_type text not null check (event_type in ('triage','assessment','treatment','referral','follow_up','status_change','note')),
  injury_type text,
  body_location text,
  shell_fracture boolean,
  mobility text,
  body_condition text,
  clinical_notes text,
  treatment text,
  actor_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index health_case_events_case_idx on public.health_case_events(health_case_id,event_at desc);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  external_device_id text not null unique,
  device_type text not null,
  technology text,
  manufacturer text,
  model text,
  serial_number text,
  firmware text,
  battery_chemistry text,
  sensor_suite jsonb not null default '[]'::jsonb,
  status text not null default 'available' check (status in ('available','deployed','maintenance','retired','lost')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deployments (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals(id) on delete restrict,
  device_id uuid not null references public.devices(id) on delete restrict,
  deployed_at timestamptz not null,
  removed_at timestamptz,
  attachment_method text,
  approved_protocol_reference text,
  deployed_by uuid references auth.users(id),
  removal_reason text,
  status text not null default 'active' check (status in ('planned','active','closed','failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (removed_at is null or removed_at >= deployed_at)
);
create index deployments_animal_idx on public.deployments(animal_id,deployed_at desc);
create index deployments_device_idx on public.deployments(device_id,deployed_at desc);

create table public.telemetry_events (
  id bigint generated always as identity primary key,
  deployment_id uuid not null references public.deployments(id) on delete restrict,
  recorded_at timestamptz not null,
  received_at timestamptz not null default now(),
  location extensions.geography(point,4326),
  horizontal_accuracy_m numeric,
  battery_percent numeric(5,2),
  sensor_type text not null,
  payload jsonb not null default '{}'::jsonb
);
create index telemetry_deployment_time_idx on public.telemetry_events(deployment_id,recorded_at desc);
create index telemetry_location_gix on public.telemetry_events using gist(location);

create table public.product_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  occurred_at timestamptz not null default now(),
  anonymous_session_hash text,
  properties jsonb not null default '{}'::jsonb,
  constraint product_events_no_obvious_coordinates check (
    not (properties ?| array['lat','lng','latitude','longitude','email','name','notes'])
  )
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  occurred_at timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log(entity_type,entity_id,occurred_at desc);

-- ---------- helpers ----------
create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where user_id=auth.uid() and active=true;
$$;

create or replace function public.is_aal2()
returns boolean language sql stable as $$
  select coalesce((auth.jwt()->>'aal')='aal2',false);
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where user_id=auth.uid() and active=true);
$$;

create or replace function public.generalise_location(p extensions.geography, p_metres integer)
returns extensions.geometry
language sql immutable strict set search_path=public,extensions as $$
  select st_transform(st_snaptogrid(st_transform(p::geometry,3857),p_metres::double precision),4326);
$$;

-- Raw observations are append-only. Scientific corrections live in observation_corrections.
create or replace function public.prevent_observation_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Observations are immutable. Append a correction/review record instead.';
end $$;
create trigger observations_immutable before update or delete on public.observations for each row execute function public.prevent_observation_mutation();

-- Latest review and correction are projected into a staff-only effective view.
create or replace view public.observations_effective with (security_invoker=true) as
select
  o.id,o.client_submission_id,o.animal_id,a.public_id,o.reported_identifier,
  coalesce((c.changes->>'observed_at')::timestamptz,o.observed_at) as observed_at,
  o.received_at,o.location,st_y(o.location::geometry) as lat,st_x(o.location::geometry) as lng,
  coalesce((c.changes->>'gps_accuracy_m')::numeric,o.gps_accuracy_m) as gps_accuracy_m,
  o.identification_method,o.identification_confidence,o.possible_species,
  coalesce(c.changes->>'behaviour',o.behaviour) as behaviour,
  coalesce(c.changes->>'condition',o.condition) as condition,
  coalesce(c.changes->>'notes',o.notes) as notes,
  o.observer_type,o.observer_user_id,o.quality_score,
  coalesce(r.status,o.verification_status) as verification_status,
  o.inside_reserve,o.spatial_flags,o.created_at,
  c.id as latest_correction_id,r.id as latest_review_id
from public.observations o
left join public.animals a on a.id=o.animal_id
left join lateral (select * from public.observation_corrections x where x.observation_id=o.id order by x.created_at desc limit 1) c on true
left join lateral (select * from public.observation_reviews x where x.observation_id=o.id order by x.reviewed_at desc limit 1) r on true;

-- ---------- public-safe functions: no raw exact coordinates ----------
create or replace function public.list_public_animals()
returns table(public_id text,name text,scientific_name text,common_name_en text,common_name_af text,conservation_status text,sex public.sex_type,life_stage text,estimated_age_years numeric,identifying_features text,profile_photo_id uuid,last_observed_at timestamptz)
language sql stable security definer set search_path=public,extensions as $$
  select a.public_id,a.name,t.scientific_name,t.common_name_en,t.common_name_af,t.conservation_status,a.sex,a.life_stage,a.estimated_age_years,a.identifying_features,a.profile_photo_id,
    (select max(coalesce((co.changes->>'observed_at')::timestamptz,o.observed_at)) from public.observations o
     left join lateral (select status from public.observation_reviews r where r.observation_id=o.id order by r.reviewed_at desc limit 1) rv on true
     left join lateral (select changes from public.observation_corrections c where c.observation_id=o.id order by c.created_at desc limit 1) co on true
     where o.animal_id=a.id and coalesce(rv.status,o.verification_status)='verified'
       and coalesce((co.changes->>'observed_at')::timestamptz,o.observed_at) <= now() - make_interval(hours => (select public_latest_delay_hours from public.reserve_config where id=true)))
  from public.animals a left join public.taxa t on t.id=a.taxon_id
  where a.status='active' order by a.public_id;
$$;

create or replace function public.get_public_animal(p_public_id text)
returns table(public_id text,name text,scientific_name text,common_name_en text,common_name_af text,conservation_status text,sex public.sex_type,life_stage text,estimated_age_years numeric,identifying_features text,profile_photo_id uuid,last_observed_at timestamptz)
language sql stable security definer set search_path=public,extensions as $$
  select * from public.list_public_animals() where public_id=upper(p_public_id) limit 1;
$$;

create or replace function public.get_public_history(p_public_id text)
returns table(observation_id uuid,public_id text,observed_at timestamptz,lat double precision,lng double precision,gps_accuracy_m numeric,behaviour text,condition text,quality_score integer,location_generalised boolean,generalisation_metres integer)
language sql stable security definer set search_path=public,extensions as $$
  with cfg as (select * from public.reserve_config where id=true),
  base as (
    select o.id,o.animal_id,a.public_id,
      coalesce((co.changes->>'observed_at')::timestamptz,o.observed_at) observed_at,
      o.location,
      coalesce((co.changes->>'gps_accuracy_m')::numeric,o.gps_accuracy_m) gps_accuracy_m,
      coalesce(co.changes->>'behaviour',o.behaviour) behaviour,
      coalesce(co.changes->>'condition',o.condition) condition,
      o.quality_score,
      coalesce(rv.status,o.verification_status) effective_status
    from public.observations o join public.animals a on a.id=o.animal_id
    left join lateral (select status from public.observation_reviews r where r.observation_id=o.id order by r.reviewed_at desc limit 1) rv on true
    left join lateral (select changes from public.observation_corrections c where c.observation_id=o.id order by c.created_at desc limit 1) co on true
    where a.public_id=upper(p_public_id)
  ), rel as (
    select b.*,public.generalise_location(b.location,cfg.public_history_generalisation_m) g,cfg.public_history_generalisation_m m
    from base b cross join cfg
    where b.effective_status='verified'
      and b.observed_at <= now() - make_interval(hours => cfg.public_latest_delay_hours)
  )
  select id,public_id,observed_at,st_y(g),st_x(g),gps_accuracy_m,behaviour,condition,quality_score,true,m from rel order by observed_at;
$$;

create or replace function public.get_public_map()
returns table(observation_id uuid,public_id text,name text,observed_at timestamptz,lat double precision,lng double precision,behaviour text,condition text,location_generalised boolean,generalisation_metres integer)
language sql stable security definer set search_path=public,extensions as $$
  with cfg as (select * from public.reserve_config where id=true),
  base as (
    select o.id,o.animal_id,a.public_id,a.name,
      coalesce((co.changes->>'observed_at')::timestamptz,o.observed_at) observed_at,
      o.location,
      coalesce(co.changes->>'behaviour',o.behaviour) behaviour,
      coalesce(co.changes->>'condition',o.condition) condition,
      coalesce(rv.status,o.verification_status) effective_status
    from public.observations o join public.animals a on a.id=o.animal_id
    left join lateral (select status from public.observation_reviews r where r.observation_id=o.id order by r.reviewed_at desc limit 1) rv on true
    left join lateral (select changes from public.observation_corrections c where c.observation_id=o.id order by c.created_at desc limit 1) co on true
    where a.status='active'
  ), rel as (
    select b.*,public.generalise_location(b.location,cfg.public_history_generalisation_m) g,cfg.public_history_generalisation_m m
    from base b cross join cfg
    where b.effective_status='verified'
      and b.observed_at <= now() - make_interval(hours => cfg.public_latest_delay_hours)
      and b.observed_at >= now() - interval '24 months'
    order by b.observed_at desc limit 5000
  )
  select id,public_id,name,observed_at,st_y(g),st_x(g),behaviour,condition,true,m from rel order by observed_at;
$$;

grant execute on function public.list_public_animals() to anon,authenticated;
grant execute on function public.get_public_animal(text) to anon,authenticated;
grant execute on function public.get_public_history(text) to anon,authenticated;
grant execute on function public.get_public_map() to anon,authenticated;

-- ---------- audit ----------
create or replace function public.audit_change()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.audit_log(actor_user_id,action,entity_type,entity_id,before_data,after_data)
  values(auth.uid(),lower(TG_OP),TG_TABLE_NAME,coalesce((case when TG_OP='DELETE' then old.id else new.id end)::text,''),
    case when TG_OP in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('INSERT','UPDATE') then to_jsonb(new) else null end);
  return coalesce(new,old);
end $$;
create trigger audit_animals after insert or update on public.animals for each row execute function public.audit_change();
create trigger audit_corrections after insert on public.observation_corrections for each row execute function public.audit_change();
create trigger audit_reviews after insert on public.observation_reviews for each row execute function public.audit_change();
create trigger audit_measurements after insert on public.measurements for each row execute function public.audit_change();
create trigger audit_health_cases after insert or update on public.health_cases for each row execute function public.audit_change();
create trigger audit_deployments after insert or update on public.deployments for each row execute function public.audit_change();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.reserve_config enable row level security;
alter table public.reserve_zones enable row level security;
alter table public.taxa enable row level security;
alter table public.animals enable row level security;
alter table public.animal_identifiers enable row level security;
alter table public.observations enable row level security;
alter table public.observation_corrections enable row level security;
alter table public.observation_reviews enable row level security;
alter table public.photos enable row level security;
alter table public.measurements enable row level security;
alter table public.health_cases enable row level security;
alter table public.health_case_events enable row level security;
alter table public.devices enable row level security;
alter table public.deployments enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.product_events enable row level security;
alter table public.audit_log enable row level security;

create policy profiles_self_read on public.profiles for select to authenticated using (user_id=auth.uid() or (public.current_app_role()='admin' and public.is_aal2()));
create policy profiles_admin_manage on public.profiles for all to authenticated using (public.current_app_role()='admin' and public.is_aal2()) with check (public.current_app_role()='admin' and public.is_aal2());

create policy config_staff_read on public.reserve_config for select to authenticated using (public.is_staff());
create policy config_admin_update on public.reserve_config for update to authenticated using (public.current_app_role()='admin' and public.is_aal2()) with check (public.current_app_role()='admin' and public.is_aal2());
create policy zones_staff_all on public.reserve_zones for all to authenticated using (public.current_app_role() in ('ranger','researcher','admin')) with check (public.current_app_role() in ('researcher','admin'));
create policy taxa_staff_read on public.taxa for select to authenticated using (public.is_staff());
create policy taxa_research_manage on public.taxa for all to authenticated using (public.current_app_role() in ('researcher','admin')) with check (public.current_app_role() in ('researcher','admin'));

create policy animals_staff_read on public.animals for select to authenticated using (public.is_staff());
create policy animals_staff_insert on public.animals for insert to authenticated with check (public.current_app_role() in ('ranger','researcher','admin'));
create policy animals_staff_update on public.animals for update to authenticated using (public.current_app_role() in ('ranger','researcher','admin')) with check (public.current_app_role() in ('ranger','researcher','admin'));
create policy identifiers_staff_read on public.animal_identifiers for select to authenticated using (public.is_staff());
create policy identifiers_staff_manage on public.animal_identifiers for all to authenticated using (public.current_app_role() in ('ranger','researcher','admin')) with check (public.current_app_role() in ('ranger','researcher','admin'));

create policy observations_staff_read on public.observations for select to authenticated using (public.is_staff());
create policy observations_staff_insert on public.observations for insert to authenticated with check (public.is_staff());
-- Deliberately no UPDATE or DELETE policy on observations.
create policy corrections_staff_read on public.observation_corrections for select to authenticated using (public.is_staff());
create policy corrections_staff_insert on public.observation_corrections for insert to authenticated with check (public.current_app_role() in ('ranger','researcher','admin'));
create policy reviews_staff_read on public.observation_reviews for select to authenticated using (public.is_staff());
create policy reviews_staff_insert on public.observation_reviews for insert to authenticated with check (public.current_app_role() in ('ranger','researcher','veterinarian','admin'));

create policy photos_staff_read on public.photos for select to authenticated using (public.is_staff());
create policy photos_staff_insert on public.photos for insert to authenticated with check (public.is_staff());
create policy photos_staff_update on public.photos for update to authenticated using (public.current_app_role() in ('researcher','admin')) with check (public.current_app_role() in ('researcher','admin'));

create policy measurements_staff_read on public.measurements for select to authenticated using (public.is_staff());
create policy measurements_research_insert on public.measurements for insert to authenticated with check (public.current_app_role() in ('ranger','researcher','admin'));

create policy health_staff_read on public.health_cases for select to authenticated using (public.is_staff());
create policy health_staff_manage on public.health_cases for all to authenticated using (public.current_app_role() in ('ranger','researcher','veterinarian','admin')) with check (public.current_app_role() in ('ranger','researcher','veterinarian','admin'));
create policy health_events_staff_read on public.health_case_events for select to authenticated using (public.is_staff());
create policy health_events_staff_insert on public.health_case_events for insert to authenticated with check (public.current_app_role() in ('ranger','researcher','veterinarian','admin'));

create policy devices_research_read on public.devices for select to authenticated using (public.current_app_role() in ('researcher','admin'));
create policy devices_research_manage on public.devices for all to authenticated using (public.current_app_role() in ('researcher','admin')) with check (public.current_app_role() in ('researcher','admin'));
create policy deployments_research_read on public.deployments for select to authenticated using (public.current_app_role() in ('researcher','admin'));
create policy deployments_research_manage on public.deployments for all to authenticated using (public.current_app_role() in ('researcher','admin')) with check (public.current_app_role() in ('researcher','admin'));
create policy telemetry_research_read on public.telemetry_events for select to authenticated using (public.current_app_role() in ('researcher','admin'));
create policy telemetry_research_insert on public.telemetry_events for insert to authenticated with check (public.current_app_role() in ('researcher','admin'));

create policy audit_admin_read on public.audit_log for select to authenticated using (public.current_app_role()='admin' and public.is_aal2());
-- Product events are written by a controlled Edge Function/service role, not directly by anon clients.

-- Storage bucket must be private. The Edge Function performs public upload validation.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('sighting-photos','sighting-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

-- Staff can read photos; anonymous clients never receive bucket listing permissions.
create policy sighting_photos_staff_read on storage.objects for select to authenticated
using (bucket_id='sighting-photos' and public.is_staff());

-- Seed common taxa (editable by researchers/admins).
insert into public.taxa(scientific_name,common_name_en,common_name_af) values
('Stigmochelys pardalis','Leopard tortoise','Luiperdskilpad'),
('Chersina angulata','Angulate tortoise','Ploegskaarskilpad')
on conflict(scientific_name) do nothing;

comment on table public.observations is 'Append-only human/device-import observations. Correct through observation_corrections; review through observation_reviews.';
comment on table public.deployments is 'Temporal association between an animal and a device/tag. Never treat a device ID as a permanent animal identity.';
comment on function public.get_public_map() is 'Conservation-safe public spatial data: verified, delayed, generalised; never raw coordinates.';

-- ---------- service-only ingestion ----------
create or replace function public.service_ingest_public_sighting(
  p_client_submission_id uuid,
  p_public_id text,
  p_observed_at timestamptz,
  p_lat double precision,
  p_lng double precision,
  p_gps_accuracy_m numeric,
  p_identification_method text,
  p_identification_confidence text,
  p_possible_species text,
  p_behaviour text,
  p_condition text,
  p_notes text,
  p_quality_score integer
) returns uuid
language plpgsql security definer set search_path=public,extensions as $$
declare
  v_id uuid;
  v_animal uuid;
  v_inside boolean;
  v_flags jsonb := '[]'::jsonb;
  v_prev_location extensions.geography;
  v_prev_time timestamptz;
  v_hours numeric;
  v_speed numeric;
begin
  select id into v_id from public.observations where client_submission_id=p_client_submission_id;
  if v_id is not null then return v_id; end if;

  if p_gps_accuracy_m > (select gps_reject_m from public.reserve_config where id=true) then raise exception 'GPS accuracy exceeds configured submission threshold'; end if;
  if p_observed_at > now() + interval '5 minutes' then v_flags := v_flags || '"future_timestamp"'::jsonb; end if;
  if p_observed_at < now() - interval '30 days' then v_flags := v_flags || '"old_timestamp"'::jsonb; end if;

  if p_public_id is not null then
    select id into v_animal from public.animals where public_id=upper(p_public_id) and status='active';
    if v_animal is null then raise exception 'Unknown animal identifier'; end if;
  end if;

  select case when count(*)=0 then null else bool_or(st_intersects(z.geometry,st_setsrid(st_makepoint(p_lng,p_lat),4326)::extensions.geography)) end
  into v_inside from public.reserve_zones z where z.zone_type='reserve_boundary';
  if v_inside is false then v_flags := v_flags || '"outside_reserve"'::jsonb; end if;

  if v_animal is not null then
    select o.location,o.observed_at into v_prev_location,v_prev_time from public.observations o where o.animal_id=v_animal and o.observed_at < p_observed_at order by o.observed_at desc limit 1;
    if v_prev_location is not null and v_prev_time is not null then
      v_hours := greatest(extract(epoch from (p_observed_at-v_prev_time))/3600.0,0.0167);
      v_speed := st_distance(v_prev_location,st_setsrid(st_makepoint(p_lng,p_lat),4326)::extensions.geography)/v_hours;
      if v_speed > (select movement_flag_m_per_hour from public.reserve_config where id=true) then v_flags := v_flags || '"movement_rate"'::jsonb; end if;
    end if;
  end if;

  insert into public.observations(client_submission_id,animal_id,reported_identifier,observed_at,location,gps_accuracy_m,identification_method,identification_confidence,possible_species,behaviour,condition,notes,observer_type,quality_score,inside_reserve,spatial_flags)
  values(p_client_submission_id,v_animal,p_public_id,p_observed_at,st_setsrid(st_makepoint(p_lng,p_lat),4326)::extensions.geography,p_gps_accuracy_m,p_identification_method,p_identification_confidence,p_possible_species,p_behaviour,p_condition,nullif(p_notes,''),'visitor',p_quality_score,v_inside,v_flags)
  returning id into v_id;

  if p_condition in ('possible_injury','shell_damage','unusual','dead') then
    insert into public.health_cases(animal_id,source_observation_id,severity,summary,assigned_team)
    values(v_animal,v_id,
      case p_condition when 'dead' then 'critical'::public.severity_type when 'shell_damage' then 'high'::public.severity_type else 'moderate'::public.severity_type end,
      'Automatically opened from public observation: '||replace(p_condition,'_',' '),'Conservation Team');
  end if;
  return v_id;
end $$;
revoke all on function public.service_ingest_public_sighting(uuid,text,timestamptz,double precision,double precision,numeric,text,text,text,text,text,text,integer) from public,anon,authenticated;
grant execute on function public.service_ingest_public_sighting(uuid,text,timestamptz,double precision,double precision,numeric,text,text,text,text,text,text,integer) to service_role;

grant select on public.observations_effective to authenticated;
grant select on public.taxa,public.animals,public.animal_identifiers,public.observations,public.observation_corrections,public.observation_reviews,public.photos,public.measurements,public.health_cases,public.health_case_events,public.devices,public.deployments,public.telemetry_events,public.reserve_config,public.reserve_zones to authenticated;
grant insert on public.animals,public.animal_identifiers,public.observations,public.observation_corrections,public.observation_reviews,public.photos,public.measurements,public.health_cases,public.health_case_events,public.devices,public.deployments,public.telemetry_events to authenticated;
grant update on public.animals,public.animal_identifiers,public.photos,public.health_cases,public.devices,public.deployments,public.reserve_config to authenticated;
grant select on public.profiles to authenticated;
grant select on public.audit_log to authenticated;


-- Automatic staff provenance and update timestamps.
alter table public.animals alter column created_by set default auth.uid();
alter table public.observations alter column observer_user_id set default auth.uid();
alter table public.observation_corrections alter column corrected_by set default auth.uid();
alter table public.observation_reviews alter column reviewer_user_id set default auth.uid();
alter table public.measurements alter column recorded_by set default auth.uid();
alter table public.health_cases alter column created_by set default auth.uid();
alter table public.health_case_events alter column actor_user_id set default auth.uid();
alter table public.deployments alter column deployed_by set default auth.uid();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end $$;
create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_reserve_config before update on public.reserve_config for each row execute function public.touch_updated_at();
create trigger touch_reserve_zones before update on public.reserve_zones for each row execute function public.touch_updated_at();
create trigger touch_animals before update on public.animals for each row execute function public.touch_updated_at();
create trigger touch_health_cases before update on public.health_cases for each row execute function public.touch_updated_at();
create trigger touch_devices before update on public.devices for each row execute function public.touch_updated_at();
