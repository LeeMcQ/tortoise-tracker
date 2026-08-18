export const DEMO = {
  taxa: [
    {id:'tax-leopard', scientific_name:'Stigmochelys pardalis', common_name_en:'Leopard tortoise', common_name_af:'Luiperdskilpad'},
    {id:'tax-angulate', scientific_name:'Chersina angulata', common_name_en:'Angulate tortoise', common_name_af:'Ploegskaarskilpad'},
    {id:'tax-padloper', scientific_name:'Homopus sp.', common_name_en:'Padloper', common_name_af:'Padloper'}
  ],
  animals: [
    {id:'a1', public_id:'T0047', name:'Shelly', taxon_id:'tax-leopard', sex:'female', life_stage:'adult', estimated_age_years:18, identifying_features:'Warm amber shell with a pale star-shaped marking on the rear-left scute.', registration_date:'2026-01-14', status:'active', profile_photo:null, profile_photo_url:'https://nautilusbayhoa.co.za/wp-content/uploads/2017/10/Gallery_3.jpg'},
    {id:'a2', public_id:'T0128', name:'Atlas', taxon_id:'tax-angulate', sex:'male', life_stage:'adult', estimated_age_years:12, identifying_features:'Dark shell margin and a small healed notch on the front-right scute.', registration_date:'2026-02-02', status:'active', profile_photo:null, profile_photo_url:'https://nautilusbayhoa.co.za/wp-content/uploads/2017/10/Gallery_7.jpg'},
    {id:'a3', public_id:'T0387', name:'Sandy', taxon_id:'tax-padloper', sex:'unknown', life_stage:'adult', estimated_age_years:null, identifying_features:'Small adult with a sand-coloured carapace and darker central scutes.', registration_date:'2026-06-18', status:'active', profile_photo:null, profile_photo_url:'./icons/tortoise-padloper.svg'}
  ],
  identifiers: [
    {id:'id1', animal_id:'a1', type:'visible_id', value:'T0047', active:true}, {id:'id2', animal_id:'a1', type:'qr', value:'T0047', active:true},
    {id:'id3', animal_id:'a2', type:'visible_id', value:'T0128', active:true}, {id:'id4', animal_id:'a2', type:'qr', value:'T0128', active:true},
    {id:'id5', animal_id:'a3', type:'visible_id', value:'T0387', active:true}, {id:'id6', animal_id:'a3', type:'qr', value:'T0387', active:true}
  ],
  observations: [
    {id:'o1', client_submission_id:'demo-o1', animal_id:'a1', public_id:'T0047', observed_at:'2026-05-04T08:22:00+02:00', received_at:'2026-05-04T08:22:18+02:00', lat:-34.1708, lng:22.0352, accuracy_m:9, identification_method:'qr', identification_confidence:'certain', behaviour:'feeding', condition:'healthy', notes:'', observer_type:'visitor', quality_score:98, verification_status:'verified'},
    {id:'o2', client_submission_id:'demo-o2', animal_id:'a1', public_id:'T0047', observed_at:'2026-06-16T13:47:00+02:00', received_at:'2026-06-16T13:47:23+02:00', lat:-34.1763, lng:22.0281, accuracy_m:12, identification_method:'manual', identification_confidence:'certain', behaviour:'walking', condition:'healthy', notes:'', observer_type:'visitor', quality_score:94, verification_status:'verified'},
    {id:'o3', client_submission_id:'demo-o3', animal_id:'a1', public_id:'T0047', observed_at:'2026-08-10T15:12:00+02:00', received_at:'2026-08-10T15:13:44+02:00', lat:-34.1814, lng:22.0227, accuracy_m:7, identification_method:'qr', identification_confidence:'certain', behaviour:'resting', condition:'healthy', notes:'', observer_type:'visitor', quality_score:99, verification_status:'verified'},
    {id:'o4', client_submission_id:'demo-o4', animal_id:'a2', public_id:'T0128', observed_at:'2026-07-09T10:11:00+02:00', received_at:'2026-07-09T10:11:28+02:00', lat:-34.1648, lng:22.0462, accuracy_m:19, identification_method:'manual', identification_confidence:'certain', behaviour:'walking', condition:'healthy', notes:'', observer_type:'scientist', quality_score:91, verification_status:'verified'},
    {id:'o5', client_submission_id:'demo-o5', animal_id:'a2', public_id:'T0128', observed_at:'2026-08-11T09:41:00+02:00', received_at:'2026-08-11T09:42:11+02:00', lat:-34.1681, lng:22.0418, accuracy_m:11, identification_method:'qr', identification_confidence:'certain', behaviour:'feeding', condition:'healthy', notes:'', observer_type:'visitor', quality_score:96, verification_status:'verified'},
    {id:'o6', client_submission_id:'demo-o6', animal_id:'a3', public_id:'T0387', observed_at:'2026-08-07T16:04:00+02:00', received_at:'2026-08-07T16:08:09+02:00', lat:-34.1849, lng:22.0134, accuracy_m:24, identification_method:'manual', identification_confidence:'probable', behaviour:'resting', condition:'unsure', notes:'Animal partly obscured by vegetation.', observer_type:'visitor', quality_score:78, verification_status:'pending'}
  ],
  observation_corrections: [],
  observation_reviews: [
    {id:'rv1', observation_id:'o1', status:'verified', reason:'Clear QR, photo and high accuracy GPS.', reviewer:'Scientist Demo', reviewed_at:'2026-05-04T10:00:00+02:00'},
    {id:'rv2', observation_id:'o2', status:'verified', reason:'Identity confirmed from shell pattern.', reviewer:'Scientist Demo', reviewed_at:'2026-06-17T08:00:00+02:00'}
  ],
  measurements: [
    {id:'m1', animal_id:'a1', measured_at:'2026-03-10T09:30:00+02:00', measurement_type:'mass', value:6.2, unit:'kg', method:'calibrated field scale', confidence:'high', recorded_by:'Scientist Demo'},
    {id:'m2', animal_id:'a1', measured_at:'2026-03-10T09:32:00+02:00', measurement_type:'straight_carapace_length', value:412, unit:'mm', method:'calipers', confidence:'high', recorded_by:'Scientist Demo'},
    {id:'m3', animal_id:'a2', measured_at:'2026-04-02T11:20:00+02:00', measurement_type:'mass', value:2.4, unit:'kg', method:'calibrated field scale', confidence:'high', recorded_by:'Scientist Demo'}
  ],
  health_cases: [
    {id:'hc1', animal_id:'a3', observation_id:'o6', opened_at:'2026-08-07T16:15:00+02:00', severity:'low', status:'monitoring', summary:'Observer uncertain about condition; photo review requested.', assigned_to:'Conservation Team', follow_up_date:'2026-08-20', outcome:null}
  ],
  health_case_events: [
    {id:'hce1', case_id:'hc1', event_at:'2026-08-08T09:00:00+02:00', event_type:'review', notes:'No obvious trauma in available image. Monitor next sighting.', actor:'Scientist Demo'}
  ],
  devices: [
    {id:'dev1', external_device_id:'GPS-DEMO-001', device_type:'tracker', technology:'LoRaWAN/GNSS', manufacturer:'Demo', model:'Research prototype', status:'inactive'}
  ],
  deployments: [
    {id:'dep1', animal_id:'a1', device_id:'dev1', deployed_at:'2026-04-01T10:00:00+02:00', removed_at:'2026-04-14T10:00:00+02:00', attachment_method:'Demonstration record only', status:'closed'}
  ],
  telemetry_events: [
    {id:'te1', deployment_id:'dep1', recorded_at:'2026-04-02T12:00:00+02:00', lat:-34.1731, lng:22.0311, accuracy_m:5, battery_percent:94, source:'gnss'}
  ],
  audit_log: [
    {id:'au1', occurred_at:'2026-08-01T08:00:00+02:00', actor:'System', action:'demo_dataset_created', entity_type:'system', entity_id:'demo', detail:'Synthetic demonstration data initialised.'}
  ]
};
