const cfg = window.NBTT_CONFIG || { demoMode: true, siteUrl: location.origin, gpsWarningMetres: 50 };

const I18N = {
  en: {
    home:'Home', identify:'Identify tortoise', map:'Explore map', about:'About', staff:'Staff login',
    heroEyebrow:'Nautilus Bay Nature Reserve', heroTitle:'Every sighting tells part of their story.',
    heroText:'Help monitor our tortoise population. Identify a tortoise, record its location and add a photograph in under a minute.',
    scan:'Scan tortoise QR', enter:'Enter tortoise ID', untagged:'Report untagged tortoise', explore:'Explore tortoises',
    registered:'Registered tortoises', sightings:'Sightings this month', pending:'Pending review', lastSeen:'Last seen',
    see:'I have seen this tortoise', journey:'View movement history', species:'Species', sex:'Sex', age:'Approx. age', features:'Distinguishing features',
    locate:'Capture your location', locateHelp:'GPS accuracy is stored with each sighting.', photo:'Take or add a photograph', photoHelp:'A photograph is required for public sightings.',
    behaviour:'What is the tortoise doing?', condition:'How does it look?', notes:'Optional notes', submit:'Submit sighting',
    goodGps:'Location captured', poorGps:'Location captured, but accuracy is poor', noGps:'No location captured yet', retry:'Retry GPS',
    thanks:'Thank you!', recorded:'Your sighting has been recorded.', offlineSaved:'Saved offline — awaiting upload.',
    untaggedTitle:'Report an untagged tortoise', untaggedText:'This creates an unassigned sighting for an administrator to review. It does not automatically register a new tortoise.',
    searchId:'Enter ID, e.g. T0047', find:'Find tortoise', notFound:'No tortoise with that ID was found.',
    staffTitle:'Staff access', demo:'Prototype demo mode', loginText:'Production deployment uses Supabase Auth and Row Level Security. For this standalone prototype, choose a demonstration role.',
    admin:'Enter as Admin', ranger:'Enter as Ranger / Researcher', logout:'Log out',
    mapTitle:'Tortoise sightings map', mapText:'Public latest positions are deliberately generalised. Older historical sightings can be shown at their recorded positions.',
    inferred:'Lines between observations are inferred connections only and do not represent the actual path travelled.',
    offline:'You are offline. New sightings will be stored on this device and synchronised when connectivity returns.',
    sync:'Synchronise pending sightings',
  },
  af: {
    home:'Tuis', identify:'Identifiseer skilpad', map:'Verken kaart', about:'Meer oor ons', staff:'Personeelaanmelding',
    heroEyebrow:'Nautilusbaai Natuurreservaat', heroTitle:'Elke waarneming vertel deel van hul verhaal.',
    heroText:'Help om ons skilpadbevolking te monitor. Identifiseer ’n skilpad, teken sy ligging aan en voeg binne minder as ’n minuut ’n foto by.',
    scan:'Skandeer skilpad-QR', enter:'Voer skilpad-ID in', untagged:'Rapporteer ongemerkte skilpad', explore:'Verken skilpaaie',
    registered:'Geregistreerde skilpaaie', sightings:'Waarnemings dié maand', pending:'Wag vir hersiening', lastSeen:'Laas gesien',
    see:'Ek het hierdie skilpad gesien', journey:'Bekyk bewegingsgeskiedenis', species:'Spesie', sex:'Geslag', age:'Geskatte ouderdom', features:'Uitkenbare kenmerke',
    locate:'Neem jou ligging vas', locateHelp:'GPS-akkuraatheid word saam met elke waarneming gestoor.', photo:'Neem of voeg ’n foto by', photoHelp:'’n Foto is verpligtend vir openbare waarnemings.',
    behaviour:'Wat doen die skilpad?', condition:'Hoe lyk die skilpad?', notes:'Opsionele notas', submit:'Dien waarneming in',
    goodGps:'Ligging vasgelê', poorGps:'Ligging vasgelê, maar akkuraatheid is swak', noGps:'Nog geen ligging vasgelê nie', retry:'Probeer GPS weer',
    thanks:'Dankie!', recorded:'Jou waarneming is aangeteken.', offlineSaved:'Vanlyn gestoor — wag vir oplaai.',
    untaggedTitle:'Rapporteer ’n ongemerkte skilpad', untaggedText:'Dit skep ’n ontoegekende waarneming vir administrateurhersiening. Dit registreer nie outomaties ’n nuwe skilpad nie.',
    searchId:'Voer ID in, bv. T0047', find:'Vind skilpad', notFound:'Geen skilpad met daardie ID is gevind nie.',
    staffTitle:'Personeeltoegang', demo:'Prototipe-demomodus', loginText:'Die produksieweergawe gebruik Supabase Auth en Row Level Security. Kies vir hierdie losstaande prototipe ’n demonstrasierol.',
    admin:'Gaan in as Admin', ranger:'Gaan in as Veldwagter / Navorser', logout:'Teken uit',
    mapTitle:'Skilpadwaarnemingskaart', mapText:'Die nuutste openbare liggings word doelbewus veralgemeen. Ouer historiese waarnemings kan by hul aangetekende posisies gewys word.',
    inferred:'Lyne tussen waarnemings is slegs afgeleide verbindings en verteenwoordig nie die werklike roete wat gevolg is nie.',
    offline:'Jy is vanlyn. Nuwe waarnemings sal op hierdie toestel gestoor en gesinchroniseer word wanneer verbinding terugkeer.',
    sync:'Sinchroniseer hangende waarnemings',
  }
};
let lang = localStorage.getItem('nbtt-lang') || 'en';
const t = k => I18N[lang][k] || I18N.en[k] || k;

const seedTortoises = [
  {id:'1', public_id:'T0047', name:'Shelly', species:'Leopard tortoise', subspecies:'', sex:'Female', age:18, features:'Warm amber shell with a distinctive pale star marking on the rear-left scute.', registered:'2026-01-14', icon:'🐢', status:'active'},
  {id:'2', public_id:'T0128', name:'Atlas', species:'Angulate tortoise', subspecies:'', sex:'Male', age:12, features:'Dark shell margin and a small healed notch on the front-right scute.', registered:'2026-02-02', icon:'🐢', status:'active'},
  {id:'3', public_id:'T0387', name:'Sandy', species:'Padloper sp.', subspecies:'', sex:'Unknown', age:null, features:'Small adult with a sand-coloured carapace and darker central scutes.', registered:'2026-06-18', icon:'🐢', status:'active'}
];
const seedObs = [
  {id:'o1', tortoise_id:'1', public_id:'T0047', observed_at:'2026-05-04T08:22:00+02:00', lat:-34.1708, lng:22.0352, accuracy:9, behaviour:'Feeding', condition:'Healthy', status:'verified'},
  {id:'o2', tortoise_id:'1', public_id:'T0047', observed_at:'2026-06-16T13:47:00+02:00', lat:-34.1763, lng:22.0281, accuracy:12, behaviour:'Walking', condition:'Healthy', status:'verified'},
  {id:'o3', tortoise_id:'1', public_id:'T0047', observed_at:'2026-08-10T15:12:00+02:00', lat:-34.1814, lng:22.0227, accuracy:7, behaviour:'Resting', condition:'Healthy', status:'verified'},
  {id:'o4', tortoise_id:'2', public_id:'T0128', observed_at:'2026-07-09T10:11:00+02:00', lat:-34.1648, lng:22.0462, accuracy:19, behaviour:'Walking', condition:'Healthy', status:'verified'},
  {id:'o5', tortoise_id:'2', public_id:'T0128', observed_at:'2026-08-11T09:41:00+02:00', lat:-34.1681, lng:22.0418, accuracy:11, behaviour:'Feeding', condition:'Healthy', status:'verified'},
  {id:'o6', tortoise_id:'3', public_id:'T0387', observed_at:'2026-08-07T16:04:00+02:00', lat:-34.1849, lng:22.0134, accuracy:24, behaviour:'Resting', condition:'Unsure', status:'pending'}
];
if (!localStorage.getItem('nbtt-tortoises')) localStorage.setItem('nbtt-tortoises', JSON.stringify(seedTortoises));
if (!localStorage.getItem('nbtt-observations')) localStorage.setItem('nbtt-observations', JSON.stringify(seedObs));

const db = {
  tortoises: () => JSON.parse(localStorage.getItem('nbtt-tortoises') || '[]'),
  observations: () => JSON.parse(localStorage.getItem('nbtt-observations') || '[]'),
  saveObservations(rows){ localStorage.setItem('nbtt-observations', JSON.stringify(rows)); },
  findTortoise(id){ return this.tortoises().find(x => x.public_id.toUpperCase() === String(id).toUpperCase()); },
  obsFor(id){ return this.observations().filter(o => o.public_id === id).sort((a,b)=>new Date(a.observed_at)-new Date(b.observed_at)); },
  addObservation(o){ const rows=this.observations(); rows.push(o); this.saveObservations(rows); },
};

function uid(){ return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function esc(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function fmtDate(d){ return new Intl.DateTimeFormat(lang==='af'?'af-ZA':'en-ZA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(d)); }
function daysAgo(d){ const n=Math.max(0,Math.floor((Date.now()-new Date(d))/86400000)); return n===0?'today':`${n} day${n===1?'':'s'} ago`; }
function route(){ return (location.hash.slice(1) || '/').split('?')[0]; }
function go(path){ location.hash=path; }
function toast(msg){ const el=document.querySelector('#toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); }
function latestObs(publicId){ const rows=db.obsFor(publicId); return rows[rows.length-1]; }
function currentRole(){ return sessionStorage.getItem('nbtt-role'); }

function shell(){
  const app=document.querySelector('#app');
  app.innerHTML='';
  app.append(document.querySelector('#shell-template').content.cloneNode(true));
  document.querySelector('#language-btn').textContent=lang==='en'?'AF':'EN';
  document.querySelector('#language-btn').onclick=()=>{ lang=lang==='en'?'af':'en'; localStorage.setItem('nbtt-lang',lang); render(); };
  document.querySelector('#menu-btn').onclick=()=>document.querySelector('#drawer').classList.toggle('open');
  document.querySelectorAll('#drawer a').forEach(a=>a.onclick=()=>document.querySelector('#drawer').classList.remove('open'));
}

function offlineBanner(){ return !navigator.onLine ? `<div class="offline-banner">⚠ ${t('offline')}</div>` : ''; }

function homeView(){
  const torts=db.tortoises(), obs=db.observations();
  const month=obs.filter(o=>new Date(o.observed_at).getMonth()===new Date().getMonth()).length;
  const pending=obs.filter(o=>o.status==='pending').length;
  return `
  <section class="hero"><div class="hero-inner">
    <div class="eyebrow">${t('heroEyebrow')}</div><h1>${t('heroTitle')}</h1><p>${t('heroText')}</p>
    <div class="actions">
      <button class="btn btn-secondary" data-go="/scan">▣ ${t('scan')}</button>
      <button class="btn btn-primary" data-go="/identify">⌨ ${t('enter')}</button>
      <button class="btn btn-ghost wide" style="color:white;border-color:rgba(255,255,255,.35)" data-go="/untagged">＋ ${t('untagged')}</button>
    </div></div></section>
  <div class="container">${offlineBanner()}
    <div class="grid grid-3">
      <div class="card stat"><div class="stat-icon">🐢</div><div><strong>${torts.length}</strong><small>${t('registered')}</small></div></div>
      <div class="card stat"><div class="stat-icon">📍</div><div><strong>${month}</strong><small>${t('sightings')}</small></div></div>
      <div class="card stat"><div class="stat-icon">🔎</div><div><strong>${pending}</strong><small>${t('pending')}</small></div></div>
    </div>
    <div style="height:26px"></div>
    <div class="toolbar"><div><div class="kicker">Community science</div><h2 class="section-title">${t('explore')}</h2></div><button class="btn btn-ghost btn-small" data-go="/map">🗺 ${t('map')}</button></div>
    <div class="grid grid-3">${torts.map(profileMini).join('')}</div>
  </div>`;
}
function profileMini(x){ const last=latestObs(x.public_id); return `<article class="card profile-card"><div class="tortoise-photo" aria-label="Tortoise profile image">${x.icon}</div><div class="profile-body"><div class="kicker">${x.public_id}</div><h3 style="margin:.3rem 0;font-size:1.4rem">${esc(x.name||x.public_id)}</h3><div class="badges"><span class="badge">${esc(x.species)}</span><span class="badge">${esc(x.sex)}</span></div><p class="help">${t('lastSeen')}: ${last?fmtDate(last.observed_at):'—'}</p><button class="btn btn-ghost btn-small" data-go="/t/${x.public_id}">${t('journey')}</button></div></article>`; }

function identifyView(){ return `<div class="container" style="max-width:650px">${offlineBanner()}<div class="kicker">Field identification</div><h1 class="section-title">${t('identify')}</h1><p class="lead">Scan the QR marker or enter the visible tortoise identification number.</p><div class="card"><form id="identify-form" class="form"><div class="field"><label for="tid">Tortoise ID</label><input id="tid" maxlength="20" autocomplete="off" placeholder="${t('searchId')}" /></div><button class="btn btn-primary" type="submit">${t('find')}</button><button class="btn btn-ghost" type="button" data-go="/scan">▣ ${t('scan')}</button><div id="find-error" class="help" style="color:var(--danger)"></div></form></div></div>`; }

function scanView(){ return `<div class="container" style="max-width:720px"><div class="kicker">QR identification</div><h1 class="section-title">${t('scan')}</h1><p class="lead">Point the camera at the tortoise QR tag. No QR? Enter the visible ID instead.</p><div class="card"><div id="scan-area" class="photo-preview"><div style="text-align:center;padding:25px"><div style="font-size:46px">▣</div><strong>Camera scanner</strong><p class="help">Tap below to activate the camera.</p></div></div><div class="actions"><button id="start-scan" class="btn btn-primary">Open camera</button><button class="btn btn-ghost" data-go="/identify">${t('enter')}</button></div><p id="scan-status" class="help"></p></div></div>`; }

function profileView(id){
  const x=db.findTortoise(id); if(!x) return notFoundView();
  const obs=db.obsFor(x.public_id); const last=obs[obs.length-1];
  return `<div class="container"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">
    <article class="card profile-card"><div class="tortoise-photo">${x.icon}</div><div class="profile-body"><div class="kicker">${x.public_id}</div><h1 class="section-title" style="margin-top:4px">${esc(x.name||x.public_id)}</h1><div class="badges"><span class="badge">${esc(x.species)}</span><span class="badge">${esc(x.sex)}</span>${x.age?`<span class="badge">~${x.age} years</span>`:''}</div><p>${esc(x.features)}</p><p class="help">Registered ${esc(x.registered)}</p><button class="btn btn-primary" style="width:100%" data-go="/sighting/${x.public_id}">📍 ${t('see')}</button></div></article>
    <section><div class="kicker">Movement record</div><h2 class="section-title">${t('journey')}</h2><p class="lead">${obs.length} recorded sighting${obs.length===1?'':'s'}. Latest public location is generalised for conservation security.</p><div id="profile-map" class="map"><div class="map-fallback">Loading map…</div></div><div class="notice" style="margin-top:12px">${t('inferred')}</div><div class="card" style="margin-top:14px"><div class="timeline">${obs.slice().reverse().map((o,i)=>`<div class="timeline-item"><strong>${fmtDate(o.observed_at)}</strong><div class="help">${esc(o.behaviour||'Observed')} · ${esc(o.condition||'No condition recorded')}${i===0?' · latest position generalised':''}</div></div>`).join('')}</div></div></section>
  </div></div>`;
}

function sightingView(id, untagged=false){
  const x=untagged?null:db.findTortoise(id); if(!untagged&&!x) return notFoundView();
  return `<div class="container" style="max-width:720px">${offlineBanner()}<div class="kicker">${untagged?'Unassigned sighting':esc(x.public_id)}</div><h1 class="section-title">${untagged?t('untaggedTitle'):`Record ${esc(x.name||x.public_id)}`}</h1><p class="lead">${untagged?t('untaggedText'):'Location, time and GPS accuracy are stored independently for every sighting.'}</p>
  <form id="sighting-form" class="form card">
    <div class="field"><label>${t('locate')}</label><div class="gps-box"><div class="gps-status"><span id="gps-dot" class="dot"></span><div><strong id="gps-label">${t('noGps')}</strong><div id="gps-detail" class="help"></div></div></div><button id="gps-btn" class="btn btn-ghost btn-small" type="button">📍 ${t('locate')}</button></div><div class="help">${t('locateHelp')}</div></div>
    <div class="field"><label>${t('photo')}</label><div id="photo-preview" class="photo-preview"><span>📷</span></div><input id="photo" type="file" accept="image/*" capture="environment" required /><div class="help">${t('photoHelp')}</div></div>
    ${untagged?`<div class="field"><label>Possible species</label><select id="possible-species"><option value="Unknown">Unknown / not sure</option><option>Leopard tortoise</option><option>Angulate tortoise</option><option>Padloper sp.</option><option>Other</option></select></div>`:''}
    <div class="field"><label>${t('behaviour')}</label><div class="choice-grid" data-choice="behaviour">${['Walking','Feeding','Resting','Mating','Other','Unknown'].map(v=>`<button type="button" class="choice" data-value="${v}">${v}</button>`).join('')}</div></div>
    <div class="field"><label>${t('condition')}</label><div class="choice-grid" data-choice="condition">${['Healthy','Possibly injured','Shell damage','Unsure'].map(v=>`<button type="button" class="choice" data-value="${v}">${v}</button>`).join('')}</div></div>
    <div class="field"><label for="notes">${t('notes')}</label><textarea id="notes" maxlength="500" placeholder="Anything useful to the reserve team…"></textarea></div>
    <button class="btn btn-primary" type="submit">✓ ${t('submit')}</button>
  </form></div>`;
}

function confirmationView(){
  const o=JSON.parse(sessionStorage.getItem('nbtt-last')||'null'); if(!o) return homeView();
  const x=o.public_id?db.findTortoise(o.public_id):null;
  return `<div class="container" style="max-width:760px"><div class="card" style="text-align:center;padding:34px"><div style="font-size:56px">✓</div><h1 class="section-title">${t('thanks')}</h1><p class="lead">${o.queued?t('offlineSaved'):t('recorded')}</p><div class="badges" style="justify-content:center"><span class="badge">${x?esc(x.name||x.public_id):'Untagged tortoise'}</span><span class="badge">${fmtDate(o.observed_at)}</span><span class="badge">GPS ±${Math.round(o.accuracy)} m</span></div>${x?`<div id="confirm-map" class="map" style="margin-top:22px"><div class="map-fallback">Loading map…</div></div><button class="btn btn-primary" style="margin-top:18px" data-go="/t/${x.public_id}">${t('journey')}</button>`:`<button class="btn btn-primary" style="margin-top:18px" data-go="/">Return home</button>`}</div></div>`;
}

function mapView(){
  const torts=db.tortoises();
  return `<div class="container"><div class="kicker">Public conservation map</div><h1 class="section-title">${t('mapTitle')}</h1><p class="lead">${t('mapText')}</p><div class="toolbar"><select id="map-filter" class="search" style="max-width:320px"><option value="all">All tortoises</option>${torts.map(x=>`<option value="${x.public_id}">${x.public_id} — ${esc(x.name||'Unnamed')}</option>`).join('')}</select></div><div id="main-map" class="map"><div class="map-fallback">Loading map…</div></div><div class="notice" style="margin-top:12px">${t('inferred')}</div></div>`;
}

function aboutView(){ return `<div class="container" style="max-width:820px"><div class="kicker">Nautilus Bay Nature Reserve</div><h1 class="section-title">Conservation through better observations</h1><div class="card"><p class="lead">The Tortoise Tracker is designed to turn ordinary encounters into structured conservation records. Each accepted sighting preserves its own time, GPS position, accuracy and photograph rather than overwriting the animal’s previous location.</p><h3>Privacy & conservation</h3><p>Public users are not required to create accounts. Precise current positions, veterinary information and research notes are restricted. Public map data can be generalised independently of the protected scientific record.</p><h3>Offline field use</h3><p>When cellular coverage is unavailable, sightings can be stored locally and queued for later synchronisation. A client-generated unique ID prevents the same queued record from being inserted twice.</p><h3>Future-ready</h3><p>The production database reserves a separate device/telemetry model for future GPS, LoRaWAN, RFID, NB-IoT or other sensors without mixing machine telemetry with human observations.</p></div></div>`; }

function loginView(){ return `<div class="container" style="max-width:580px"><div class="kicker">Restricted area</div><h1 class="section-title">${t('staffTitle')}</h1><div class="card"><div class="badge warn">${t('demo')}</div><p class="lead">${t('loginText')}</p><div class="form"><button id="demo-admin" class="btn btn-primary">${t('admin')}</button><button id="demo-ranger" class="btn btn-ghost">${t('ranger')}</button></div></div></div>`; }

function adminView(section='dashboard'){
  const role=currentRole(); if(!role) return loginView();
  const torts=db.tortoises(), obs=db.observations(); const pending=obs.filter(o=>o.status==='pending').length;
  const body = section==='tortoises' ? adminTortoises(torts) : section==='sightings' ? adminSightings(obs) : section==='qr' ? adminQr(torts) : `
    <div class="kicker">Operations overview</div><h1 class="section-title">Admin dashboard</h1><div class="grid grid-3">
      <div class="card stat"><div class="stat-icon">🐢</div><div><strong>${torts.length}</strong><small>Registered tortoises</small></div></div>
      <div class="card stat"><div class="stat-icon">📍</div><div><strong>${obs.length}</strong><small>Total sightings</small></div></div>
      <div class="card stat"><div class="stat-icon">⚠</div><div><strong>${pending}</strong><small>Requires review</small></div></div>
    </div><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin-top:18px"><div class="card"><h3>Health & review queue</h3>${obs.filter(o=>o.condition==='Possibly injured'||o.condition==='Shell damage'||o.status==='pending').map(o=>`<p><span class="badge ${o.condition==='Possibly injured'?'danger':'warn'}">${esc(o.public_id||'UNTAGGED')}</span> ${esc(o.condition||o.status)} · ${fmtDate(o.observed_at)}</p>`).join('')||'<div class="empty">No current alerts</div>'}</div><div class="card"><h3>Offline queue</h3><p id="queue-count" class="lead">Checking this device…</p><button id="sync-btn" class="btn btn-ghost btn-small">${t('sync')}</button></div></div>`;
  return `<div class="admin-shell"><aside class="admin-nav"><h3>${role==='admin'?'Administrator':'Ranger / Researcher'}</h3><a href="#/admin">Overview</a><a href="#/admin/tortoises">Tortoises</a><a href="#/admin/sightings">Sightings</a><a href="#/admin/qr">QR codes</a><a href="#/map">Map</a><a href="#/logout">${t('logout')}</a></aside><section class="admin-content">${body}</section></div>`;
}
function adminTortoises(torts){ return `<div class="toolbar"><div><div class="kicker">Registry</div><h1 class="section-title">Tortoises</h1></div><button id="add-tortoise" class="btn btn-primary btn-small">＋ Add tortoise</button></div><div class="card table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Species</th><th>Sex</th><th>Last seen</th><th>Status</th></tr></thead><tbody>${torts.map(x=>`<tr><td><a href="#/t/${x.public_id}"><strong>${x.public_id}</strong></a></td><td>${esc(x.name||'—')}</td><td>${esc(x.species)}</td><td>${esc(x.sex)}</td><td>${latestObs(x.public_id)?fmtDate(latestObs(x.public_id).observed_at):'—'}</td><td><span class="badge">${x.status}</span></td></tr>`).join('')}</tbody></table></div>`; }
function adminSightings(obs){ return `<div class="kicker">Scientific record</div><h1 class="section-title">Sightings</h1><div class="card table-wrap"><table><thead><tr><th>Date/time</th><th>Tortoise</th><th>GPS accuracy</th><th>Behaviour</th><th>Condition</th><th>Review</th></tr></thead><tbody>${obs.slice().reverse().map(o=>`<tr><td>${fmtDate(o.observed_at)}</td><td>${esc(o.public_id||'UNTAGGED')}</td><td>±${Math.round(o.accuracy||0)} m</td><td>${esc(o.behaviour||'—')}</td><td>${esc(o.condition||'—')}</td><td><span class="badge ${o.status==='pending'?'warn':''}">${esc(o.status)}</span></td></tr>`).join('')}</tbody></table></div>`; }
function adminQr(torts){ return `<div class="kicker">Field identification</div><h1 class="section-title">QR codes</h1><p class="lead">Prototype QR images are generated through an external QR image endpoint. Production should use a bundled/self-hosted QR generator.</p><div class="grid grid-3">${torts.map(x=>{ const url=`${cfg.siteUrl||location.origin}/#/t/${x.public_id}`; const qr=`https://quickchart.io/qr?size=220&text=${encodeURIComponent(url)}`; return `<div class="card" style="text-align:center"><div class="qr-box" style="margin:auto"><img src="${qr}" alt="QR code for ${x.public_id}" /></div><h3>${x.public_id} · ${esc(x.name||'')}</h3><p class="help" style="word-break:break-all">${esc(url)}</p><a class="btn btn-ghost btn-small" href="${qr}" target="_blank" rel="noopener">Open / print QR</a></div>`;}).join('')}</div>`; }
function notFoundView(){ return `<div class="container"><div class="card empty"><div style="font-size:52px">🐢</div><h1>Tortoise not found</h1><p>${t('notFound')}</p><button class="btn btn-primary" data-go="/identify">${t('identify')}</button></div></div>`; }

function attachCommon(){ document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.go))); }

async function openOfflineDB(){ return new Promise((resolve,reject)=>{ const req=indexedDB.open('nbtt-offline',1); req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains('queue')) req.result.createObjectStore('queue',{keyPath:'client_submission_id'}); }; req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); }); }
async function queueObservation(row){ const idb=await openOfflineDB(); return new Promise((resolve,reject)=>{ const tx=idb.transaction('queue','readwrite'); tx.objectStore('queue').put(row); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function getQueue(){ const idb=await openOfflineDB(); return new Promise((resolve,reject)=>{ const req=idb.transaction('queue').objectStore('queue').getAll(); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); }); }
async function removeQueued(id){ const idb=await openOfflineDB(); return new Promise((resolve,reject)=>{ const tx=idb.transaction('queue','readwrite'); tx.objectStore('queue').delete(id); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function syncQueue(){ if(!navigator.onLine) return toast('Still offline.'); const rows=await getQueue(); for(const row of rows){ if(!db.observations().some(x=>x.client_submission_id===row.client_submission_id)) db.addObservation({...row,status:'pending'}); await removeQueued(row.client_submission_id); } toast(rows.length?`${rows.length} sighting(s) synchronised.`:'No pending sightings.'); const c=document.querySelector('#queue-count'); if(c)c.textContent='0 pending on this device'; }

async function compressImage(file){
  if(!file) return null; if(file.size<650000) return await fileToDataURL(file);
  const data=await fileToDataURL(file); const img=new Image(); await new Promise((r,j)=>{img.onload=r;img.onerror=j;img.src=data;});
  const max=1800, scale=Math.min(1,max/Math.max(img.width,img.height)); const canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale); canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height); return canvas.toDataURL('image/jpeg',.78);
}
function fileToDataURL(file){ return new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(file);}); }

function bindIdentify(){ const f=document.querySelector('#identify-form'); if(!f)return; f.onsubmit=e=>{e.preventDefault(); const id=document.querySelector('#tid').value.trim().toUpperCase(); const x=db.findTortoise(id); if(x)go(`/t/${x.public_id}`); else document.querySelector('#find-error').textContent=t('notFound');}; }

function bindScanner(){ const b=document.querySelector('#start-scan'); if(!b)return; b.onclick=async()=>{
  const area=document.querySelector('#scan-area'), status=document.querySelector('#scan-status');
  if(!('BarcodeDetector' in window)){ status.textContent='This browser does not provide native QR detection. Use manual ID entry, or Chrome/Android on a supported device.'; return; }
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}); const video=document.createElement('video'); video.autoplay=true; video.playsInline=true; video.srcObject=stream; video.style='width:100%;height:100%;object-fit:cover'; area.innerHTML=''; area.append(video);
    const detector=new BarcodeDetector({formats:['qr_code']}); let active=true;
    const scan=async()=>{ if(!active)return; try{ const codes=await detector.detect(video); if(codes.length){ active=false; stream.getTracks().forEach(x=>x.stop()); const raw=codes[0].rawValue; const m=raw.match(/T\d{4,}/i); if(m){ const id=m[0].toUpperCase(); db.findTortoise(id)?go(`/t/${id}`):status.textContent=`QR read ${id}, but it is not registered.`; return; } status.textContent='QR detected, but no valid tortoise ID was found.'; } }catch{} if(active)setTimeout(scan,450); }; scan();
  }catch(e){ status.textContent='Camera access was not available. Please enter the tortoise ID manually.'; }
}; }

function bindSighting(id,untagged=false){ const form=document.querySelector('#sighting-form'); if(!form)return; let gps=null, photoData=null, choices={behaviour:'Unknown',condition:'Unsure'};
  document.querySelectorAll('.choice').forEach(btn=>btn.onclick=()=>{ const group=btn.closest('[data-choice]').dataset.choice; btn.closest('[data-choice]').querySelectorAll('.choice').forEach(x=>x.classList.remove('selected')); btn.classList.add('selected'); choices[group]=btn.dataset.value; });
  const gpsBtn=document.querySelector('#gps-btn'); gpsBtn.onclick=()=>{ const label=document.querySelector('#gps-label'),detail=document.querySelector('#gps-detail'),dot=document.querySelector('#gps-dot'); label.textContent='Locating…'; if(!navigator.geolocation){label.textContent='GPS unavailable';return;} navigator.geolocation.getCurrentPosition(pos=>{gps={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy}; const poor=gps.accuracy>(cfg.gpsWarningMetres||50); dot.className=`dot ${poor?'warn':'ok'}`; label.textContent=poor?t('poorGps'):t('goodGps'); detail.textContent=`±${Math.round(gps.accuracy)} m`; gpsBtn.textContent=`↻ ${t('retry')}`;},()=>{label.textContent='Location permission denied or unavailable';dot.className='dot warn';},{enableHighAccuracy:true,timeout:12000,maximumAge:0}); };
  document.querySelector('#photo').onchange=async e=>{ const f=e.target.files[0]; if(!f)return; photoData=await compressImage(f); document.querySelector('#photo-preview').innerHTML=`<img src="${photoData}" alt="Sighting photograph preview" />`; };
  form.onsubmit=async e=>{e.preventDefault(); if(!gps){toast('Please capture the GPS location first.');return;} if(!photoData){toast('Please add a photograph.');return;} const x=untagged?null:db.findTortoise(id); const row={ id:uid(), client_submission_id:uid(), tortoise_id:x?.id||null, public_id:x?.public_id||null, observed_at:new Date().toISOString(), received_at:navigator.onLine?new Date().toISOString():null, lat:gps.lat,lng:gps.lng,accuracy:gps.accuracy,identification_method:untagged?'UNTAGGED':'MANUAL',behaviour:choices.behaviour,condition:choices.condition,notes:document.querySelector('#notes').value.trim(),photo_data:photoData,possible_species:untagged?document.querySelector('#possible-species').value:null,status:'pending'};
    if(navigator.onLine){db.addObservation(row);row.queued=false;}else{await queueObservation(row);row.queued=true;} sessionStorage.setItem('nbtt-last',JSON.stringify(row)); go('/confirmation'); };
}

function bindLogin(){ const a=document.querySelector('#demo-admin'), r=document.querySelector('#demo-ranger'); if(a)a.onclick=()=>{sessionStorage.setItem('nbtt-role','admin');go('/admin');}; if(r)r.onclick=()=>{sessionStorage.setItem('nbtt-role','ranger');go('/admin');}; }
function bindAdmin(){ const sync=document.querySelector('#sync-btn'); if(sync)sync.onclick=syncQueue; getQueue().then(rows=>{const e=document.querySelector('#queue-count');if(e)e.textContent=`${rows.length} pending on this device`;}).catch(()=>{}); const add=document.querySelector('#add-tortoise'); if(add)add.onclick=()=>toast('Registry creation form is wired for the production Supabase build; demo dataset is read-only.'); }

function rounded(v){ return Math.round(v*100)/100; }
function createMap(elId, filterId=null, focusId=null, confirmPoint=null){ const el=document.getElementById(elId); if(!el)return; if(!window.L){el.innerHTML='<div class="map-fallback">Map library is unavailable offline. The sighting itself can still be captured and queued.</div>';return;} const map=L.map(el).setView([-34.175,22.03],13); L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  const draw=(filter='all')=>{ map.eachLayer(layer=>{ if(layer instanceof L.Marker||layer instanceof L.Polyline)map.removeLayer(layer); }); const groups={}; db.observations().filter(o=>o.public_id&&(filter==='all'||o.public_id===filter)).forEach(o=>(groups[o.public_id]??=[]).push(o));
    Object.entries(groups).forEach(([pid,rows])=>{rows.sort((a,b)=>new Date(a.observed_at)-new Date(b.observed_at)); const points=rows.map((o,i)=>{ const latest=i===rows.length-1; const lat=latest?rounded(o.lat):o.lat,lng=latest?rounded(o.lng):o.lng; const x=db.findTortoise(pid); L.marker([lat,lng]).addTo(map).bindPopup(`<strong>${esc(x?.name||pid)}</strong><br>${esc(pid)}<br>${fmtDate(o.observed_at)}${latest?'<br><em>Latest position generalised</em>':''}`); return [lat,lng]; }); if(points.length>1)L.polyline(points,{dashArray:'5,7',weight:2,opacity:.65}).addTo(map); });
    if(confirmPoint)L.marker([rounded(confirmPoint.lat),rounded(confirmPoint.lng)]).addTo(map).bindPopup('Your sighting · public position generalised');
  }; draw(focusId||'all'); const filter=document.getElementById(filterId); if(filter)filter.onchange=()=>draw(filter.value); setTimeout(()=>map.invalidateSize(),50); }

function render(){ shell(); const p=route(); let html='';
  if(p==='/')html=homeView(); else if(p==='/identify')html=identifyView(); else if(p==='/scan')html=scanView(); else if(p==='/untagged')html=sightingView(null,true); else if(p==='/confirmation')html=confirmationView(); else if(p==='/map')html=mapView(); else if(p==='/about')html=aboutView(); else if(p==='/login')html=loginView(); else if(p==='/logout'){sessionStorage.removeItem('nbtt-role');html=homeView();} else if(p.startsWith('/t/'))html=profileView(p.split('/')[2]); else if(p.startsWith('/sighting/'))html=sightingView(p.split('/')[2]); else if(p==='/admin')html=adminView('dashboard'); else if(p==='/admin/tortoises')html=adminView('tortoises'); else if(p==='/admin/sightings')html=adminView('sightings'); else if(p==='/admin/qr')html=adminView('qr'); else html=notFoundView();
  document.querySelector('#view').innerHTML=html; attachCommon(); bindIdentify(); bindScanner(); bindLogin(); bindAdmin(); if(p.startsWith('/sighting/'))bindSighting(p.split('/')[2]); if(p==='/untagged')bindSighting(null,true);
  if(p.startsWith('/t/'))createMap('profile-map',null,p.split('/')[2]); if(p==='/map')createMap('main-map','map-filter'); if(p==='/confirmation'){const o=JSON.parse(sessionStorage.getItem('nbtt-last')||'null'); if(o?.public_id)createMap('confirm-map',null,o.public_id,o);}
  document.querySelector('#view')?.focus({preventScroll:true});
}
window.addEventListener('hashchange',render); window.addEventListener('online',()=>{toast('Back online — synchronising pending sightings.');syncQueue();}); window.addEventListener('offline',()=>toast(t('offline')));
if('serviceWorker' in navigator && location.protocol!=='file:') window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));
render();
