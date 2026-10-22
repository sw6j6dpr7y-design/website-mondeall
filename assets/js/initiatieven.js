/* Initiatieven: filters, lijst, kaart en Kern-paneel */
(function () {
  if (!document.getElementById('ini-grid')) return;
var iniGrid = document.getElementById('ini-grid');
var iniOrder = INI_DATA.slice();
for (var si = iniOrder.length - 1; si > 0; si--) { var sj = Math.floor(Math.random() * (si + 1)); var stmp = iniOrder[si]; iniOrder[si] = iniOrder[sj]; iniOrder[sj] = stmp; }
function ifNorm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function ifId(naam) { return ifNorm(naam).replace(/[^a-z0-9]+/g, '-'); }
function ifStatus(d) { return d.afgesloten ? 'afgesloten' : 'open'; }
var IF_STATUSNAAM = { open: 'Open voor delen', afgesloten: 'Afgesloten' };

function ifKern(id) { return IF_KERNEN.filter(function (k) { return k.id === id; })[0]; }
/* Alle soorten Begunstigde, ook als er nu geen voorbeeld-Initiatief van die soort is (zelfde keuze als bij Start een Initiatief) */
var IF_SOORTEN = ['Vereniging', 'Stichting', 'School', 'Kerk', 'Anders'];

var ifPerKern = {};
INI_DATA.forEach(function (d) {
  var k = ifKern(ifId(d.kern));
  var j = (ifPerKern[k.id] = (ifPerKern[k.id] || 0) + 1) - 1;
  var ang = j * 2.39996, r = 0.0018 + j * 0.0016;
  d.lat = k.c[0] - 0.0012 + r * Math.sin(ang);
  d.lng = k.c[1] + r * 1.7 * Math.cos(ang);
});

var IF = { kern: '', sectors: [], soort: '', status: '', q: '', view: 'lijst', inview: false, panel: false, sel: '' };
var ifEl = {
  kernen: document.getElementById('if-kernen'), q: document.getElementById('if-q'),
  btn: document.getElementById('if-sector-btn'), txt: document.getElementById('if-sector-txt'), cnt: document.getElementById('if-sector-count'),
  panel: document.getElementById('if-panel'), opts: document.getElementById('if-opts'),
  soort: document.getElementById('if-soort'), status: document.getElementById('if-status'),
  chips: document.getElementById('if-chips'), titel: document.getElementById('if-titel'), result: document.getElementById('if-result'),
  leeg: document.getElementById('if-leeg'), leegTxt: document.getElementById('if-leeg-txt'),
  explore: document.getElementById('if-explore'), view: document.getElementById('if-view'),
  inview: document.getElementById('if-inview'), kp: document.getElementById('if-kernpanel'), maplaad: document.getElementById('if-maplaad')
};
function ifMobiel() { return window.matchMedia('(max-width:860px)').matches; }
function ifRustig() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

function ifCardHTML(d) {
  var s = iniSector(d.sector);
  return '<div class="ini-stripe" style="background:' + s.hex + '"></div>' +
    '<div class="ini-thumb" style="background:' + iniTint(s.hex, 0.10) + '">' +
      '<img src="' + d.foto + '" alt="" loading="lazy" style="object-position:center ' + d.pos + '">' +
      '<span class="ini-status">' + (d.afgesloten ? 'Voorbeeld · afgesloten' : 'Voorbeeld') + '</span>' +
      '<span class="ini-icon"><img src="/assets/iconen/kleur/' + IF_ICON[d.sector] + '.svg" alt=""></span>' +
    '</div>' +
    '<div class="ini-body">' +
      '<span class="ini-chip"><span class="dot" style="background:' + s.hex + '"></span>' + iniEsc(s.naam) + '</span>' +
      '<span class="ini-plaats">' + iniEsc(d.kern) + '</span>' +
      '<h3>' + iniEsc(d.titel) + '</h3>' +
      '<p class="ini-vz">' + iniEsc(d.vz) + '</p>' +
      '<div class="ini-beg">' + iniEsc(d.beg) + '<span class="ini-meer">Bekijk het Initiatief &rarr;</span><span class="foto-credit">Foto: ' + iniEsc(d.credit) + '</span></div>' +
    '</div>';
}
function ifCompactHTML(d) {
  var s = iniSector(d.sector), st = ifStatus(d);
  return '<div class="if-ctop"><div class="if-csector"><span class="dot" style="background:' + s.hex + '"></span>' + iniEsc(s.naam) + '</div>' +
      '<span class="if-cstatus ' + st + '">' + IF_STATUSNAAM[st] + '</span></div>' +
    '<h4><button type="button" data-slug="' + d.slug + '">' + iniEsc(d.titel) + '</button></h4>' +
    '<p>' + iniEsc(d.vz) + '</p>' +
    '<dl><dt>Begunstigde</dt><dd>' + iniEsc(d.beg) + '</dd><dt>Kern</dt><dd>' + iniEsc(d.kern) + '</dd></dl>' +
    '<a class="if-cmeer" href="/initiatieven/' + d.slug + '">Bekijk het Initiatief &rarr;</a>';
}
function ifMatches(d) {
  if (IF.kern && ifId(d.kern) !== IF.kern) return false;
  if (IF.sectors.length && IF.sectors.indexOf(d.sector) < 0) return false;
  if (IF.soort && d.soort !== IF.soort) return false;
  if (IF.status && ifStatus(d) !== IF.status) return false;
  if (IF.q) {
    var hooi = ifNorm([d.titel, d.vz, d.beg, d.soort, d.kern, iniSector(d.sector).naam].join(' '));
    if (!ifNorm(IF.q).split(/\s+/).every(function (w) { return hooi.indexOf(w) >= 0; })) return false;
  }
  return true;
}
function ifInView(d) { return !IF.inview || !ifMap || ifMap.getBounds().pad(-0.02).contains([d.lat, d.lng]); }

function ifRenderKernen() {
  var alle = [{ id: '', naam: 'Hele gemeente' }].concat(IF_KERNEN);
  ifEl.kernen.innerHTML = alle.map(function (k) {
    return '<li><button type="button" data-kern="' + k.id + '" aria-pressed="' + (IF.kern === k.id) + '">' + iniEsc(k.naam) + '</button></li>';
  }).join('');
}
function ifRenderChips() {
  var chips = [];
  if (IF.kern) chips.push(['kern', '', ifKern(IF.kern).naam]);
  IF.sectors.forEach(function (nr) { chips.push(['sector', nr, iniSector(nr).naam]); });
  if (IF.soort) chips.push(['soort', '', IF.soort]);
  if (IF.status) chips.push(['status', '', IF_STATUSNAAM[IF.status]]);
  if (IF.q) chips.push(['q', '', '“' + IF.q + '”']);
  if (!chips.length) { ifEl.chips.innerHTML = ''; return; }
  ifEl.chips.innerHTML = chips.map(function (c) {
    return '<span class="if-chip">' + iniEsc(c[2]) + '<button type="button" data-t="' + c[0] + '" data-v="' + c[1] + '" aria-label="Filter ' + iniEsc(c[2]) + ' weghalen">×</button></span>';
  }).join('') +
    '<button type="button" class="if-textbtn" data-t="all">Wis alle filters</button>' +
    '<button type="button" class="if-textbtn" data-t="share">Kopieer link naar deze selectie</button>' +
    '<span class="if-copied" id="if-copied" aria-live="polite"></span>';
}
function ifSchrijfUrl() {
  var p = new URLSearchParams();
  if (IF.kern) p.set('kern', IF.kern);
  if (IF.sectors.length) p.set('sector', IF.sectors.join(','));
  if (IF.soort) p.set('soort', IF.soort);
  if (IF.status) p.set('status', IF.status);
  if (IF.q) p.set('q', IF.q);
  if (IF.view === 'kaart') p.set('weergave', 'kaart');
  var qs = p.toString();
  try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) {}
}
function ifLeesUrl() {
  var p = new URLSearchParams(location.search);
  var k = p.get('kern') || '';
  IF.kern = ifKern(k) ? k : '';
  IF.panel = !!IF.kern;
  IF.sectors = (p.get('sector') || '').split(',').filter(function (nr) { return iniSector(nr); }).sort();
  var so = p.get('soort') || '';
  IF.soort = IF_SOORTEN.indexOf(so) >= 0 ? so : '';
  var st = p.get('status') || '';
  IF.status = IF_STATUSNAAM[st] ? st : '';
  IF.q = (p.get('q') || '').trim().slice(0, 80);
  IF.view = p.get('weergave') === 'kaart' ? 'kaart' : 'lijst';
}
function ifSyncUi() {
  ifEl.q.value = IF.q;
  ifEl.soort.value = IF.soort;
  ifEl.status.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === IF.status); });
  ifEl.opts.querySelectorAll('input').forEach(function (i) { i.checked = IF.sectors.indexOf(i.value) >= 0; });
  ifEl.explore.setAttribute('data-view', IF.view);
  ifEl.view.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === IF.view); });
}

function ifUpdate(refit) {
  var gefilterd = iniOrder.filter(ifMatches);
  var zicht = gefilterd.filter(ifInView);
  var kaart = IF.view === 'kaart';
  iniGrid.textContent = '';
  iniGrid.className = 'ini-grid' + (kaart ? ' compact' : '');
  zicht.forEach(function (d) {
    var el = document.createElement(kaart ? 'div' : 'a');
    el.setAttribute('role', 'listitem');
    el.setAttribute('data-slug', d.slug);
    if (kaart) {
      el.className = 'if-ccard';
      el.setAttribute('aria-current', IF.sel === d.slug);
      el.innerHTML = ifCompactHTML(d);
    } else {
      el.className = 'ini-card';
      el.href = '/initiatieven/' + d.slug;
      el.innerHTML = ifCardHTML(d);
    }
    iniGrid.appendChild(el);
  });
  iniGrid.hidden = !zicht.length;
  ifEl.leeg.hidden = !!zicht.length;
  ifEl.leegTxt.textContent = IF.inview ? 'Verschuif de kaart of zet ‘Toon alleen wat op de kaart staat’ uit. Of start zelf een Initiatief voor jouw vereniging, stichting of school.' : 'Haal een filter weg of kies een andere Kern. Of start zelf een Initiatief voor jouw vereniging, stichting of school.';
  ifEl.result.textContent = zicht.length === 1 ? '1 gevonden' : zicht.length + ' gevonden';
  ifEl.titel.textContent = IF.kern ? 'Initiatieven in ' + ifKern(IF.kern).naam : 'Initiatieven in gemeente Lochem';
  ifEl.txt.textContent = IF.sectors.length ? 'Sectoren' : 'Alle sectoren';
  ifEl.cnt.hidden = !IF.sectors.length;
  ifEl.cnt.textContent = IF.sectors.length;
  ifRenderKernen();
  ifRenderChips();
  ifRenderPanel(gefilterd);
  ifSchrijfUrl();
  ifUpdateMarkers(gefilterd, refit);
}
function ifWis(t, v) {
  if (t === 'kern' || t === 'all') { IF.kern = ''; IF.panel = false; }
  if (t === 'sector') IF.sectors = IF.sectors.filter(function (nr) { return nr !== v; });
  if (t === 'all') IF.sectors = [];
  if (t === 'soort' || t === 'all') IF.soort = '';
  if (t === 'status' || t === 'all') IF.status = '';
  if (t === 'q' || t === 'all') IF.q = '';
  ifSyncUi();
  ifUpdate(true);
  if (t === 'kern' || t === 'all') ifVliegNaarKern('');
}
function ifZetKern(id) { IF.kern = id; IF.panel = !!id; ifUpdate(false); ifVliegNaarKern(id); }
function ifKopieer() {
  var uit = document.getElementById('if-copied');
  var zet = function (m) { if (uit) uit.textContent = m; };
  var mis = 'Kopiëren lukt hier niet. Kopieer de link uit de adresbalk.';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(location.href).then(function () { zet('Link gekopieerd.'); }, function () { zet(mis); });
  } else { zet(mis); }
}

/* Kern-paneel */
function ifRenderPanel(gefilterd) {
  var p = ifEl.kp;
  if (!IF.kern || !IF.panel) { p.hidden = true; return; }
  var k = ifKern(IF.kern);
  p.hidden = false;
  var hier = gefilterd.filter(function (d) { return ifId(d.kern) === k.id; });
  var andere = IF.sectors.length || IF.soort || IF.status || IF.q;
  var spons = INI_DATA.filter(function (d) { return ifId(d.kern) === k.id; }).map(function (d) { return d.sponsor; });
  var lijst = hier.length
    ? '<ul class="if-kplijst">' + hier.map(function (d) {
        var s = iniSector(d.sector);
        return '<li><button type="button" data-sel="' + d.slug + '"><span class="dot" style="background:' + s.hex + '"></span><span>' + iniEsc(d.titel) + '</span></button></li>';
      }).join('') + '</ul>'
    : '<p class="note">' + (andere ? 'Geen Initiatieven in ' + iniEsc(k.naam) + ' bij deze filters.' : 'Hier staat nog geen Initiatief. Misschien start jouw vereniging, stichting of school de eerste.') + ' <a href="/starten">Start een Initiatief</a></p>';
  var sp = spons.length
    ? '<h4>Mede mogelijk gemaakt door</h4><p class="note">Sponsors dragen de kosten, zodat elke euro die je hier deelt aankomt. Voorbeeld-Sponsors: fictieve bedrijven.</p><div class="if-kpsponsors">' + spons.map(function (x) {
        return '<div class="if-kpsponsor"><span class="m" style="background:' + x.kleur + ';border-radius:' + (x.vorm === 'vierkant' ? '8px' : '50%') + '"><svg viewBox="0 0 48 48" aria-hidden="true">' + SP_MARK[x.logo](x.kleur) + '</svg></span><span>' + iniEsc(x.naam) + '</span></div>';
      }).join('') + '</div>'
    : '';
  p.innerHTML =
    '<div class="if-kpkop"><p>Gemeente Lochem</p><h3 id="if-kp-titel">' + iniEsc(k.naam) + '</h3><button type="button" class="if-kpsluit" id="if-kp-sluit" aria-label="Paneel sluiten">×</button></div>' +
    '<h4>Initiatieven in ' + iniEsc(k.naam) + '</h4>' + (andere ? '<p class="note">Met je huidige filters.</p>' : '') + lijst + sp +
    '<div class="if-kpuitnodiging"><strong>Heb je een bedrijf in ' + iniEsc(k.naam) + '?</strong><p>Jij maakt geven in ' + iniEsc(k.naam) + ' gratis. Je draagt bij aan de kosten, zodat elke gift heel aankomt.</p><a href="/contact?rol=Sponsor">Word Sponsor</a></div>';
}
ifEl.kp.addEventListener('click', function (e) {
  if (e.target.closest('#if-kp-sluit')) {
    IF.panel = false; ifEl.kp.hidden = true;
    var lb = ifKernLabels[IF.kern] && ifKernLabels[IF.kern].getElement();
    var knop = lb && lb.querySelector('button'); if (knop) knop.focus();
    return;
  }
  var b = e.target.closest('[data-sel]'); if (b) ifSelect(b.getAttribute('data-sel'), 'lijst');
});

/* Kaart */
var ifMap = null, ifMarkers = {}, ifKernLabels = {}, ifBuurtLayer = null, ifKaartStatus = 0, ifKaartWacht = [], ifGetoond = false;
function ifLaadKaart(klaar) {
  if (ifKaartStatus === 2) { klaar(); return; }
  if (klaar) ifKaartWacht.push(klaar);
  if (ifKaartStatus === 1 || ifKaartStatus === 3) return;
  ifKaartStatus = 1;
  var mislukt = function () {
    ifKaartStatus = 3;
    ifEl.maplaad.hidden = false;
    ifEl.maplaad.innerHTML = '<p>De kaart kon niet worden geladen. Alle Initiatieven staan in de lijst.</p>';
  };
  var laad = function (src, ok) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = mislukt; document.head.appendChild(s); };
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = '/assets/kaart/leaflet.css';
  css.onerror = mislukt;
  css.onload = function () {
    laad('/assets/kaart/leaflet.js', function () {
      laad('/assets/kaart/lochem-geo.js', function () {
        ifInitKaart();
        ifKaartStatus = 2;
        ifEl.maplaad.hidden = true;
        var w = ifKaartWacht.slice(); ifKaartWacht = [];
        w.forEach(function (f) { f(); });
      });
    });
  };
  document.head.appendChild(css);
}
function ifInitKaart() {
  var GEO = window.MO_GEO;
  ifMap = L.map('if-map', { zoomSnap: 0.25, minZoom: 10.5, maxZoom: 16, scrollWheelZoom: false, attributionControl: true, zoomControl: false });
  L.control.zoom({ position: 'topleft', zoomInTitle: 'Inzoomen', zoomOutTitle: 'Uitzoomen' }).addTo(ifMap);
  ifMap.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  ifMap.attributionControl.addAttribution('Grenzen © CBS, PDOK');
  L.geoJSON(GEO.buren, { style: { className: 'buur' }, interactive: false }).addTo(ifMap);
  GEO.buren.features.forEach(function (f) {
    var c = L.geoJSON(f).getBounds().getCenter();
    L.marker(c, { interactive: false, keyboard: false, icon: L.divIcon({ className: '', html: '<span class="buur-label">' + iniEsc(f.properties.naam) + '</span>', iconSize: [0, 0] }) }).addTo(ifMap);
  });
  var gem = L.geoJSON(GEO.gemeente, { style: { className: 'gem' }, interactive: false }).addTo(ifMap);
  ifBuurtLayer = L.geoJSON(GEO.buurten, { interactive: false, style: function (f) { return { className: 'bu' + (IF_KERNBUURT.indexOf(f.properties.code.slice(6)) >= 0 ? ' kernbuurt' : '') }; } }).addTo(ifMap);
  IF_KERNEN.forEach(function (k) {
    ifKernLabels[k.id] = L.marker(k.c, { keyboard: false, zIndexOffset: -500, icon: L.divIcon({ className: 'kern-label', html: '<button type="button" data-kern="' + k.id + '" aria-label="Zoom in op ' + iniEsc(k.naam) + '">' + iniEsc(k.naam) + '</button>', iconSize: [0, 0] }) }).addTo(ifMap);
  });
  ifMap.getContainer().addEventListener('click', function (e) {
    var b = e.target.closest('.kern-label button');
    if (b) { e.stopPropagation(); ifZetKern(b.getAttribute('data-kern')); return; }
    var t = e.target.closest('[data-show]');
    if (t) ifToonInLijst(t.getAttribute('data-show'));
  });
  var gb = gem.getBounds();
  ifMap.setMaxBounds(gb.pad(0.6));
  ifMap.on('click', function () { ifMap.scrollWheelZoom.enable(); });
  ifMap.getContainer().addEventListener('mouseleave', function () { ifMap.scrollWheelZoom.disable(); });
  ifMap.on('moveend', function () { if (IF.inview) ifUpdate(false); });
  INI_DATA.forEach(function (d) {
    var s = iniSector(d.sector);
    var m = L.marker([d.lat, d.lng], {
      title: d.titel + ', ' + d.kern + ' (' + s.naam + ')', alt: d.titel, riseOnHover: true,
      icon: L.divIcon({ className: 'if-pin', html: '<span class="p" style="--c:' + s.hex + '"><img src="/assets/iconen/kleur/' + IF_ICON[d.sector] + '.svg" alt=""></span>', iconSize: [0, 0], popupAnchor: [0, -14] })
    });
    m.bindPopup(function () {
      return '<div class="if-pop"><div class="sec"><span class="dot" style="background:' + s.hex + '"></span>' + iniEsc(s.naam) + '</div><h3>' + iniEsc(d.titel) + '</h3><p>' + iniEsc(d.vz) + '</p><p><b>' + iniEsc(d.beg) + '</b>, ' + iniEsc(d.kern) + '</p>' +
        '<div class="acties"><a href="/initiatieven/' + d.slug + '">Bekijk het Initiatief</a><button type="button" class="if-textbtn" data-show="' + d.slug + '">Toon in de lijst</button></div></div>';
    }, { maxWidth: 280 });
    m.on('click', function () { ifSelect(d.slug, 'kaart'); });
    ifMarkers[d.slug] = m;
  });
}
function ifFitStart() {
  if (IF.kern) { ifVliegNaarKern(IF.kern, true); return; }
  ifMap.fitBounds(L.geoJSON(window.MO_GEO.gemeente).getBounds(), { padding: [30, 30], animate: false });
}
function ifPaneelPad() {
  var ph = ifEl.kp.hidden ? 0 : ifEl.kp.offsetHeight;
  if (ifMobiel()) return { paddingTopLeft: [24, 70], paddingBottomRight: [24, ph + 24] };
  return { paddingTopLeft: [40, 70], paddingBottomRight: [IF.panel && IF.kern ? 380 : 40, 40] };
}
function ifVliegNaarKern(id, direct) {
  if (!ifMap) return;
  var set = id ? ifKern(id).bu : null;
  var bounds = null;
  ifBuurtLayer.eachLayer(function (l) {
    var code = l.feature.properties.code.slice(6), aan = !!set && set.indexOf(code) >= 0;
    var el = l.getElement(); if (el) el.classList.toggle('sel', aan);
    if (aan) bounds = bounds ? bounds.extend(l.getBounds()) : L.latLngBounds(l.getBounds().getSouthWest(), l.getBounds().getNorthEast());
  });
  Object.keys(ifKernLabels).forEach(function (kid) { var el = ifKernLabels[kid].getElement(); if (el) el.classList.toggle('is-sel', kid === id); });
  var rustig = direct || ifRustig();
  var gb = L.geoJSON(window.MO_GEO.gemeente).getBounds();
  if (bounds) { var o = Object.assign(ifPaneelPad(), { maxZoom: 14.5 }); if (rustig) { o.animate = false; ifMap.fitBounds(bounds, o); } else { o.duration = 0.7; ifMap.flyToBounds(bounds, o); } }
  else { if (rustig) ifMap.fitBounds(gb, { padding: [30, 30], animate: false }); else ifMap.flyToBounds(gb, { padding: [30, 30], duration: 0.7 }); }
}
function ifUpdateMarkers(gefilterd, refit) {
  if (!ifMap) return;
  var ids = {}; gefilterd.forEach(function (d) { ids[d.slug] = true; });
  Object.keys(ifMarkers).forEach(function (id) {
    var m = ifMarkers[id];
    if (ids[id]) { if (!ifMap.hasLayer(m)) m.addTo(ifMap); var el = m.getElement(); if (el) el.classList.toggle('is-sel', id === IF.sel); }
    else if (ifMap.hasLayer(m)) ifMap.removeLayer(m);
  });
  if (refit && !IF.inview && !IF.kern && gefilterd.length && gefilterd.length < INI_DATA.length) {
    var b = L.latLngBounds(gefilterd.map(function (d) { return [d.lat, d.lng]; }));
    var o = { padding: [70, 70], maxZoom: 13.5 };
    if (ifRustig()) { o.animate = false; ifMap.fitBounds(b, o); } else { o.duration = 0.6; ifMap.flyToBounds(b, o); }
  }
}
function ifSelect(slug, bron) {
  IF.sel = slug;
  iniGrid.querySelectorAll('.if-ccard').forEach(function (c) { c.setAttribute('aria-current', c.getAttribute('data-slug') === slug); });
  Object.keys(ifMarkers).forEach(function (id) { var el = ifMarkers[id].getElement(); if (el) el.classList.toggle('is-sel', id === slug); });
  var d = INI_DATA.filter(function (x) { return x.slug === slug; })[0]; if (!d) return;
  if (bron === 'lijst' && ifMap) {
    ifMap.flyTo([d.lat, d.lng], Math.max(ifMap.getZoom(), 14), { duration: ifRustig() ? 0 : 0.6 });
    if (ifMarkers[slug]) ifMarkers[slug].openPopup();
  }
  if (bron === 'kaart' && !ifMobiel()) {
    var c = iniGrid.querySelector('.if-ccard[data-slug="' + slug + '"]');
    if (c) c.scrollIntoView({ block: 'nearest', behavior: ifRustig() ? 'auto' : 'smooth' });
  }
}
function ifToonInLijst(slug) {
  if (ifMobiel()) ifZetView('lijst');
  var zoek = function () {
    var c = iniGrid.querySelector('[data-slug="' + slug + '"]');
    if (!c) return;
    c.scrollIntoView({ block: 'center' });
    var f = c.querySelector('h4 button') || c; if (f.focus) f.focus({ preventScroll: true });
  };
  setTimeout(zoek, 30);
}
iniGrid.addEventListener('click', function (e) {
  var c = e.target.closest('.if-ccard'); if (!c || e.target.closest('a')) return;
  ifSelect(c.getAttribute('data-slug'), 'lijst');
});
function ifZetView(v) {
  IF.view = v;
  ifSyncUi();
  if (v === 'kaart') {
    ifLaadKaart(function () {
      ifMap.invalidateSize({ animate: false });
      if (!ifGetoond) { ifGetoond = true; ifFitStart(); }
      ifUpdate(false);
    });
  }
  ifUpdate(false);
}
function ifVerversKaart() { if (ifMap && IF.view === 'kaart') ifMap.invalidateSize({ animate: false }); }

ifEl.opts.innerHTML = sectoren.map(function (s) {
  return '<label class="if-opt"><input type="checkbox" value="' + s.nr + '"><img src="/assets/iconen/kleur/' + IF_ICON[s.nr] + '.svg" alt=""><span>' + iniEsc(s.naam) + '</span></label>';
}).join('');
ifEl.soort.insertAdjacentHTML('beforeend', IF_SOORTEN.map(function (x) { return '<option value="' + iniEsc(x) + '">' + iniEsc(x) + '</option>'; }).join(''));

function ifPaneel(open) { ifEl.panel.hidden = !open; ifEl.btn.setAttribute('aria-expanded', open); if (open) { var f = ifEl.panel.querySelector('input'); if (f) f.focus(); } }
ifEl.btn.addEventListener('click', function () { ifPaneel(ifEl.panel.hidden); });
document.getElementById('if-sector-close').addEventListener('click', function () { ifPaneel(false); ifEl.btn.focus(); });
document.getElementById('if-sector-clear').addEventListener('click', function () { IF.sectors = []; ifSyncUi(); ifUpdate(true); });
ifEl.opts.addEventListener('change', function (e) {
  var nr = e.target.value;
  IF.sectors = IF.sectors.filter(function (x) { return x !== nr; });
  if (e.target.checked) IF.sectors.push(nr);
  IF.sectors.sort();
  ifUpdate(true);
});
document.addEventListener('click', function (e) { if (!ifEl.panel.hidden && !e.target.closest('.if-sectorwrap')) ifPaneel(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ifEl.panel.hidden) { ifPaneel(false); ifEl.btn.focus(); } });
ifEl.soort.addEventListener('change', function () { IF.soort = ifEl.soort.value; ifUpdate(true); });
ifEl.status.addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return;
  IF.status = b.getAttribute('data-v'); ifSyncUi(); ifUpdate(true);
});
ifEl.kernen.addEventListener('click', function (e) {
  var b = e.target.closest('button[data-kern]'); if (!b) return;
  ifZetKern(b.getAttribute('data-kern'));
});
ifEl.view.addEventListener('click', function (e) {
  var b = e.target.closest('button[data-view]'); if (!b) return;
  ifZetView(b.getAttribute('data-view'));
});
ifEl.inview.addEventListener('change', function () { IF.inview = ifEl.inview.checked; ifUpdate(false); });
var ifTimer;
ifEl.q.addEventListener('input', function () { clearTimeout(ifTimer); ifTimer = setTimeout(function () { IF.q = ifEl.q.value.trim(); ifUpdate(true); }, 120); });
ifEl.chips.addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return;
  if (b.getAttribute('data-t') === 'share') { ifKopieer(); return; }
  ifWis(b.getAttribute('data-t'), b.getAttribute('data-v'));
});
document.getElementById('if-leeg-wis').addEventListener('click', function () { ifWis('all'); });

ifLeesUrl();
ifSyncUi();
ifUpdate(false);
if (IF.view === 'kaart') ifZetView('kaart');
})();
