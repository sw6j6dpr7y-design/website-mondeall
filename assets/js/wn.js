/* Starten en Werkplaats (klikbaar voorbeeld): snelstart, Initiatieven, bewerken, Begunstigden, voorzitter.
   Er wordt niets verstuurd. Invoer blijft alleen in dit tabblad (sessionStorage). */
(function () {
  var app = document.getElementById('wn-app');
  if (!app) return;
  var VIEW = app.getAttribute('data-weergave');
  var P = { snel: '/starten/nieuw', dash: '/werkplaats', ini: '/werkplaats/initiatief', beg: '/werkplaats/begunstigden', vz: '/werkplaats/voorzitter' };
  var KEY = 'mondeall-wn';
  var DEF = { org: '', plaats: '', gem: '', direct: false, titel: '', email: '', concept: false,
    verhaal: 'De komende weken zijn er kosten voor herstel van het dak, de ramen en de verwarming, zodat leden en buurtbewoners weer veilig kunnen samenkomen.',
    checks: [false, false, false, false], done: { basis: true }, bnaam: null, vorm: 'Vereniging', kvk: '', web: '', vz: '', mail: '', tel: '',
    invite: 0, iban: '', fisc: null, akkoord: false };
  var S = {};
  try { S = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  Object.keys(DEF).forEach(function (k) { if (S[k] === undefined) S[k] = DEF[k]; });
  var U = { stap: 1, q: '', gq: '', fase: 'maken', open: 'basis', sel: 0, verl: 0, panel: '', upd: '', helperSent: false, updates: [{ d: '[DATUM]', t: 'De aannemer is gestart met het dak.' }],
    hulpStap: 0, hulp: 'Verhaal', foto: '', ingediend: false, fout: '', vzStap: 1, code: '' };
  function bewaar() { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function heeft(x) { return !!(x && String(x).trim()); }
  var DEMO = { org: 'Voetbalvereniging De Vogels', gem: 'Lochem', titel: 'Het clubhuis van De Vogels heeft stormschade' };
  function org() { return heeft(S.org) ? S.org : DEMO.org; }
  function gem() { return heeft(S.gem) ? S.gem : DEMO.gem; }
  function titel() { return heeft(S.titel) ? S.titel : DEMO.titel; }
  function bnaam() { return S.bnaam != null ? S.bnaam : org(); }

  var MERK = '<img src="/assets/klavertje-mondeall.png" alt="" width="28" height="28"><span class="wn-merk-naam">Mondéall</span>';
  function koptelefoon(label) {
    return '<header class="wn-tel-kop"><a class="wn-merk" href="/" aria-label="Mondéall, naar de beginpagina">' + MERK + '</a><span class="wn-mono">' + esc(label) + '</span></header>';
  }
  function kopWerkplaats(actief) {
    function a(href, label, id) { return '<a href="' + href + '"' + (actief === id ? ' aria-current="page"' : '') + '>' + label + '</a>'; }
    return '<header class="wn-kop"><div class="wn-kop-in"><div class="wn-kop-links"><a class="wn-merk" href="/" aria-label="Mondéall, naar de beginpagina">' + MERK + '</a><span class="wn-streep" aria-hidden="true"></span><span class="wn-kop-wp">Werkplaats</span></div>' +
      '<nav aria-label="Werkplaats">' + a(P.dash, 'Initiatieven', 'dash') + a(P.beg, 'Begunstigden', 'beg') + '<a href="/hulp/starters">Hulp</a></nav></div></header>';
  }

  /* ---------- 1. snelstart ---------- */
  var WP = [['Almen', 'Lochem'], ['Barchem', 'Lochem'], ['Eefde', 'Lochem'], ['Epse', 'Lochem'], ['Gorssel', 'Lochem'], ['Harfsen', 'Lochem'], ['Lochem', 'Lochem'], ['Hengelo', 'Bronckhorst'], ['Hengelo', 'Hengelo'], ['Zutphen', 'Zutphen'], ['Warnsveld', 'Zutphen'], ['Deventer', 'Deventer'], ['Apeldoorn', 'Apeldoorn']];
  var GL = ['Lochem', 'Zutphen', 'Bronckhorst', 'Berkelland', 'Apeldoorn', 'Deventer', 'Hengelo', 'Hof van Twente', 'Oost Gelre', 'Winterswijk', 'Voorst'];
  function invoer(id, label, waarde, ph, extra) {
    return '<label class="wn-veld" for="' + id + '">' + label + '<input id="' + id + '" value="' + esc(waarde) + '" placeholder="' + esc(ph || '') + '" data-in="' + id + '" ' + (extra || '') + '></label>';
  }
  function snel() {
    var h = koptelefoon(['Stap 1 van 2', 'Stap 2 van 2', 'Concept bewaard'][U.stap - 1]) + '<main class="wn-tel-main" id="inhoud-wn">';
    if (U.stap === 1) {
      h += '<div class="wn-blok"><h1>Start een Initiatief</h1><p class="wn-zacht">Drie dingen en je basis staat. Alles kun je later aanpassen.</p></div>';
      h += invoer('s-org', 'Naam van de organisatie', S.org, 'Bijvoorbeeld Basisschool De Regenboog', 'autocomplete="organization"');
      h += '<div class="wn-blok">';
      if (!S.direct) {
        h += invoer('s-q', 'Plaats', U.q, 'Begin te typen, bijvoorbeeld Barchem', 'autocomplete="off"');
        var q = U.q.trim().toLowerCase();
        var treffers = (q && U.q !== S.plaats) ? WP.filter(function (r) { return r[0].toLowerCase().indexOf(q) === 0; }) : [];
        if (treffers.length) {
          h += '<div class="wn-lijst">' + treffers.slice(0, 6).map(function (r, i) { return '<button type="button" data-act="kies-plaats" data-i="' + WP.indexOf(r) + '"><span>' + esc(r[0]) + '</span><span class="wn-mono">GEMEENTE ' + esc(r[1].toUpperCase()) + '</span></button>'; }).join('') + '</div>';
        } else if (q && U.q !== S.plaats) {
          h += '<p class="wn-zacht klein">Geen plaats gevonden. Controleer de spelling, of kies direct een gemeente.</p>';
        }
        if (S.gem && U.q === S.plaats && S.plaats) {
          h += '<div class="wn-gem"><span><span class="wn-mono wn-blokje">GEMEENTE</span>' + esc(S.gem) + '</span><button type="button" class="wn-link" data-act="direct">Niet de juiste gemeente?</button></div>';
        } else {
          h += '<button type="button" class="wn-link" data-act="direct">Staat je plaats er niet bij? Kies direct een gemeente</button>';
        }
      } else {
        h += invoer('s-gq', 'Gemeente', U.gq, 'Begin te typen, bijvoorbeeld Lochem', 'autocomplete="off"');
        var g = U.gq.trim().toLowerCase();
        var gt = (g && U.gq !== S.gem) ? GL.filter(function (n) { return n.toLowerCase().indexOf(g) === 0; }) : [];
        if (gt.length) h += '<div class="wn-lijst">' + gt.slice(0, 5).map(function (n) { return '<button type="button" data-act="kies-gem" data-n="' + esc(n) + '"><span>' + esc(n) + '</span></button>'; }).join('') + '</div>';
        if (S.gem && U.gq === S.gem) h += '<span class="wn-chip">Gemeente ' + esc(S.gem) + '</span>';
        h += '<button type="button" class="wn-link" data-act="plaats">Zoek liever op plaats</button>';
      }
      h += '</div>';
      h += invoer('s-titel', 'Titel van je Initiatief', S.titel, 'Wat is er nodig, in een paar woorden');
    } else if (U.stap === 2) {
      var rijen = [['ORGANISATIE', heeft(S.org) ? S.org : 'Nog niet ingevuld'], ['PLAATS', S.direct ? 'Direct een gemeente gekozen' : (heeft(S.plaats) ? S.plaats : 'Nog niet gekozen')], ['GEMEENTE', heeft(S.gem) ? S.gem : 'Nog niet gekozen'], ['TITEL', heeft(S.titel) ? S.titel : 'Nog niet ingevuld']];
      h += '<div class="wn-blok"><h1 class="h2">Je basis staat. Bewaar hem.</h1></div>';
      h += '<div class="wn-kaart wn-samenvatting">' + rijen.map(function (r) { return '<div class="wn-rij"><div><span class="wn-mono wn-blokje">' + r[0] + '</span><span>' + esc(r[1]) + '</span></div><button type="button" class="wn-link" data-act="terug1">Wijzig</button></div>'; }).join('') + '</div>';
      h += '<label class="wn-veld" for="s-email">Je e-mailadres<input id="s-email" type="email" value="' + esc(S.email) + '" placeholder="naam@voorbeeld.nl" data-in="s-email" autocomplete="email"></label>';
      if (U.fout) h += '<p class="wn-fout" role="alert">' + esc(U.fout) + '</p>';
      h += '<p class="wn-zacht klein">Gebruik het adres dat je wilt, ook een persoonlijk adres. Je kunt het later altijd wijzigen. Je hoeft geen wachtwoord te kiezen: we sturen je een link waarmee je je Initiatief opent. We gebruiken je adres alleen hiervoor, nooit voor een nieuwsbrief.</p>';
    } else {
      h += '<div class="wn-rond" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#005248" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></div>';
      h += '<h1 class="h2">Kijk in je mail.</h1>';
      h += '<p>Klik op de link en je Initiatief staat in je Werkplaats. Daar werk je het stap voor stap uit, met links het invullen en rechts hoe het eruit komt te zien.</p>';
      h += '<p class="wn-zacht klein">Je Initiatief is nog niet zichtbaar voor anderen. Dat gebeurt pas als jij hem indient.</p>';
      h += '<p class="wn-zacht klein">Dit is een voorbeeld: er is geen mail verstuurd. Met de knop hieronder ga je direct naar de Werkplaats.</p>';
      h += '<a class="wn-knop vol groot" href="' + P.dash + '">Open mijn Werkplaats</a>';
    }
    h += '</main>';
    if (U.stap < 3) {
      h += '<footer class="wn-tel-voet">' + (U.stap === 2 ? '<button type="button" class="wn-knop licht" data-act="terug1">Terug</button>' : '') +
        '<button type="button" class="wn-knop vol" data-act="volgende">' + (U.stap === 1 ? 'Verder' : 'Stuur mij de bewaarlink') + '</button></footer>';
    }
    return '<div class="wn-tel">' + h + '</div>';
  }

  /* ---------- 2. Werkplaats: Initiatieven ---------- */
  var EINDES = ['ma 23 november', 'ma 30 november', 'ma 7 december', 'ma 14 december'];
  function dash() {
    var voorbeeld = [
      { titel: 'Het clubhuis van De Vogels heeft stormschade', status: 'LIVE', regel: 'Lochem · 11 Samenleving & Maatschappij', meta: 'VOETBALVERENIGING DE VOGELS · LOCHEM · 11.03', fase: 3, beg: 'Voetbalvereniging De Vogels', begStatus: 'Gegevens compleet' },
      { titel: 'Nieuwe tribunebankjes', status: 'FORMEEL AFRONDEN', regel: 'Lochem · sector volgt bij de controle', meta: 'VOETBALVERENIGING DE VOGELS · LOCHEM', fase: 1, beg: 'Voetbalvereniging De Vogels', begStatus: 'Wacht op de voorzitter: rekening en fiscale status' },
      { titel: 'Verlichting voor de muziektent', status: 'AFRONDING', regel: 'Lochem · 05 Kunst & Cultuur', meta: '[BEGUNSTIGDE] · LOCHEM', fase: 4, beg: '[Begunstigde]', begStatus: 'Gegevens compleet' }
    ];
    var data = voorbeeld.slice();
    if (S.concept) {
      data.unshift({ titel: titel(), status: 'CONCEPT', regel: gem() + ' · sector volgt bij de controle', meta: org().toUpperCase() + ' · ' + gem().toUpperCase(), fase: 0, beg: org(), begStatus: S.invite === 2 ? 'Gegevens compleet' : 'Nog aan te vullen' });
    }
    if (U.sel >= data.length) U.sel = 0;
    var sel = data[U.sel], ph = sel.fase, v = U.verl, max = v >= 3;
    var h = kopWerkplaats('dash') + '<div class="wn-pagina">';
    h += '<div class="wn-titelrij"><div><h1>Werkplaats</h1><p class="wn-zacht">Hier beheer je je Initiatieven en de gegevens van je organisatie.</p></div><a class="wn-knop vol" href="' + P.snel + '">Nieuw Initiatief</a></div>';
    h += '<div class="wn-twee"><section class="wn-links" aria-label="Mijn Initiatieven"><h2>Mijn Initiatieven</h2>';
    h += data.map(function (d, i) {
      return '<button type="button" class="wn-ini' + (i === U.sel ? ' aan' : '') + '" data-act="kies-ini" data-i="' + i + '" aria-pressed="' + (i === U.sel) + '"><span class="wn-mono wn-diep">' + esc(d.status) + '</span><b>' + esc(d.titel) + '</b><span class="wn-zacht klein">' + esc(d.regel) + '</span></button>';
    }).join('');
    h += '</section><section class="wn-rechts" aria-label="Details">';
    var fl = [['Concept', ''], ['Formeel afronden', ''], ['Controle', 'DOOR MONDÉALL'], ['Live', '21 DAGEN'], ['Afronding', '52 WEKEN'], ['Voltooid', '']];
    h += '<div class="wn-kaart wn-groot"><span class="wn-mono wn-zacht">' + esc(sel.meta) + '</span><h2 class="wn-h2groot">' + esc(sel.titel) + '</h2>';
    h += '<ol class="wn-fases" aria-label="Fase van dit Initiatief">' + fl.map(function (f, i) {
      return '<li class="' + (i < ph ? 'klaar' : (i === ph ? 'nu' : '')) + '"' + (i === ph ? ' aria-current="step"' : '') + '><span class="wn-balk"></span><span class="wn-fase-naam">' + f[0] + '</span><span class="wn-mono wn-zacht">' + f[1] + '</span></li>';
    }).join('') + '</ol>';
    var nu = {
      0: ['Je concept is nog niet af.', 'Verder in de Werkplaats', P.ini],
      1: ['Rond de formele gegevens af: Begunstigde en afspraken. Dan kun je indienen. Sector en code volgen bij de controle.', 'Verder in de Werkplaats', P.ini],
      2: ['We controleren je Initiatief en stellen de sector en het aandachtsgebied vast.', '', ''],
      3: ['Je Initiatief loopt tot ' + EINDES[v] + '.', '', ''],
      4: ['Je Initiatief is afgelopen. Laat de Geld Delers weten wat er met hun gift is gedaan.', '', '']
    }[ph];
    h += '<div class="wn-nu"><span>' + esc(nu[0]) + '</span>' + (nu[1] ? '<a class="wn-knop vol klein" href="' + nu[2] + '">' + nu[1] + '</a>' : '') + '</div></div>';

    var defs = [
      ['bewerken', 'Bewerken', 'Pas tekst, beeld en titel aan.', 'M4 20l4-1 11-11-3-3L5 16l-1 4z', [0, 1], 'link', P.ini, 'Na indienen staat de tekst vast. Een update kan wel.'],
      ['verleng', 'Verleng met 1 week', max ? 'Maximum van 6 weken bereikt.' : 'Nieuwe einddatum: ' + EINDES[v + 1] + '. Nog ' + (3 - v) + ' keer mogelijk.', 'M5 5h14v14H5z M5 9h14 M12 12v5 M9.5 14.5h5', max ? [] : [3], 'btn', '', 'Beschikbaar in de fase Live.'],
      ['update', 'Geef een update', 'Laat de Geld Delers weten hoe het gaat.', 'M4 5h16v11H9l-5 4V5z', [3, 4], 'btn', '', 'Beschikbaar vanaf Live.'],
      ['herstel', 'Start een herstelronde', 'Eenmalig: nog eens 3 weken, wekelijks verlengbaar tot 6.', 'M20 12a8 8 0 1 1-3-6.2 M20 4v5h-5', [4], 'btn', '', 'Beschikbaar na afloop, eenmalig.'],
      ['terug', 'Schrijf de terugkoppeling', 'Vertel wat er met de giften is gedaan, binnen 52 weken.', 'M6 3h9l4 4v14H6z M9 13l2.5 2.5L16 11', [4], 'btn', '', 'Beschikbaar na afloop.'],
      ['helper', 'Vraag een Helper', 'Een vrijwilliger kijkt met je mee.', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 19c0-3 3-5 6-5s6 2 6 5 M17 8a2.5 2.5 0 1 1 0 5 M17 15c2.5 0 4 1.5 4 4', [0, 1, 2, 3, 4], 'btn', '', '']
    ];
    var alle = defs.map(function (d) { return { id: d[0], label: d[1], uitleg: d[2], icon: d[3], aan: d[4].indexOf(ph) > -1, soort: d[5], href: d[6], reden: d[7] }; });
    var tools = alle.filter(function (t) { return t.aan; }).concat(alle.filter(function (t) { return !t.aan; }));
    function svg(p, kleur) { return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="' + kleur + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + p + '"/></svg>'; }
    h += '<div class="wn-blok"><div><h2 class="wn-h2m">Gereedschapkist</h2><span class="wn-zacht">Wat je nu kunt doen. Grijze onderdelen komen beschikbaar in een latere fase.</span></div><div class="wn-tegels">' + tools.map(function (t) {
      var inhoud = svg(t.icon, t.aan ? '#005248' : '#6b7a75') + '<b>' + esc(t.label) + '</b><span>' + esc(t.aan ? t.uitleg : t.reden) + '</span>';
      if (!t.aan) return '<div class="wn-tegel slot">' + inhoud + '</div>';
      if (t.soort === 'link') return '<a class="wn-tegel" href="' + t.href + '">' + inhoud + '</a>';
      return '<button type="button" class="wn-tegel" data-act="tool-' + t.id + '">' + inhoud + '</button>';
    }).join('') + '</div></div>';

    if (U.panel === 'update') {
      h += '<div class="wn-paneel"><label for="upd" class="wn-paneel-kop">Geef een update</label><textarea id="upd" rows="4" data-in="upd" placeholder="Vertel wat er is gebeurd of wat er gaat gebeuren.">' + esc(U.upd) + '</textarea><span class="wn-zacht klein">Zonder bedragen en zonder oproepen tot haast. Je update staat op de pagina van je Initiatief.</span><div class="wn-acties"><button type="button" class="wn-knop vol klein" data-act="plaats-upd">Plaats update</button><button type="button" class="wn-link" data-act="sluit">Annuleer</button></div></div>';
    }
    if (U.panel === 'helper') {
      h += '<div class="wn-paneel"><span class="wn-paneel-kop">Vraag een Helper</span><span>Een Helper is een vrijwilliger die je op weg helpt met Mondéall. Hij of zij neemt contact op via je e-mailadres en ziet alleen dit Initiatief.</span>' +
        (U.helperSent ? '<span class="wn-diep">Verzoek verstuurd (voorbeeld). Een Helper neemt contact met je op.</span>' : '<div class="wn-acties"><button type="button" class="wn-knop vol klein" data-act="stuur-helper">Verstuur verzoek</button><button type="button" class="wn-link" data-act="sluit">Annuleer</button></div>') + '</div>';
    }
    var wk = 3 + v;
    h += '<div class="wn-vier">' + [['LIVE SINDS', 'ma 2 november', 'Eerste ronde'], ['LOOPT TOT', EINDES[v], wk + ' van maximaal 6 weken'], ['VERLENGD', v + ' van 3 keer', 'Daarna eenmalig een herstelronde'], ['AFRONDING TOT', '[datum]', '52 weken na afloop']].map(function (x) {
      return '<div class="wn-kaart"><span class="wn-mono wn-zacht">' + x[0] + '</span><b class="wn-getal">' + esc(x[1]) + '</b><span class="wn-zacht klein">' + esc(x[2]) + '</span></div>';
    }).join('') + '</div>';
    h += '<div class="wn-twee-kaarten"><div class="wn-kaart"><span class="wn-mono wn-zacht">BEGUNSTIGDE</span><b class="wn-h3">' + esc(sel.beg) + '</b><span class="wn-diep">' + esc(sel.begStatus) + '</span><a href="' + P.beg + '">Gegevens bekijken en aanvullen</a></div>' +
      '<div class="wn-kaart"><b class="wn-h3">Updates</b>' + U.updates.map(function (u) { return '<div class="wn-upd"><span class="wn-mono wn-zacht">' + esc(u.d) + '</span>' + esc(u.t) + '</div>'; }).join('') + '</div></div>';
    h += '</section></div></div>';
    return h;
  }

  /* ---------- 3. Werkplaats: Initiatief bewerken ---------- */
  var DEFS_INI = {
    maken: [['basis', 'Basis', 'Organisatie, gemeente, titel en je e-mailadres'], ['verhaal', 'Verhaal', 'Wat is er nodig, waarom, voor wie'], ['beeld', 'Beeld', 'Eén foto die laat zien waar het om gaat']],
    formeel: [['beg', 'Gegevens van de Begunstigde', 'Organisatie, voorzitter, bankrekening en fiscale status'], ['akkoord', 'Afspraken', 'Looptijd, giften en terugkoppeling']]
  };
  function ini() {
    var tel = function (k) { return DEFS_INI[k].filter(function (d) { return S.done[d[0]]; }).length; };
    var inMaken = U.fase === 'maken';
    var makenKlaar = tel('maken') === 3, allesKlaar = makenKlaar && tel('formeel') === 2;
    var h = kopWerkplaats('dash') + '<div class="wn-pagina">';
    h += '<div class="wn-titelrij"><div><span class="wn-mono wn-diep">CONCEPT · NOG NIET ZICHTBAAR</span><h1>' + esc(titel()) + '</h1><span class="wn-mono wn-diep klein">ALLES WORDT VANZELF BEWAARD (IN DIT TABBLAD)</span></div>';
    h += '<div class="wn-tabs" role="tablist" aria-label="Fase">' + [['maken', '1', 'Maken'], ['formeel', '2', 'Formeel afronden']].map(function (f) {
      return '<button type="button" role="tab" aria-selected="' + (U.fase === f[0]) + '" data-act="fase" data-f="' + f[0] + '"><span class="wn-mono">' + f[1] + '</span> ' + f[2] + ' <span class="wn-mono">' + tel(f[0]) + '/' + DEFS_INI[f[0]].length + '</span></button>';
    }).join('') + '</div></div>';
    h += '<div class="wn-twee"><section class="wn-form" aria-label="Invullen"><p class="wn-zacht">' + (inMaken ? 'Maak je Initiatief zoals jij het wilt vertellen. Formaliteiten komen pas in fase 2, vlak voor livegang.' : 'Rond hier alles formeel af. Pas als dit compleet is, kun je indienen voor de controle op volledigheid.') + '</p>';
    DEFS_INI[U.fase].forEach(function (d) {
      var id = d[0], klaar = !!S.done[id], open = U.open === id;
      h += '<article class="wn-sectie"><button type="button" class="wn-sectie-kop" data-act="sectie" data-id="' + id + '" aria-expanded="' + open + '"><span class="wn-stip' + (klaar ? ' klaar' : '') + '">' + (klaar ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : '') + '</span><span class="wn-sectie-titel"><b>' + d[1] + '</b><span class="wn-zacht klein">' + d[2] + '</span></span><span class="wn-mono ' + (klaar ? 'wn-diep' : 'wn-zacht') + '">' + (klaar ? 'KLAAR' : 'OPEN') + '</span></button>';
      if (open) {
        h += '<div class="wn-sectie-body">';
        if (id === 'basis') {
          h += invoer('i-org', 'Naam van de organisatie', org(), '') + invoer('i-gem', 'Gemeente', gem(), '') + invoer('i-titel', 'Titel', titel(), '') +
            '<label class="wn-veld" for="i-email">Je e-mailadres<input id="i-email" type="email" value="' + esc(S.email) + '" data-in="i-email"></label><p class="wn-zacht klein">Alles hier kun je op elk moment wijzigen, ook je e-mailadres.</p>';
        } else if (id === 'verhaal') {
          h += '<label class="wn-veld" for="i-verhaal">Wat is er nodig, waarom, en voor wie<textarea id="i-verhaal" rows="5" data-in="i-verhaal">' + esc(S.verhaal) + '</textarea></label><p class="wn-zacht klein">Noem geen bedrag: een getal in de tekst gaat werken als streefbedrag.</p>';
          h += '<fieldset class="wn-vinkjes"><legend>Past het bij Mondéall? Mijn Initiatief is:</legend>' + ['concreet', 'collectief', 'niet-persoonlijk', 'niet-commercieel'].map(function (l, i) {
            return '<label><input type="checkbox" data-chk="' + i + '"' + (S.checks[i] ? ' checked' : '') + '>' + l + '</label>';
          }).join('') + '<span class="wn-zacht klein">Lukt een vinkje niet? Dan kijkt een Helper graag mee hoe je het kunt omdenken.</span></fieldset>';
        } else if (id === 'beeld') {
          h += '<label class="wn-drop" for="i-foto"><input id="i-foto" type="file" accept="image/*" data-foto="1" class="verborgen"><span>' + (U.foto ? 'Foto gekozen. Kies een andere foto' : 'Sleep een foto hierheen of kies een bestand') + '</span></label><p class="wn-zacht klein">Een eigen foto van de plek of de mensen, met toestemming van wie erop staat. In dit voorbeeld blijft de foto alleen in je eigen browser.</p>';
        } else if (id === 'beg') {
          h += '<span>Je vult de organisatie en de voorzitter in, onder Begunstigden. De voorzitter voert zelf het IBAN en de fiscale status in via een link. Dit Initiatief gebruikt die gegevens automatisch.</span><a class="wn-knop vol" href="' + P.beg + '">Naar Begunstigden</a>';
        } else if (id === 'akkoord') {
          h += '<span>Een Initiatief loopt 3 weken; jij kunt wekelijks met 1 week verlengen tot 6 weken, daarna kan één herstelronde. Giften zijn onvoorwaardelijk. Realisatie binnen 1 jaar, terugkoppeling aan de Geld Delers binnen 52 weken.</span><span>De voorzitter bevestigt deze afspraken namens de Begunstigde, in de link die hij of zij ontvangt.</span>';
        }
        h += '<div><button type="button" class="wn-knop rand klein" data-act="klaar" data-id="' + id + '">' + (klaar ? 'Toch nog aanpassen' : 'Dit deel is klaar') + '</button></div></div>';
      }
      h += '</article>';
    });
    if (U.fase === 'formeel') {
      h += '<div class="wn-gestippeld"><b>Wordt bij de controle vastgesteld</b><span class="wn-zacht klein">Dit vullen wij in nadat je hebt ingediend. Jij hoeft hier niets te kiezen.</span><div class="wn-drie"><div><span class="wn-mono wn-zacht">SECTOR</span><br>Nog niet vastgesteld</div><div><span class="wn-mono wn-zacht">AANDACHTSGEBIED</span><br>Nog niet vastgesteld</div><div><span class="wn-mono wn-zacht">CODE</span><br>Nog niet vastgesteld</div></div></div>';
    }
    var aan = inMaken ? true : allesKlaar;
    h += '<div class="wn-acties"><button type="button" class="wn-knop groot ' + (aan ? 'vol' : 'uit') + '" data-act="primair" aria-disabled="' + (!aan) + '">' + (inMaken ? 'Naar formeel afronden' : 'Indienen') + '</button><span class="wn-zacht">' +
      (inMaken ? (makenKlaar ? 'Je verhaal staat.' : 'Je kunt al vooruitkijken naar fase 2.') : (allesKlaar ? 'Na de controle op volledigheid gaat je Initiatief live.' : 'Indienen kan als beide onderdelen klaar zijn.')) + '</span></div>';
    if (U.ingediend) h += '<p class="wn-kaart wn-diep" role="status">Ingediend (voorbeeld). Er is niets verstuurd. In het echte platform controleert Mondéall je Initiatief en stelt de sector vast.</p>';
    h += '</section>';

    h += '<section class="wn-voorbeeld" aria-label="Voorbeeld"><span class="wn-mono wn-zacht">VOORBEELD · ZO ZIET EEN GELD DELER HET</span><div class="wn-kaart wn-pv">';
    h += '<div class="wn-pv-foto">' + (U.foto ? '<img src="' + esc(U.foto) + '" alt="Gekozen foto van het Initiatief">' : '<span class="wn-mono">[FOTO VAN HET INITIATIEF]</span>') + '</div>';
    h += '<div class="wn-pv-body"><div class="wn-mono">' + esc(gem().toUpperCase()) + '</div><h2 class="wn-h2groot">' + esc(titel()) + '</h2><p>' + esc(S.verhaal) + '</p>';
    h += '<div class="wn-pv-voet"><span>' + esc(org()) + '</span><b>Loopt tot [einddatum]</b></div><span class="wn-pv-knop">Deel mee (actief na livegang)</span><span class="wn-zacht klein">Elke euro komt aan, omdat Sponsors de kosten dragen.</span></div></div>';
    h += '<div class="wn-hulp"><b class="wn-diep wn-h3">Hulp van een Helper</b><span>Een Helper is een vrijwilliger die je op weg helpt met Mondéall: meekijken, begeleiden bij het invullen. Een Helper noemt nooit een bedrag en vraagt nooit een handtekening.</span>';
    if (U.hulpStap === 0) h += '<button type="button" class="wn-knop rand klein" data-act="hulp-open">Vraag een Helper</button>';
    if (U.hulpStap === 1) {
      h += '<span>Waarbij wil je hulp?</span><div class="wn-chips">' + ['Verhaal', 'Beeld', 'Formele gegevens', 'Anders'].map(function (l) { return '<button type="button" class="wn-chipknop' + (l === U.hulp ? ' aan' : '') + '" aria-pressed="' + (l === U.hulp) + '" data-act="hulp-kies" data-l="' + l + '">' + l + '</button>'; }).join('') + '</div>' +
        '<div class="wn-acties"><button type="button" class="wn-knop vol klein" data-act="hulp-stuur">Verstuur verzoek</button><button type="button" class="wn-link" data-act="hulp-dicht">Annuleer</button></div><span class="wn-zacht klein">De Helper neemt contact op via het e-mailadres in je basis. Hij ziet alleen dit Initiatief.</span>';
    }
    if (U.hulpStap === 2) h += '<span>Verzoek verstuurd (voorbeeld). Een Helper neemt contact met je op. Intussen kun je gewoon verder.</span>';
    h += '</div></section></div></div>';
    return h;
  }

  /* ---------- 4. Werkplaats: Begunstigden ---------- */
  function begunstigden() {
    var digits = (S.tel.match(/[0-9]/g) || []).length;
    var vzOk = heeft(S.vz) && S.mail.indexOf('@') > 0 && digits >= 10;
    var ok = { org: heeft(bnaam()) && heeft(S.vorm) && heeft(S.kvk), vz: vzOk, bank: S.invite === 2 };
    var n = (ok.org ? 1 : 0) + (ok.vz ? 1 : 0) + (ok.bank ? 1 : 0);
    function sect(id, kop, sub, wie, binnen) {
      var status = ok[id] ? 'KLAAR' : (id === 'bank' && S.invite === 1 ? 'WACHT OP VOORZITTER' : 'OPEN');
      return '<section class="wn-kaart wn-sect"><div class="wn-sect-kop"><div><h3 class="wn-h3">' + kop + '</h3><span class="wn-zacht klein">' + sub + '</span></div><div class="wn-rechts-uit"><span class="wn-mono ' + (ok[id] ? 'wn-diep' : 'wn-zacht') + '">' + status + '</span><span class="wn-mono wn-zacht klein">' + wie + '</span></div></div>' + binnen + '</section>';
    }
    var h = kopWerkplaats('beg') + '<div class="wn-pagina smal"><div><h1>Begunstigden</h1><p class="wn-zacht">De gegevens van de organisatie leg je één keer vast. Elk Initiatief van deze organisatie gebruikt ze opnieuw.</p></div>';
    h += '<div class="wn-kaart wn-titelrij"><div><span class="wn-mono wn-zacht">BEGUNSTIGDE · GEBRUIKT DOOR 2 INITIATIEVEN</span><h2 class="wn-h2groot">' + esc(bnaam()) + '</h2></div><span class="wn-status' + (n === 3 ? ' ok' : '') + '">' + (n === 3 ? 'GEGEVENS COMPLEET' : 'NOG AAN TE VULLEN · ' + n + ' VAN 3') + '</span></div>';
    h += sect('org', 'Organisatie', 'Naam, rechtsvorm en KvK-nummer', 'JIJ VULT IN', '<div class="wn-raster">' + invoer('b-naam', 'Naam', bnaam(), '') + invoer('b-vorm', 'Rechtsvorm', S.vorm, 'Vereniging of stichting') + invoer('b-kvk', 'KvK-nummer', S.kvk, '8 cijfers', 'inputmode="numeric"') + invoer('b-web', 'Website (komt op de pagina van je Initiatief)', S.web, 'https://') + '</div>');
    h += sect('vz', 'Voorzitter', 'Wie we vragen de gegevens te bevestigen', 'JIJ VULT IN', '<div class="wn-raster">' + invoer('b-vz', 'Naam van de voorzitter', S.vz, '') + '<label class="wn-veld" for="b-mail">E-mailadres van de voorzitter<input id="b-mail" type="email" value="' + esc(S.mail) + '" placeholder="voorzitter@voorbeeld.nl" data-in="b-mail"></label><label class="wn-veld" for="b-tel">06-nummer van de voorzitter<input id="b-tel" type="tel" value="' + esc(S.tel) + '" placeholder="06 12345678" data-in="b-tel"></label></div><span class="wn-zacht klein">De voorzitter krijgt één e-mail met een link om de gegevens te bevestigen, en een sms met een code. In de e-mail staat dat een vrijwilliger van de organisatie deze gegevens heeft doorgegeven. We gebruiken ze alleen hiervoor en bewaren ze [termijn].</span>');
    var bank = '<span>Het IBAN en de fiscale status vult de voorzitter zelf in, via een persoonlijke link. Zo staat de rekening op naam van de organisatie en komt er geen privérekening tussen.</span>';
    if (S.invite === 0) {
      bank += '<div class="wn-stapel"><button type="button" class="wn-knop ' + (vzOk ? 'vol' : 'uit') + '" data-act="nodig" aria-disabled="' + (!vzOk) + '">Stuur de voorzitter een link</button><span class="wn-zacht klein">' + (vzOk ? 'De voorzitter krijgt een e-mail en een sms (in dit voorbeeld wordt er niets verstuurd).' : 'Vul eerst naam, e-mailadres en 06-nummer van de voorzitter in.') + '</span></div>';
    } else if (S.invite === 1) {
      bank += '<div class="wn-grijs"><span>Link verstuurd naar ' + esc(S.mail) + '. Zodra ' + esc(S.vz) + ' bevestigt, wordt dit onderdeel klaar.</span><div class="wn-acties"><button type="button" class="wn-knop rand klein" data-act="nodig">Stuur opnieuw</button><a href="' + P.vz + '">Bekijk wat de voorzitter ziet</a><button type="button" class="wn-link grijs" data-act="demo-bevestig">Demo: voorzitter heeft bevestigd</button></div></div>';
    } else {
      bank += '<div class="wn-bevestigd">Bevestigd door ' + esc(S.vz || 'de voorzitter') + '. IBAN, fiscale status en afspraken staan vast.</div>';
    }
    h += sect('bank', 'Bankrekening en fiscale status', 'Door de voorzitter zelf ingevuld', 'VOORZITTER', bank);
    h += '<p><a href="' + P.dash + '">Terug naar Initiatieven</a></p></div>';
    return h;
  }

  /* ---------- 5. voorzitter bevestigt ---------- */
  var FISC = [['anbi', 'ANBI', 'Algemeen nut beogende instelling'], ['sbbi', 'SBBI', 'Sociaal belang behartigende instelling'], ['steun', 'Aangewezen steunstichting SBBI', 'Tijdelijke stichting voor een SBBI'], ['weet', 'Ik weet het niet zeker', 'Dan helpen we je uitzoeken waar je het kunt nagaan']];
  function voorzitter() {
    var st = U.vzStap;
    var h = koptelefoon(['Stap 1 van 3', 'Stap 2 van 3', 'Stap 3 van 3', 'Klaar'][st - 1]) + '<main class="wn-tel-main" id="inhoud-wn">';
    if (st === 1) {
      h += '<h1>Wil je de gegevens van jullie organisatie bevestigen?</h1><p>Een vrijwilliger van ' + esc(org()) + ' heeft een Initiatief gestart en heeft jou als voorzitter opgegeven. Het kost een paar minuten. Je hoeft geen account aan te maken.</p>';
      h += '<div class="wn-kaart wn-samenvatting"><div class="wn-rij"><div><span class="wn-mono wn-blokje">INITIATIEF</span>' + esc(titel()) + '</div></div><div class="wn-rij"><div><span class="wn-mono wn-blokje">ORGANISATIE</span>' + esc(bnaam()) + ', ' + esc((S.vorm || 'vereniging').toLowerCase()) + '</div></div><div class="wn-rij"><div><span class="wn-mono wn-blokje">KVK-NUMMER</span>' + esc(heeft(S.kvk) ? S.kvk : '[KvK-nummer]') + '</div></div></div>';
      h += '<p class="wn-zacht klein">Klopt dit niet, of ken je dit Initiatief niet? Dan hoef je niets te doen. Je kunt ook <a href="/melden">laten weten dat dit niet klopt</a>.</p>';
    } else if (st === 2) {
      h += '<h1 class="h2">Bankrekening</h1><p class="wn-zacht">Alle giften gaan naar deze rekening. Die moet op naam staan van de vereniging, niet van een persoon.</p>';
      h += invoer('v-iban', 'IBAN van de vereniging', S.iban, 'NL00 BANK 0000 0000 00', 'autocomplete="off"');
      h += '<span class="wn-zacht klein">We controleren of de rekening bij de naam van de vereniging hoort [inrichting volgt met de betaaldienstverlener].</span><span>Wat is de fiscale status van de vereniging?</span><div class="wn-keuzes">' + FISC.map(function (f) {
        return '<button type="button" class="wn-keuze' + (S.fisc === f[0] ? ' aan' : '') + '" aria-pressed="' + (S.fisc === f[0]) + '" data-act="fisc" data-v="' + f[0] + '"><span>' + f[1] + '</span><span class="wn-zacht klein">' + f[2] + '</span></button>';
      }).join('') + '</div><span class="wn-zacht klein">Mondéall beoordeelt de fiscale status niet. Jij geeft aan wat geldt.</span>';
      if (U.fout) h += '<p class="wn-fout" role="alert">' + esc(U.fout) + '</p>';
    } else if (st === 3) {
      h += '<h1 class="h2">Afspraken en bevestigen</h1><div class="wn-kaart wn-tekstkaart"><span>Het Initiatief loopt 3 weken. De Starter kan wekelijks met 1 week verlengen, tot 6 weken.</span><span>Giften zijn onvoorwaardelijk en gaan naar de rekening van de vereniging.</span><span>Binnen 1 jaar wordt de Voorziening gerealiseerd, en binnen 52 weken laat de vereniging de Geld Delers weten wat ermee is gedaan.</span></div>';
      h += '<label class="wn-vink"><input type="checkbox" data-akkoord="1"' + (S.akkoord ? ' checked' : '') + '>Ik bevestig deze gegevens en afspraken namens het bestuur van de vereniging.</label>';
      h += invoer('v-code', 'Code uit de sms', U.code, '6 cijfers', 'inputmode="numeric" maxlength="6" autocomplete="one-time-code"');
      h += '<span class="wn-zacht klein">We sturen de code naar het 06-nummer dat de vrijwilliger van je opgaf [inrichting verificatie volgt]. In dit voorbeeld werkt elke code van 6 cijfers.</span>';
      if (U.fout) h += '<p class="wn-fout" role="alert">' + esc(U.fout) + '</p>';
    } else {
      h += '<div class="wn-rond" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#005248" stroke-width="2.4"><path d="M5 12l5 5 9-10"/></svg></div><h1 class="h2">Bedankt.</h1><p>De gegevens van de vereniging staan vast. De vrijwilliger ziet dat dit onderdeel klaar is en kan het Initiatief indienen.</p><p class="wn-zacht klein">We gebruiken je e-mailadres en 06-nummer alleen hiervoor.</p><a class="wn-knop rand" href="' + P.beg + '">Terug naar de Werkplaats (voorbeeld)</a>';
    }
    h += '</main>';
    if (st < 4) h += '<footer class="wn-tel-voet">' + (st > 1 ? '<button type="button" class="wn-knop licht" data-act="vz-terug">Terug</button>' : '') + '<button type="button" class="wn-knop vol" data-act="vz-verder">' + (st === 3 ? 'Bevestig' : 'Verder') + '</button></footer>';
    return '<div class="wn-tel">' + h + '</div>';
  }

  /* ---------- tekenen en gebeurtenissen ---------- */
  function teken() {
    var a = document.activeElement, id = a && a.id, s0 = null, s1 = null;
    if (id && a.setSelectionRange) { try { s0 = a.selectionStart; s1 = a.selectionEnd; } catch (e) {} }
    app.innerHTML = { snel: snel, dash: dash, ini: ini, beg: begunstigden, vz: voorzitter }[VIEW]();
    if (id) {
      var n = document.getElementById(id);
      if (n && (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA')) { n.focus(); if (s0 != null) { try { n.setSelectionRange(s0, s1); } catch (e) {} } }
    }
  }
  var SET = {
    's-org': function (v) { S.org = v; }, 's-titel': function (v) { S.titel = v; },
    's-q': function (v) { U.q = v; if (v !== S.plaats) { S.gem = ''; } }, 's-gq': function (v) { U.gq = v; if (v !== S.gem) S.gem = ''; },
    's-email': function (v) { S.email = v; U.fout = ''; },
    'i-org': function (v) { S.org = v; }, 'i-gem': function (v) { S.gem = v; }, 'i-titel': function (v) { S.titel = v; }, 'i-email': function (v) { S.email = v; }, 'i-verhaal': function (v) { S.verhaal = v; },
    'upd': function (v) { U.upd = v; },
    'b-naam': function (v) { S.bnaam = v; }, 'b-vorm': function (v) { S.vorm = v; }, 'b-kvk': function (v) { S.kvk = v; }, 'b-web': function (v) { S.web = v; },
    'b-vz': function (v) { S.vz = v; }, 'b-mail': function (v) { S.mail = v; }, 'b-tel': function (v) { S.tel = v; },
    'v-iban': function (v) { S.iban = v; U.fout = ''; }, 'v-code': function (v) { U.code = v.replace(/[^0-9]/g, ''); U.fout = ''; }
  };
  app.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-in');
    if (!k || !SET[k]) return;
    SET[k](e.target.value); bewaar();
    // alleen opnieuw tekenen waar de rest van het scherm van de invoer afhangt
    if (k === 's-q' || k === 's-gq' || k === 'i-titel' || k === 'i-org' || k === 'i-gem' || k === 'i-verhaal' || k === 'b-naam' || k === 'b-vz' || k === 'b-mail' || k === 'b-tel' || k === 'b-kvk' || k === 'b-vorm') teken();
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-chk')) { S.checks[+t.getAttribute('data-chk')] = t.checked; bewaar(); }
    else if (t.hasAttribute('data-akkoord')) { S.akkoord = t.checked; bewaar(); }
    else if (t.hasAttribute('data-foto') && t.files && t.files[0]) {
      var f = t.files[0];
      if (!/^image\//.test(f.type) || f.size > 15 * 1024 * 1024) return;
      if (U.foto) { try { URL.revokeObjectURL(U.foto); } catch (x) {} }
      U.foto = URL.createObjectURL(f); teken();
    }
  });
  function isMail(x) { return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(String(x).trim()); }
  app.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || !app.contains(b)) return;
    var act = b.getAttribute('data-act');
    var A = {
      'kies-plaats': function () { var r = WP[+b.getAttribute('data-i')]; U.q = r[0]; S.plaats = r[0]; S.gem = r[1]; },
      'kies-gem': function () { S.gem = b.getAttribute('data-n'); U.gq = S.gem; S.plaats = ''; },
      'direct': function () { S.direct = true; U.gq = ''; S.gem = ''; },
      'plaats': function () { S.direct = false; U.gq = ''; S.gem = ''; U.q = ''; S.plaats = ''; },
      'terug1': function () { U.stap = 1; U.fout = ''; },
      'volgende': function () {
        if (U.stap === 1) { U.stap = 2; return; }
        if (!isMail(S.email)) { U.fout = 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.'; return; }
        S.concept = true; U.stap = 3; U.fout = '';
      },
      'kies-ini': function () { U.sel = +b.getAttribute('data-i'); U.panel = ''; },
      'tool-verleng': function () { U.verl += 1; },
      'tool-update': function () { U.panel = 'update'; },
      'tool-herstel': function () { U.panel = ''; },
      'tool-terug': function () { U.panel = ''; },
      'tool-helper': function () { U.panel = 'helper'; U.helperSent = false; },
      'sluit': function () { U.panel = ''; },
      'plaats-upd': function () { if (heeft(U.upd)) U.updates.unshift({ d: 'ZOJUIST', t: U.upd }); U.upd = ''; U.panel = ''; },
      'stuur-helper': function () { U.helperSent = true; },
      'fase': function () { U.fase = b.getAttribute('data-f'); U.open = null; },
      'sectie': function () { var id = b.getAttribute('data-id'); U.open = U.open === id ? null : id; },
      'klaar': function () { var id = b.getAttribute('data-id'); S.done[id] = !S.done[id]; },
      'primair': function () { if (U.fase === 'maken') { U.fase = 'formeel'; U.open = null; } else if (S.done.basis && S.done.verhaal && S.done.beeld && S.done.beg && S.done.akkoord) U.ingediend = true; },
      'hulp-open': function () { U.hulpStap = 1; }, 'hulp-kies': function () { U.hulp = b.getAttribute('data-l'); }, 'hulp-stuur': function () { U.hulpStap = 2; }, 'hulp-dicht': function () { U.hulpStap = 0; },
      'nodig': function () { if (b.getAttribute('aria-disabled') === 'true') return; S.invite = 1; },
      'demo-bevestig': function () { S.invite = 2; },
      'fisc': function () { S.fisc = b.getAttribute('data-v'); U.fout = ''; },
      'vz-terug': function () { U.vzStap = Math.max(1, U.vzStap - 1); U.fout = ''; },
      'vz-verder': function () {
        if (U.vzStap === 2) {
          if (S.iban.replace(/\s/g, '').length < 14) { U.fout = 'Vul het IBAN van de vereniging in.'; return; }
          if (!S.fisc) { U.fout = 'Kies de fiscale status van de vereniging.'; return; }
        }
        if (U.vzStap === 3) {
          if (!S.akkoord) { U.fout = 'Vink eerst aan dat je de gegevens en afspraken bevestigt.'; return; }
          if (U.code.length !== 6) { U.fout = 'Typ de code van 6 cijfers uit de sms.'; return; }
          S.invite = 2;
        }
        U.vzStap += 1; U.fout = '';
      }
    };
    if (!A[act]) return;
    A[act](); bewaar(); teken();
  });
  teken();
})();
