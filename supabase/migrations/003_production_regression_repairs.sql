-- V8 production regression repairs: corrected spatial projection, richer animal master data,
-- Padloper seed and conservation-safe public history.

alter table public.animals add column if not exists date_of_birth date;

insert into public.taxa(scientific_name,common_name_en,common_name_af) values
('Homopus sp.','Padloper','Padloper')
on conflict(scientific_name) do nothing;

create or replace view public.observations_effective with (security_invoker=true) as
with x as (
  select o.*,a.public_id,c.id as latest_correction_id,c.changes,r.id as latest_review_id,r.status review_status,
    case when c.changes ? 'lat' and c.changes ? 'lng'
      then st_setsrid(st_makepoint((c.changes->>'lng')::double precision,(c.changes->>'lat')::double precision),4326)::extensions.geography
      else o.location end as effective_location
  from public.observations o
  left join public.animals a on a.id=o.animal_id
  left join lateral (
    select latest.id, coalesce(merged.changes,'{}'::jsonb) changes
    from (select id from public.observation_corrections q where q.observation_id=o.id order by q.created_at desc limit 1) latest
    cross join lateral (
      select jsonb_object_agg(k,v) changes from (
        select distinct on (e.key) e.key k,e.value v
        from public.observation_corrections q cross join lateral jsonb_each(q.changes)e
        where q.observation_id=o.id order by e.key,q.created_at desc
      ) z
    ) merged
  ) c on true
  left join lateral (select * from public.observation_reviews q where q.observation_id=o.id order by q.reviewed_at desc limit 1)r on true
)
select id,client_submission_id,animal_id,public_id,reported_identifier,
  coalesce((changes->>'observed_at')::timestamptz,observed_at) observed_at,received_at,
  effective_location as location,st_y(effective_location::geometry) lat,st_x(effective_location::geometry) lng,
  coalesce((changes->>'gps_accuracy_m')::numeric,gps_accuracy_m) gps_accuracy_m,
  identification_method,identification_confidence,possible_species,
  coalesce(changes->>'behaviour',behaviour) behaviour,coalesce(changes->>'condition',condition) condition,coalesce(changes->>'notes',notes) notes,
  observer_type,observer_user_id,quality_score,coalesce(review_status,verification_status) verification_status,
  inside_reserve,spatial_flags,created_at,latest_correction_id,latest_review_id
from x;
grant select on public.observations_effective to authenticated;

create or replace function public.list_public_animals()
returns table(public_id text,name text,scientific_name text,common_name_en text,common_name_af text,conservation_status text,sex public.sex_type,life_stage text,estimated_age_years numeric,identifying_features text,profile_photo_id uuid,last_observed_at timestamptz)
language sql stable security definer set search_path=public,extensions as $$
  select a.public_id,a.name,t.scientific_name,t.common_name_en,t.common_name_af,t.conservation_status,a.sex,a.life_stage,a.estimated_age_years,a.identifying_features,a.profile_photo_id,
    (select max(e.observed_at) from public.observations_effective e where e.animal_id=a.id and e.verification_status='verified'
      and e.observed_at <= now()-make_interval(hours=>(select public_latest_delay_hours from public.reserve_config where id=true)))
  from public.animals a left join public.taxa t on t.id=a.taxon_id where a.status='active' order by a.public_id;
$$;
grant execute on function public.list_public_animals() to anon,authenticated;

drop function if exists public.get_public_history(text);
create function public.get_public_history(p_public_id text)
returns table(observation_id uuid,public_id text,observed_at timestamptz,lat double precision,lng double precision,behaviour text,condition text,quality_score integer,location_generalised boolean,generalisation_metres integer)
language sql stable security definer set search_path=public,extensions as $$
  with cfg as (select * from public.reserve_config where id=true), base as (
    select e.id,e.public_id,e.observed_at,e.location,e.behaviour,e.condition,e.quality_score,e.verification_status
    from public.observations_effective e join public.animals a on a.id=e.animal_id
    where a.public_id=upper(p_public_id) and a.status='active'
  ), rel as (
    select b.*,public.generalise_location(b.location,cfg.public_history_generalisation_m) g,cfg.public_history_generalisation_m m
    from base b cross join cfg where b.verification_status='verified'
      and b.observed_at <= now()-make_interval(hours=>cfg.public_latest_delay_hours)
  )
  select id,public_id,observed_at,st_y(g),st_x(g),behaviour,condition,quality_score,true,m from rel order by observed_at;
$$;
grant execute on function public.get_public_history(text) to anon,authenticated;

drop function if exists public.get_public_map();
create function public.get_public_map()
returns table(observation_id uuid,public_id text,name text,observed_at timestamptz,lat double precision,lng double precision,behaviour text,condition text,location_generalised boolean,generalisation_metres integer)
language sql stable security definer set search_path=public,extensions as $$
  with cfg as (select * from public.reserve_config where id=true), base as (
    select e.id,e.public_id,a.name,e.observed_at,e.location,e.behaviour,e.condition,e.verification_status
    from public.observations_effective e join public.animals a on a.id=e.animal_id where a.status='active'
  ), rel as (
    select b.*,public.generalise_location(b.location,cfg.public_history_generalisation_m) g,cfg.public_history_generalisation_m m
    from base b cross join cfg where b.verification_status='verified'
      and b.observed_at <= now()-make_interval(hours=>cfg.public_latest_delay_hours)
      and b.observed_at >= now()-interval '24 months' order by b.observed_at desc limit 5000
  )
  select id,public_id,name,observed_at,st_y(g),st_x(g),behaviour,condition,true,m from rel order by observed_at;
$$;
grant execute on function public.get_public_map() to anon,authenticated;
