-- V7 role consolidation: Ranger + Researcher + Veterinarian -> Scientist
-- Safe for an existing V6 database. On a fresh V7 schema this migration is effectively idempotent.

alter type public.app_role add value if not exists 'scientist';

-- Convert existing staff profiles to the consolidated Scientist role.
update public.profiles
set role='scientist'::public.app_role,
    updated_at=now()
where role::text in ('ranger','researcher','veterinarian');

-- Preserve observation provenance while consolidating the current access-profile vocabulary.
update public.observations
set observer_type='scientist'
where observer_type in ('ranger','researcher','veterinarian');

alter table public.observations drop constraint if exists observations_observer_type_check;
alter table public.observations add constraint observations_observer_type_check
  check (observer_type in ('visitor','scientist','admin','device_import'));

-- Recreate role-sensitive RLS policies using only Scientist and Administrator.
drop policy if exists zones_staff_all on public.reserve_zones;
create policy zones_staff_all on public.reserve_zones for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists taxa_research_manage on public.taxa;
create policy taxa_research_manage on public.taxa for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists animals_staff_insert on public.animals;
create policy animals_staff_insert on public.animals for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists animals_staff_update on public.animals;
create policy animals_staff_update on public.animals for update to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists identifiers_staff_manage on public.animal_identifiers;
create policy identifiers_staff_manage on public.animal_identifiers for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists corrections_staff_insert on public.observation_corrections;
create policy corrections_staff_insert on public.observation_corrections for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists reviews_staff_insert on public.observation_reviews;
create policy reviews_staff_insert on public.observation_reviews for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists photos_staff_update on public.photos;
create policy photos_staff_update on public.photos for update to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists measurements_research_insert on public.measurements;
create policy measurements_research_insert on public.measurements for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists health_staff_manage on public.health_cases;
create policy health_staff_manage on public.health_cases for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists health_events_staff_insert on public.health_case_events;
create policy health_events_staff_insert on public.health_case_events for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists devices_research_read on public.devices;
create policy devices_research_read on public.devices for select to authenticated
  using (public.current_app_role() in ('scientist','admin'));

drop policy if exists devices_research_manage on public.devices;
create policy devices_research_manage on public.devices for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists deployments_research_read on public.deployments;
create policy deployments_research_read on public.deployments for select to authenticated
  using (public.current_app_role() in ('scientist','admin'));

drop policy if exists deployments_research_manage on public.deployments;
create policy deployments_research_manage on public.deployments for all to authenticated
  using (public.current_app_role() in ('scientist','admin'))
  with check (public.current_app_role() in ('scientist','admin'));

drop policy if exists telemetry_research_read on public.telemetry_events;
create policy telemetry_research_read on public.telemetry_events for select to authenticated
  using (public.current_app_role() in ('scientist','admin'));

drop policy if exists telemetry_research_insert on public.telemetry_events;
create policy telemetry_research_insert on public.telemetry_events for insert to authenticated
  with check (public.current_app_role() in ('scientist','admin'));

comment on type public.app_role is 'Current access profiles: scientist and admin. Public users are anonymous and are not represented by app_role.';
