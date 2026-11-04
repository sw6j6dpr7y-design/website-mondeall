/* Werkplaats (voorbeeld), inloggen en deelknop met poster */
(function () {
  if (!document.getElementById('wp-app')) return;
/* Werkplaats van de Starter: voorbeeld, niets wordt opgeslagen of verstuurd */
var WP = { weergave: (document.getElementById('wp-app').getAttribute('data-weergave') || 'inloggen'), logstap: 'email', scherm: 'overzicht', verlengingen: 0, voorwaarden: false, ingediend: false, verborgen: {}, aedVoltooid: false };
var WP_SLUIT = ['19-10-2026', '26-10-2026', '02-11-2026', '09-11-2026'];
var WP_GIFTEN = [['09-10 · 21:14', '€ 25,00'], ['08-10 · 12:02', '€ 5,00'], ['06-10 · 19:47', '€ 100,00'], ['05-10 · 08:30', '€ 1,00'], ['03-10 · 16:55', '€ 13,00'], ['02-10 · 20:10', '€ 50,00'], ['30-09 · 09:21', '€ 10,00'], ['29-09 · 18:03', '€ 20,00'], ['28-09 · 14:40', '€ 7,50']];
var WP_BERICHTEN = [
  { id: 'b1', naam: 'Familie Wolters', tekst: 'Succes met de verbouwing!' },
  { id: 'b2', naam: 'Anoniem', tekst: '' },
  { id: 'b3', naam: 'Henk', tekst: 'Ooit zelf in die kleedkamer gestaan. Tijd voor iets nieuws.' },
  { id: 'b4', naam: 'Anoniem', tekst: 'Mooi dat dit gebeurt.' },
  { id: 'b5', naam: 'Kapsalon Mies (fictief)', tekst: '' }
];
var wpEl = document.getElementById('wp-app');

function wpMeta(sector, hex, kern, extra, licht) {
  return '<div class="wp-meta"><span><span class="bar' + (licht ? ' licht' : '') + '" style="background:' + hex + '"></span>' + iniEsc(sector) + '</span><span aria-hidden="true">·</span><span>' + iniEsc(kern) + '</span>' + (extra ? '<span aria-hidden="true">·</span><span>' + iniEsc(extra) + '</span>' : '') + '</div>';
}
function wpStap(titel, klaar, uitleg, wacht) {
  return '<li><span class="wp-bol' + (klaar ? ' klaar' : (wacht ? ' wacht' : '')) + '" aria-hidden="true">' + (klaar ? '✓' : (wacht ? '…' : '·')) + '</span><div><b>' + iniEsc(titel) + '<span>' + (klaar ? 'KLAAR' : (wacht ? 'WACHT' : 'NOG DOEN')) + '</span></b><i>' + iniEsc(uitleg) + '</i></div></li>';
}

function wpInloggen() {
  var code = WP.logstap === 'code';
  var kaart = code
    ? '<h4>Typ de code over</h4>' +
      '<p class="uitleg">Als dit adres bij ons bekend is, staat er nu een code in je mailbox. Kijk ook even bij ongewenste mail.</p>' +
      '<label class="wp-label" for="wp-code">Code van zes cijfers</label>' +
      '<input id="wp-code" class="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000">' +
      '<p class="hint">De code is 10 minuten geldig.</p>' +
      '<button type="button" class="wp-knop" data-act="inloggen">Inloggen</button>' +
      '<div class="onder"><button type="button" class="wp-tekstknop" data-act="email">Ander e-mailadres</button><button type="button" class="wp-tekstknop" disabled>Nieuwe code sturen</button></div>'
    : '<h4>Inloggen</h4>' +
      '<div class="veld"><label class="wp-label" for="wp-email">E-mailadres</label><input id="wp-email" type="email" autocomplete="email" placeholder="jij@voorbeeld.nl"></div>' +
      '<div class="wp-accountchk"><input id="wp-onthoud" type="checkbox"><label for="wp-onthoud">Ingelogd blijven op dit apparaat (30 dagen). Niet aanvinken op een gedeelde computer.</label></div>' +
      '<button type="button" class="wp-knop" data-act="code">Stuur mij een code</button>';
  return '<div class="wp-top"><div class="wp-merkwrap"><a class="wp-merk" href="/" aria-label="Mondéall, naar de beginpagina"><img src="/assets/klavertje-mondeall.png" alt="" width="28" height="24"><span>Mondéall</span></a><span class="wp-tag">WERKPLAATS</span></div></div>' +
    '<div class="wp-login"><div class="wp-login-tekst"><h1>Naar je werkplaats</h1>' +
    '<p class="lead">Hier volg je je Initiatief, verleng je het en geef je straks de terugkoppeling.</p>' +
    '<p>Je hebt geen wachtwoord nodig. We sturen je bij elke keer inloggen een code van zes cijfers. Werkt je vereniging met een gedeeld mailadres, zoals het secretariaat? Dan kan iedereen met toegang tot die mailbox inloggen.</p>' +
    '</div>' +
    '<div class="wp-login-rechts"><div class="wp-login-kaart">' + kaart + '</div>' +
    '<div class="wp-login-kaart"><h4>Nog geen account?</h4><p class="uitleg">Een account heb je nodig als je een Initiatief start, of als Sponsor of Partner meedoet.</p><a class="wp-reg" href="/starten/check">Registreren</a></div>' +
    '<p class="hint">Wil je meedelen met een Initiatief? Daar heb je geen account voor nodig. <a href="/initiatieven">Bekijk de Initiatieven</a></p></div></div>' +
    '<p class="wp-voet">ALLEEN EEN FUNCTIONELE COOKIE VOOR JE INLOGSESSIE · GEEN TRACKING · GEEN INLOGGEN VIA GOOGLE OF FACEBOOK</p>';
}

function wpOverzicht() {
  var aed = WP.aedVoltooid ? 'Afgesloten op 14-06-2026. Terugkoppeling geplaatst, het Initiatief is voltooid.' : 'Afgesloten op 14-06-2026. Terugkoppeling graag vóór 02-05-2027.';
  var opbouw = WP.ingediend ? 'Ingediend, wordt bekeken. Wacht daarnaast op de verificatie door de organisatie.' : (WP.voorwaarden ? 'Klaar om in te dienen. Wacht daarnaast op de verificatie door de organisatie.' : 'Nog te doen: voorwaarden bevestigen. Wacht daarnaast op de verificatie door de organisatie.');
  return '<h1>Mijn Initiatieven</h1>' +
    '<section class="wp-groep"><h2>LIVE</h2><div class="wp-kaart wp-rij"><div>' + wpMeta('Sport & Recreatie', '#e77123', 'Laren') +
      '<h3>Renovatie kleedkamers</h3><p class="wp-org">Voetbalvereniging Laren (fictief)</p><p class="wp-stand">Live sinds 28-09-2026, sluit op 19-10-2026.</p></div>' +
      '<button type="button" class="wp-knop" data-act="scherm" data-arg="live">Openen</button></div></section>' +
    '<section class="wp-groep"><h2>IN OPBOUW</h2><div class="wp-kaart wp-rij"><div>' + wpMeta('Kunst & Cultuur', '#813ea3', 'Laren') +
      '<h3>Nieuwe pauken voor het orkest</h3><p class="wp-org">Muziekvereniging Laren (fictief)</p><p class="wp-stand">' + iniEsc(opbouw) + '</p></div>' +
      '<button type="button" class="wp-knop rand" data-act="scherm" data-arg="opbouw">Verder werken</button></div></section>' +
    '<section class="wp-groep"><h2>AFGESLOTEN</h2><div class="wp-kaart wp-rij"><div>' + wpMeta('Gezondheid & Preventie', '#f3cf3f', 'Laren', '', true) +
      '<h3>AED bij het clubhuis</h3><p class="wp-org">Voetbalvereniging Laren (fictief)</p><p class="wp-stand">' + iniEsc(aed) + '</p></div>' +
      (WP.aedVoltooid ? '' : '<button type="button" class="wp-knop rand" data-act="scherm" data-arg="terugkoppeling">Terugkoppeling geven</button>') + '</div></section>';
}

function wpLive() {
  var rest = 3 - WP.verlengingen;
  var gift = WP_GIFTEN.map(function (g) { return '<li><span class="w">' + g[0] + '</span><span class="b">' + g[1] + '</span></li>'; }).join('');
  var ber = WP_BERICHTEN.map(function (b) {
    var weg = !!WP.verborgen[b.id];
    return '<li class="' + (weg ? 'weg' : '') + '"><div class="t"><b>' + iniEsc(b.naam) + '</b>' +
      (b.tekst ? '<button type="button" class="wp-tekstknop" data-act="verberg" data-arg="' + b.id + '">' + (weg ? 'Toon weer' : 'Bericht verbergen') + '</button>' : '') + '</div>' +
      (!weg && b.tekst ? '<p>' + iniEsc(b.tekst) + '</p>' : '') +
      (weg ? '<p class="v">BERICHT VERBORGEN, DE GIFT BLIJFT STAAN</p>' : '') + '</li>';
  }).join('');
  return '<button type="button" class="wp-tekstknop wp-terug" data-act="scherm" data-arg="overzicht">Terug naar Mijn Initiatieven</button>' +
    '<div>' + wpMeta('Sport & Recreatie', '#e77123', 'Laren', 'Voetbalvereniging Laren (fictief)') + '<h1 style="margin-top:8px">Renovatie kleedkamers</h1></div>' +
    '<div class="wp-live wp-rij"><div><div class="k">LIVE</div><p>Live sinds 28-09-2026. Sluit op <strong>' + WP_SLUIT[WP.verlengingen] + '</strong>.</p>' +
      '<p class="n">' + (rest > 0 ? 'Je kunt nog ' + rest + ' keer met een week verlengen, uiterlijk tot 09-11-2026.' : 'Dit is de langste looptijd: 42 dagen.') + '</p></div>' +
      (rest > 0 ? '<button type="button" class="wp-knop" data-act="verleng">Met een week verlengen</button>' : '') + '</div>' +
    '<div class="wp-pillen"><a class="wp-pil" href="/initiatieven/renovatie-kleedkamers-sv-laren">Openbare pagina bekijken</a>' +
      '<button type="button" class="wp-pil" data-act="scherm" data-arg="delen">Delen: link, deelknop en QR-poster</button><button type="button" class="wp-pil" disabled>Verhaal of foto bijwerken</button></div>' +
    '<p class="wp-noot" style="margin-top:-8px">Voorziening, sector en organisatie liggen vast zolang je Initiatief live is. Zo weet iedereen waaraan hij meedeelde.</p>' +
    '<div class="wp-twee"><section class="wp-sectie"><h2>Wat er binnenkwam</h2><p class="wp-sub">ALLEEN VOOR JOU ZICHTBAAR</p>' +
      '<p class="wp-bedrag">€ 231,50</p><p class="wp-org" style="margin-top:2px">in 9 giften, rechtstreeks naar de rekening van de vereniging</p>' +
      '<ul class="wp-lijst">' + gift + '</ul><p class="wp-noot" style="margin-top:14px">Bedragen staan hier los van namen. Wie wat gaf, blijft tussen de Geld Deler en de vereniging.</p></section>' +
    '<section class="wp-sectie"><h2>Namen en berichten</h2><p class="wp-sub">ZO STAAN ZE OP DE OPENBARE PAGINA</p><ul class="wp-berichten">' + ber + '</ul></section></div>' +
    '<p class="wp-noot">Kun je het Initiatief niet meer volgen? <button type="button" class="wp-tekstknop" disabled>Overdragen aan iemand anders van de vereniging</button></p>';
}

function wpOpbouw() {
  var s1 = wpStap('Plaats en sector', true, 'Laren · Kunst & Cultuur') +
    wpStap('Voorziening', true, 'Twee pauken voor het orkest, voor optredens en repetities.') +
    wpStap('Titel en verhaal', true, 'Kun je tot livegang blijven aanpassen.') +
    wpStap('Voorwaarden', WP.voorwaarden, WP.voorwaarden ? 'Bevestigd.' : 'Vink hieronder aan.');
  var s2 = wpStap('Rechtsvorm en KvK-nummer', true, 'Vereniging met volledige rechtsbevoegdheid.') +
    wpStap('Rekening op naam van de organisatie', true, 'De tenaamstelling klopt.') +
    wpStap('Fiscale kwalificatie', true, 'ANBI, opgegeven door jou.') +
    wpStap('Verificatie door de organisatie', false, 'Uitnodiging gestuurd aan de penningmeester op 08-10-2026. Die rondt de verificatie zelf af, buiten deze werkplaats.', true);
  var onder = WP.ingediend
    ? '<div class="wp-ingediend"><div class="k">INGEDIEND · WORDT BEKEKEN</div><p>Dank je. We kijken mee en laten het je per mail weten. Je Initiatief gaat live zodra ook de verificatie van Muziekvereniging Laren rond is. Tot die tijd kun je alles nog aanpassen.</p></div>'
    : '<div class="wp-kaart wp-indien"><ol><li>Jij dient in. We controleren automatisch of alles is ingevuld.</li><li>Iemand van Mondéall kijkt mee op duidelijkheid van tekst en beeld. Niet op wat je Initiatief waard is.</li><li>Je Initiatief gaat live zodra de organisatie geverifieerd is. Vanaf dan lopen de 21 dagen.</li></ol>' +
      '<button type="button" class="wp-knop" data-act="dienin"' + (WP.voorwaarden ? '' : ' disabled aria-disabled="true"') + '>Indienen</button></div>';
  return '<button type="button" class="wp-tekstknop wp-terug" data-act="scherm" data-arg="overzicht">Terug naar Mijn Initiatieven</button>' +
    '<div>' + wpMeta('Kunst & Cultuur', '#813ea3', 'Laren') + '<h1 style="margin-top:8px">Nieuwe pauken voor het orkest</h1>' +
    '<p class="wp-lead">Twee sporen lopen naast elkaar. Je kunt indienen zodra je eigen spoor klaar is; live gaan kan pas als ook de organisatie rond is.</p></div>' +
    '<div class="wp-sporen"><section class="wp-kaart"><div class="wp-spoorkop">SPOOR 1 · JIJ</div><h2 class="wp-kopkaart">Je Initiatief</h2><ul class="wp-stappen">' + s1 + '</ul>' +
      '<div class="wp-vw"><input id="wp-vw" type="checkbox" data-act="vw"' + (WP.voorwaarden ? ' checked' : '') + '><label for="wp-vw">Ik bevestig: 21 dagen live, wekelijks te verlengen tot 42 dagen; giften zijn onvoorwaardelijk; terugkoppeling binnen 52 weken; de Voorziening wordt binnen een jaar gerealiseerd.</label></div></section>' +
    '<section class="wp-kaart"><div class="wp-spoorkop">SPOOR 2 · DE ORGANISATIE</div><h2 class="wp-kopkaart">Muziekvereniging Laren (fictief)</h2><ul class="wp-stappen">' + s2 + '</ul>' +
      '<button type="button" class="wp-zacht" style="align-self:flex-start" disabled>Uitnodiging opnieuw sturen</button></section></div>' + onder;
}

function wpOrganisaties() {
  var orgs = [
    { naam: 'Voetbalvereniging Laren (fictief)', iban: '12 34', fiscaal: 'SBBI', ver: 'GEVERIFIEERD', wacht: false },
    { naam: 'Muziekvereniging Laren (fictief)', iban: '56 78', fiscaal: 'ANBI', ver: 'WACHT OP VERIFICATIE', wacht: true }
  ];
  return '<div><h1>Organisaties</h1><p class="wp-lead">De verenigingen en stichtingen namens wie jij een Initiatief startte. Bij een nieuw Initiatief kies je er gewoon weer één, zonder alles opnieuw op te zoeken.</p></div>' +
    orgs.map(function (o) {
      return '<section class="wp-kaart"><div class="wp-kop-rij"><h2 class="wp-kopkaart">' + iniEsc(o.naam) + '</h2><span class="wp-label-v' + (o.wacht ? ' wacht' : '') + '">' + o.ver + '</span></div>' +
        '<dl class="wp-dl"><div><dt>Rechtsvorm</dt><dd>Vereniging met volledige rechtsbevoegdheid</dd></div><div><dt>KvK-nummer</dt><dd class="wp-ph">[KvK-nummer]</dd></div>' +
        '<div><dt>Rekening op naam van de organisatie</dt><dd style="font-family:\'IBM Plex Mono\',monospace">NL•• •••• •••• ••' + o.iban + '</dd></div>' +
        '<div><dt>Fiscale kwalificatie</dt><dd>' + o.fiscaal + ', opgegeven door jou</dd></div></dl>' +
        '<p class="wp-noot" style="margin-top:16px">Mondéall beoordeelt de fiscale status niet. Wijzig je de rekening, dan verifieert de organisatie opnieuw voordat er weer giften binnen kunnen komen.</p>' +
        '<button type="button" class="wp-zacht" style="margin-top:14px" disabled>Gegevens wijzigen</button></section>';
    }).join('');
}

function wpAccount() {
  return '<h1>Account</h1>' +
    '<section class="wp-kaart"><h2 class="wp-kopkaart" style="font-size:1.2rem">Jouw gegevens</h2><dl class="wp-dl"><div><dt>Naam</dt><dd>Bas Bakker</dd></div><div><dt>E-mailadres</dt><dd class="wp-ph">[e-mailadres]</dd></div></dl>' +
      '<p class="wp-noot" style="margin-top:14px">Je logt in met een code per mail. Er is geen wachtwoord om te vergeten.</p></section>' +
    '<section class="wp-kaart"><h2 class="wp-kopkaart" style="font-size:1.2rem">Waar je bent ingelogd</h2><ul class="wp-lijst"><li><span>Deze browser</span><span class="w">NU</span></li><li><span>Telefoon</span><span class="w">07-10-2026</span></li></ul>' +
      '<button type="button" class="wp-zacht" style="margin-top:14px" disabled>Overal uitloggen</button></section>' +
    '<section class="wp-kaart"><h2 class="wp-kopkaart" style="font-size:1.2rem">Mails van Mondéall</h2><p style="margin:8px 0 0;line-height:1.55">Je krijgt altijd: je inlogcode, een bericht als de status van je Initiatief verandert, een herinnering drie dagen voor sluiting en een herinnering voor de terugkoppeling. Geen nieuwsbrief, tenzij je daar zelf apart voor kiest.</p>' +
      '<div class="wp-accountchk"><input id="wp-giftmail" type="checkbox"><label for="wp-giftmail">Stuur mij een mail bij elke nieuwe gift</label></div></section>' +
    '<div class="wp-links"><button type="button" class="wp-tekstknop" disabled>Mijn gegevens downloaden</button><button type="button" class="wp-tekstknop" disabled>Account verwijderen</button></div>';
}

function wpTerugkoppeling() {
  return '<button type="button" class="wp-tekstknop wp-terug" data-act="scherm" data-arg="overzicht">Terug naar Mijn Initiatieven</button>' +
    '<div><h1>Hoe is het gegaan?</h1><p class="wp-lead">AED bij het clubhuis. Een kort bericht of een foto is genoeg. Het verschijnt op de pagina van het Initiatief, zodat iedereen die meedeelde ziet wat ervan geworden is. Mondéall controleert de besteding niet.</p></div>' +
    '<section class="wp-kaart" style="display:flex;flex-direction:column;gap:16px"><div><label class="wp-label" for="wp-tk">Je bericht</label><textarea id="wp-tk" class="wp-textarea" rows="5"></textarea></div>' +
      '<div class="wp-rij"><button type="button" class="wp-zacht" disabled>Foto toevoegen</button><button type="button" class="wp-knop" data-act="plaats">Plaatsen</button></div>' +
      '<p class="wp-noot">Graag vóór 02-05-2027, 52 weken na livegang.</p></section>';
}

/* Deelknop en poster: voorbeeld met verzonnen gegevens. Niets wordt opgeslagen of verstuurd. */
var DL_KLAVER = "M352 556C345 554 340 551 335 547C302 524 280 491 277 461C277 457 276 454 276 453C275 453 271 456 265 459C214 490 190 501 137 516C99 528 33 539 22 537C3 533 -2 512 13 501C16 498 17 498 30 497C75 494 162 470 198 451C212 443 240 427 259 416C288 398 300 387 313 369C327 349 344 325 345 323C346 322 347 321 347 320C347 320 348 319 348 318C349 317 350 315 351 313C351 310 350 311 336 323C309 348 285 364 254 380C247 384 219 393 209 395C168 405 137 393 125 363C120 350 116 331 116 317C116 300 121 272 124 272C125 272 125 272 125 271C124 270 131 257 133 256C134 255 135 254 135 253C135 253 140 248 146 242C157 231 169 223 179 217L185 215L181 210C158 178 150 159 150 138C149 125 152 114 155 114C156 114 156 114 155 113C154 111 169 98 176 94C193 86 213 81 233 80C276 77 302 92 328 136C333 144 337 151 360 200C368 218 373 227 374 227C374 226 372 215 367 189C355 129 364 59 389 27C412 -5 455 -3 504 32C527 48 539 76 541 115C541 131 541 131 543 131C548 129 576 128 586 129C629 131 651 150 649 184C647 222 629 258 602 277C595 283 585 287 568 291C554 295 523 294 464 289C432 286 428 287 443 291C475 300 505 314 537 333C561 348 589 377 600 398C607 413 608 433 602 446C587 474 547 501 514 505C494 507 460 498 442 484L436 480L434 484C433 487 429 494 425 501C404 544 378 563 352 556ZM368 515C378 509 405 456 404 444C402 429 411 418 424 418C433 418 436 420 446 434C459 449 470 457 490 462C498 464 514 465 517 464C518 464 522 461 527 459C559 444 572 427 562 413C543 384 516 364 471 344C447 333 413 324 398 324L391 324L387 331C385 335 376 348 368 360C326 421 323 427 318 447C315 459 321 477 333 491C342 502 358 517 362 517C363 517 365 516 368 515ZM193 358C227 352 266 332 306 297C321 284 342 260 342 256C342 255 340 250 337 245C331 234 304 177 298 164C291 148 275 130 264 125C249 118 232 118 210 124C197 128 190 132 190 136C188 145 196 162 214 186C222 197 227 202 236 207C249 216 252 230 241 240C237 245 236 245 226 246C196 252 192 253 175 270C169 276 163 282 163 283C156 294 155 326 160 343C165 358 171 361 193 358ZM389 276C389 276 388 275 388 274C387 272 387 272 385 274C383 276 384 277 386 277C388 277 389 277 389 276ZM557 253C558 252 560 252 561 252C562 251 565 250 568 249C577 247 589 237 596 225C602 216 608 195 608 183C608 176 608 176 605 173C600 170 596 169 577 169C550 169 531 172 522 178C510 186 495 182 490 168C488 163 490 156 495 142L500 128L500 116C500 87 492 71 470 58C449 45 432 41 424 47C415 54 407 79 403 109C401 138 402 160 409 195C414 220 416 226 422 238L426 248L434 247C438 247 455 248 472 249C489 251 510 252 518 253C527 254 535 254 535 254C535 255 553 253 557 253Z";
var DL = {
  basis: 'https://mondeall.nl',
  club: 'Voetbalvereniging Laren (fictief)',
  slotregel: 'Elke euro komt aan, omdat lokale bedrijven de kosten dragen.',
  slug: 'renovatie-kleedkamers-sv-laren',
  titel: 'Renovatie kleedkamers',
  vermeldingen: [{ naam: 'Bouwbedrijf Egberink & Zn.', soort: 'Sponsor' }],
  gekozen: 'zegel', logoData: '', qrSvg: '', qrStatus: 0
};
var DL_MAAT = { s: { f: 14, z: 32 }, m: { f: 16, z: 40 }, l: { f: 19, z: 48 } };
var DL_VORM = { rond: '999px', zacht: '8px', recht: '0' };
var DL_FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
function dlQ(s) { return wpEl.querySelector(s); }
function dlLum(hex) {
  var n = parseInt(hex.slice(1), 16), w = [.2126, .7152, .0722];
  return [n >> 16, (n >> 8) & 255, n & 255].map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); })
    .reduce(function (a, v, i) { return a + v * w[i]; }, 0);
}
function dlRatio(a, b) { var x = dlLum(a), y = dlLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function dlTekstKleur(bg) {
  var w = dlRatio(bg, '#ffffff'), i = dlRatio(bg, '#12211d');
  return w >= i ? { c: '#ffffff', r: w, n: 'wit' } : { c: '#12211d', r: i, n: 'donker' };
}
function dlZegel(px, soort) {
  var disc = soort === 'merk' ? '#009f8c' : '#ffffff', blad = soort === 'merk' ? '#ffffff' : '#009f8c';
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false" style="display:block;flex:none"><circle cx="50" cy="50" r="50" fill="' + disc + '"/><path transform="translate(20.7 24.8) scale(.09)" fill="' + blad + '" fill-rule="evenodd" d="' + DL_KLAVER + '"/></svg>';
}
function dlRadio(n) { return dlQ('input[name="dl-' + n + '"]:checked').value; }
function dlWaarden() {
  return {
    url: DL.basis + '/initiatieven/' + DL.slug, vast: DL.basis + '/initiatieven', titel: DL.titel, club: DL.club,
    kleur: dlQ('#dl-kleurHex').value, zegel: dlRadio('zegel'), vorm: DL_VORM[dlRadio('vorm')], maat: DL_MAAT[dlRadio('maat')],
    label: dlRadio('label'), nieuw: dlQ('#dl-nieuw').checked
  };
}
function dlAttrs(o) { return 'href="' + iniEsc(o.url) + '" referrerpolicy="no-referrer"' + (o.nieuw ? ' target="_blank" rel="noopener"' : ''); }
function dlMaak(v, o) {
  var t = dlTekstKleur(o.kleur), f = o.maat.f;
  var knop = function (a) { return '<a ' + dlAttrs(a) + ' style="display:inline-flex;align-items:center;gap:.55em;padding:.35em 1.1em .35em .35em;background:' + o.kleur + ';color:' + t.c + ';border-radius:' + o.vorm + ';font:600 ' + f + 'px/1.2 ' + DL_FONT + ';text-decoration:none">' + dlZegel(Math.round(f * 2), o.zegel) + '<span>' + iniEsc(o.label) + '</span></a>'; };
  if (v === 'zegel') {
    var z = Object.assign({}, o, { url: o.vast });
    return '<a ' + dlAttrs(z) + ' aria-label="Deel mee via Mondéall" title="Deel mee via Mondéall" style="display:inline-block;line-height:0;border-radius:50%">' + dlZegel(o.maat.z, o.zegel) + '</a>';
  }
  if (v === 'knop') return knop(o);
  if (v === 'uitleg') {
    return '<a ' + dlAttrs(o) + ' style="display:inline-flex;align-items:center;gap:.7em;padding:.5em 1.3em .5em .5em;background:' + o.kleur + ';color:' + t.c + ';border-radius:' + o.vorm + ';font:400 ' + f + 'px/1.25 ' + DL_FONT + ';text-decoration:none">' + dlZegel(Math.round(f * 2.6), o.zegel) +
      '<span style="display:flex;flex-direction:column"><strong style="font-weight:700">' + iniEsc(o.label) + '</strong><span style="font-size:.82em">Elke euro komt aan, omdat sponsors de kosten dragen</span></span></a>';
  }
  if (v === 'blok') {
    var r = o.vorm === '999px' ? '14px' : o.vorm;
    return '<div style="max-width:24rem;border:2px solid ' + o.kleur + ';border-radius:' + r + ';padding:1.1em 1.2em;background:#ffffff;color:#12211d;font:400 ' + f + 'px/1.5 ' + DL_FONT + '"><p style="margin:0 0 .3em;font-weight:700;font-size:1.15em">' + iniEsc(o.titel) + '</p>' +
      '<p style="margin:0 0 .9em">Deel mee vanaf € 1. Elke euro komt aan, omdat sponsors de kosten dragen. Je kunt ook anoniem delen.</p>' + knop(o) + '</div>';
  }
  return '<a ' + dlAttrs(o) + ' style="color:inherit;text-decoration:underline">' + iniEsc(o.label) + ' via Mondéall</a>';
}
function dlHtml() {
  var rad = function (n, items, def, extra) {
    return '<div class="choices" role="radiogroup" aria-label="' + extra + '">' + items.map(function (it, i) {
      return '<input type="radio" name="dl-' + n + '" id="dl-' + n + i + '" value="' + iniEsc(it[0]) + '"' + (it[0] === def ? ' checked' : '') + '><label for="dl-' + n + i + '">' + iniEsc(it[1]) + '</label>';
    }).join('') + '</div>';
  };
  var varnt = [['zegel', '1: Klavertje in het menu', false], ['knop', '2: Knop'], ['uitleg', '3: Knop met uitleg'], ['blok', '4: Blok voor een pagina'], ['link', '5: Tekstlink']].map(function (v) {
    return '<div class="variant"><p class="tag"><span>Variant ' + v[1] + '</span><button type="button" class="kies" data-dl="' + v[0] + '">Kies deze</button></p><div data-out="' + v[0] + '"></div></div>';
  }).join('');
  return '<button type="button" class="wp-tekstknop wp-terug" data-act="scherm" data-arg="live">Terug naar Renovatie kleedkamers</button>' +
    '<div class="dl"><div><h1>Deelknop en poster</h1><p class="wp-lead">Zet het klavertje van Mondéall op jullie eigen website, of print een poster voor de kantine. Wat het platform al weet, staat al ingevuld. Jij kiest alleen hoe het eruitziet.</p>' +
    '<p class="wp-noot">Voorbeeld met verzonnen gegevens. De knoppen werken pas als het platform live gaat. Wat je hier kiest wordt niet opgeslagen.</p></div>' +
    '<div class="dl-grid" style="margin-top:28px"><form id="dl-form" onsubmit="return false"><h2>Jullie knop</h2>' +
    '<fieldset><legend>Initiatief</legend><label class="f" for="dl-ini">Voor welk Initiatief</label><select id="dl-ini"><option>Renovatie kleedkamers (live)</option><option disabled>Nieuwe pauken voor het orkest (in opbouw)</option><option disabled>AED bij het clubhuis (afgesloten)</option></select>' +
    '<p class="hint">Alleen Initiatieven die live staan zijn te kiezen.</p>' +
    '<dl class="adres"><dt>Klavertje in het menu</dt><dd id="dl-adresVast"></dd><dt>Knoppen en poster</dt><dd id="dl-adresIni"></dd></dl>' +
    '<p class="hint">Het klavertje wijst naar een vaste plek en kan jaren blijven staan. Knoppen en poster horen bij één Initiatief: haal ze weg als het is afgerond.</p></fieldset>' +
    '<fieldset><legend>Kleur van jullie vereniging</legend><div class="colorrow"><input type="color" id="dl-kleur" value="#1f4e9c" aria-label="Kies clubkleur"><input type="text" id="dl-kleurHex" value="#1f4e9c" aria-label="Clubkleur als hexcode" maxlength="7"></div>' +
    '<p class="contrast" id="dl-contrast"></p><p class="hint">De tekstkleur kiezen we zelf, zodat de knop voor iedereen leesbaar blijft.</p></fieldset>' +
    '<fieldset><legend>Het klavertje</legend>' + rad('zegel', [['merk', 'Wit op turquoise'], ['wit', 'Turquoise op wit']], 'merk', 'Uitvoering klavertje') +
    '<p class="hint">Het klavertje zelf houdt altijd zijn eigen kleuren. Zo herkent iedereen het, op elke clubsite.</p></fieldset>' +
    '<fieldset><legend>Vorm en maat</legend>' + rad('vorm', [['rond', 'Rond'], ['zacht', 'Zachte hoek'], ['recht', 'Recht']], 'rond', 'Hoeken') +
    '<div style="margin-top:.6rem">' + rad('maat', [['s', 'Klein'], ['m', 'Normaal'], ['l', 'Groot']], 'm', 'Maat') + '</div></fieldset>' +
    '<fieldset><legend>Tekst op de knop</legend>' + rad('label', [['Deel mee', 'Deel mee'], ['Deel mee vanaf € 1', 'Deel mee vanaf € 1'], ['Deel mee via Mondéall', 'Deel mee via Mondéall']], 'Deel mee', 'Knoptekst') +
    '<label class="check"><input type="checkbox" id="dl-nieuw"> Openen in een nieuw tabblad</label></fieldset></form>' +
    '<section class="stage" aria-labelledby="dl-vb"><h2 id="dl-vb">Zo ziet het eruit op jullie site</h2><div class="club"><div class="club-bar" id="dl-bar"><span class="naam" id="dl-barNaam"></span><nav aria-hidden="true"><span>Home</span><span>Agenda</span><span>Teams</span><span>Contact</span></nav><span id="dl-barZegel"></span></div>' +
    '<div class="club-body"><div class="ph" style="width:60%"></div><div class="ph"></div><div class="ph" style="width:80%"></div>' + varnt + '</div></div>' +
    '<div class="code"><h3 id="dl-codeKop">Code voor variant 1</h3><label for="dl-snip" class="hint" style="display:block;margin:0 0 .4rem">Plak deze code in je website, op de plek waar de knop moet komen. In WordPress gaat dat met een blok "Aangepaste HTML".</label>' +
    '<textarea id="dl-snip" readonly spellcheck="false"></textarea><div class="copy"><button type="button" id="dl-kopieer">Kopieer code</button><span id="dl-gekopieerd" role="status"></span></div></div>' +
    '<div class="kantine" aria-labelledby="dl-kk"><h2 id="dl-kk">Voor in de kantine: poster met QR-code</h2><p class="hint" style="margin:0 0 1rem;max-width:38rem">Print de poster op A4 en hang hem op waar mensen even stilstaan: bij de bar, het mededelingenbord of de ingang. De code is ook vanaf een paar meter te scannen.</p>' +
    '<div class="pinputs"><div><label class="f" for="dl-logo">Logo</label><p class="hint" id="dl-logoBron" style="margin:0 0 .4rem"></p><input type="file" id="dl-logo" accept="image/png,image/jpeg,image/svg+xml,image/webp"><button type="button" id="dl-logoWeg" class="linkknop" hidden>Logo weghalen</button>' +
    '<p class="hint">Een eigen logo voor deze poster blijft op je eigen computer en gaat niet naar Mondéall. Geen logo? Dan staat de naam er.</p></div>' +
    '<div><label class="check" style="margin-top:0"><input type="checkbox" id="dl-spons" checked> Toon "Mede mogelijk gemaakt door"</label><ul class="vermeld" id="dl-vermeldLijst"></ul>' +
    '<p class="hint">Sponsors en Partners die aan dit Initiatief of aan de sector gekoppeld zijn en betaald hebben. Het platform vult ze zelf in; je kunt ze niet toevoegen.</p></div></div>' +
    '<div class="posterwrap">' + dlPosterHtml('dl-poster') + '</div>' +
    '<div class="copy"><button type="button" id="dl-print">Print de poster (A4)</button><button type="button" id="dl-qrKopie" class="tweede">Kopieer QR-code als SVG</button><span id="dl-qrStatus" role="status"></span></div>' +
    '<p class="hint">De SVG is handig voor het clubblad of een drukker: scherp op elk formaat. Houd de code minimaal 3 cm breed, met witruimte eromheen.</p></div></section></div></div>';
}
function dlPosterHtml(id) {
  return '<article class="poster" ' + (id ? 'id="' + id + '" ' : '') + 'aria-label="Voorbeeld van de poster"><div class="p-band"></div><div class="p-body"><div class="p-logo"></div><p class="p-kicker"></p><h3 class="p-titel"></h3>' +
    '<p class="p-sub">Deel mee vanaf € 1, ook anoniem.</p><div class="p-qr"></div><p class="p-scan">Scan met de camera van je telefoon</p><p class="p-url"></p></div>' +
    '<div class="p-spons" hidden><p>Mede mogelijk gemaakt door</p><div class="p-spons-rij"></div></div>' +
    '<div class="p-voet"><svg viewBox="0 0 652 560" aria-hidden="true"><path fill="#009f8c" fill-rule="evenodd" d="' + DL_KLAVER + '"/></svg><p><b>Mondéall</b><span class="p-slot"></span></p></div></article>';
}
function dlMaakQr(url) {
  var q = qrcode(0, 'Q'); q.addData(url); q.make();
  var n = q.getModuleCount(), m = 4, s = n + 2 * m, d = '';
  for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) d += 'M' + (c + m) + ' ' + (r + m) + 'h1v1h-1z';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + s + ' ' + s + '" shape-rendering="crispEdges" role="img" aria-label="QR-code naar ' + iniEsc(url) + '"><rect width="' + s + '" height="' + s + '" fill="#ffffff"/><path fill="#12211d" d="' + d + '"/></svg>';
}
function dlPas(p) {
  var body = p.querySelector('.p-body'), tt = p.querySelector('.p-titel'), qr = p.querySelector('.p-qr');
  var q = 42, f = parseFloat(tt.style.fontSize) || 7.6, guard = 0;
  qr.style.width = q + 'cqw';
  while (body.scrollHeight > body.clientHeight + 1 && guard++ < 40) {
    if (q > 34) { q -= 1; qr.style.width = q + 'cqw'; }
    else if (f > 5) { f -= .3; tt.style.fontSize = f.toFixed(1) + 'cqw'; }
    else if (q > 30) { q -= 1; qr.style.width = q + 'cqw'; }
    else break;
  }
}
function dlVulPoster(p, o) {
  var qs = function (s) { return p.querySelector(s); };
  qs('.p-band').style.background = o.kleur;
  qs('.p-kicker').textContent = 'Initiatief van ' + o.club;
  qs('.p-logo').innerHTML = DL.logoData ? '<img alt="Logo ' + iniEsc(o.club) + '" src="' + iniEsc(DL.logoData) + '">' : '<span class="p-naam">' + iniEsc(o.club) + '</span>';
  qs('.p-slot').textContent = DL.slotregel;
  var sp = dlQ('#dl-spons').checked && DL.vermeldingen.length > 0;
  qs('.p-spons').hidden = !sp;
  qs('.p-spons-rij').innerHTML = sp ? DL.vermeldingen.slice(0, 3).map(function (v) { return '<div style="height:8.5cqw">' + iniEsc(v.naam) + '</div>'; }).join('') : '';
  qs('.p-logo').style.height = sp ? '13cqw' : '17cqw';
  qs('.p-titel').textContent = o.titel;
  qs('.p-titel').style.fontSize = o.titel.length <= 30 ? '7.6cqw' : o.titel.length <= 50 ? '6.2cqw' : '5.2cqw';
  qs('.p-url').textContent = o.url.replace(/^https:\/\//, '');
  qs('.p-qr').innerHTML = DL.qrSvg;
  dlPas(p);
}
function dlRender() {
  if (!window.qrcode) return;
  var o = dlWaarden(), t = dlTekstKleur(o.kleur), ok = t.r >= 4.5;
  dlQ('#dl-contrast').innerHTML = 'Tekst ' + t.n + ', contrast ' + t.r.toFixed(2).replace('.', ',') + ' : 1 <span class="' + (ok ? 'ok' : 'nee') + '">' + (ok ? 'voldoet (AA)' : 'te laag, kies een iets donkerder of lichtere tint') + '</span>';
  var bar = dlQ('#dl-bar'); bar.style.background = o.kleur; bar.style.color = t.c;
  dlQ('#dl-barZegel').innerHTML = dlMaak('zegel', o);
  wpEl.querySelectorAll('[data-out]').forEach(function (el) { el.innerHTML = dlMaak(el.getAttribute('data-out'), o); });
  wpEl.querySelectorAll('.dl [data-out] a, #dl-barZegel a').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  wpEl.querySelectorAll('.kies').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-dl') === DL.gekozen); });
  dlQ('#dl-codeKop').textContent = 'Code voor variant ' + { zegel: 1, knop: 2, uitleg: 3, blok: 4, link: 5 }[DL.gekozen];
  dlQ('#dl-snip').value = '<!-- Deelknop Mondéall: gewone HTML, geen script, geen tracking -->\n' + dlMaak(DL.gekozen, o);
  dlQ('#dl-gekopieerd').textContent = '';
  dlQ('#dl-barNaam').textContent = o.club;
  dlQ('#dl-adresVast').textContent = o.vast.replace(/^https:\/\//, '');
  dlQ('#dl-adresIni').textContent = o.url.replace(/^https:\/\//, '');
  dlQ('#dl-vermeldLijst').innerHTML = DL.vermeldingen.map(function (v) { return '<li>' + iniEsc(v.naam) + '<small>' + iniEsc(v.soort) + '</small></li>'; }).join('');
  dlQ('#dl-logoBron').textContent = DL.logoData ? 'Eigen logo voor deze poster.' : 'Er staat nog geen logo in jullie profiel.';
  DL.qrSvg = dlMaakQr(o.url);
  dlVulPoster(dlQ('#dl-poster'), o);
  dlQ('#dl-qrStatus').textContent = '';
}
function dlPrint() {
  var o = dlWaarden();
  var vel = document.createElement('div');
  vel.id = 'dl-printvel'; vel.className = 'dl'; vel.setAttribute('aria-hidden', 'true');
  vel.innerHTML = dlPosterHtml('');
  document.body.appendChild(vel);
  dlVulPoster(vel.querySelector('.poster'), o);
  var st = document.createElement('style');
  st.textContent = '@page{size:A4;margin:0}@media print{html,body{margin:0;background:#fff}body > *:not(#dl-printvel){display:none!important}#dl-printvel{display:block!important}#dl-printvel .poster{width:210mm;height:296mm;aspect-ratio:auto}}';
  document.head.appendChild(st);
  var weg = function () { window.removeEventListener('afterprint', weg); vel.remove(); st.remove(); };
  window.addEventListener('afterprint', weg);
  window.print();
}
function dlLaadQr(klaar) {
  if (window.qrcode) { klaar(); return; }
  var s = document.createElement('script'); s.src = '/assets/qr.js'; s.onload = klaar;
  s.onerror = function () { var m = dlQ('#dl-snip'); if (m) m.value = 'De QR-bibliotheek kon niet worden geladen. Ververs de pagina en probeer het opnieuw.'; };
  document.head.appendChild(s);
}
function dlInit() {
  if (!dlQ('#dl-form')) return;
  DL.gekozen = 'zegel';
  dlLaadQr(function () {
    if (!dlQ('#dl-form')) return;
    dlRender();
    var form = dlQ('#dl-form');
    dlQ('#dl-kleur').addEventListener('input', function (e) { dlQ('#dl-kleurHex').value = e.target.value; dlRender(); });
    dlQ('#dl-kleurHex').addEventListener('input', function (e) { var v = e.target.value.trim(); if (/^#[0-9a-fA-F]{6}$/.test(v)) { dlQ('#dl-kleur').value = v.toLowerCase(); dlRender(); } });
    form.addEventListener('input', function (e) { if (e.target.id !== 'dl-kleur' && e.target.id !== 'dl-kleurHex') dlRender(); });
    wpEl.querySelectorAll('.kies').forEach(function (b) { b.addEventListener('click', function () { DL.gekozen = b.getAttribute('data-dl'); dlRender(); dlQ('#dl-snip').focus(); }); });
    dlQ('#dl-kopieer').addEventListener('click', function () {
      var ta = dlQ('#dl-snip'), st = dlQ('#dl-gekopieerd');
      var terug = function () { ta.select(); try { document.execCommand('copy'); st.textContent = 'Gekopieerd.'; } catch (x) { st.textContent = 'Selecteer de code en kopieer met Ctrl+C.'; } };
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { st.textContent = 'Gekopieerd.'; }, terug); else terug();
    });
    dlQ('.pinputs').addEventListener('input', function (e) { if (e.target.id !== 'dl-logo') dlRender(); });
    dlQ('#dl-logo').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      if (f.size > 3e6) { alert('Kies een logo kleiner dan 3 MB.'); e.target.value = ''; return; }
      var r = new FileReader(); r.onload = function () { DL.logoData = r.result; dlQ('#dl-logoWeg').hidden = false; dlRender(); }; r.readAsDataURL(f);
    });
    dlQ('#dl-logoWeg').addEventListener('click', function () { DL.logoData = ''; dlQ('#dl-logo').value = ''; dlQ('#dl-logoWeg').hidden = true; dlRender(); });
    dlQ('#dl-print').addEventListener('click', dlPrint);
    dlQ('#dl-qrKopie').addEventListener('click', function () {
      var st = dlQ('#dl-qrStatus');
      if (navigator.clipboard) navigator.clipboard.writeText(DL.qrSvg).then(function () { st.textContent = 'QR-code gekopieerd.'; }, function () { st.textContent = 'Kopiëren lukte niet in deze browser.'; });
      else st.textContent = 'Kopiëren lukte niet in deze browser.';
    });
    if (document.fonts) document.fonts.ready.then(function () { if (dlQ('#dl-form')) dlRender(); });
  });
}
function wpDelen() { DL.logoData = ''; return dlHtml(); }

function wpWerkplaats() {
  var inIni = ['overzicht', 'live', 'opbouw', 'terugkoppeling', 'delen'].indexOf(WP.scherm) > -1;
  var scherm = { overzicht: wpOverzicht, live: wpLive, opbouw: wpOpbouw, organisaties: wpOrganisaties, account: wpAccount, terugkoppeling: wpTerugkoppeling, delen: wpDelen }[WP.scherm]();
  var nav = function (t, arg, actief) { return '<button type="button" data-act="scherm" data-arg="' + arg + '" aria-current="' + (actief ? 'page' : 'false') + '">' + t + '</button>'; };
  return '<div class="wp-top"><div class="wp-merkwrap"><a class="wp-merk" href="/" aria-label="Mondéall, naar de beginpagina"><img src="/assets/klavertje-mondeall.png" alt="" width="28" height="24"><span>Mondéall</span></a><span class="wp-tag">WERKPLAATS</span></div>' +
    '<div class="wp-gebruiker"><span>Bas Bakker</span><button type="button" class="wp-tekstknop" data-act="uitloggen">Uitloggen</button></div></div>' +
    '<div class="wp-body"><nav class="wp-nav" aria-label="Werkplaats">' + nav('Mijn Initiatieven', 'overzicht', inIni) + nav('Organisaties', 'organisaties', WP.scherm === 'organisaties') + nav('Account', 'account', WP.scherm === 'account') +
    '<a class="wp-nieuw" href="/starten/zo-werkt-het">Nieuw Initiatief</a></nav><main class="wp-main">' + scherm + '</main></div>';
}

function wpRender(focus) {
  wpEl.innerHTML = WP.weergave === 'inloggen' ? wpInloggen() : wpWerkplaats();
  if (WP.weergave === 'werkplaats' && WP.scherm === 'delen') dlInit();
  if (focus) { var f = wpEl.querySelector(focus); if (f) { if (!/^(BUTTON|INPUT|A|TEXTAREA)$/.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); } }
}
wpEl.addEventListener('click', function (e) {
  var b = e.target.closest('[data-act]'); if (!b || b.tagName === 'INPUT') return;
  var a = b.getAttribute('data-act'), arg = b.getAttribute('data-arg');
  if (a === 'code') { WP.logstap = 'code'; wpRender('#wp-code'); }
  else if (a === 'email') { WP.logstap = 'email'; wpRender('#wp-email'); }
  else if (a === 'inloggen') { WP.weergave = 'werkplaats'; WP.scherm = 'overzicht'; location.href = '/mijn'; }
  else if (a === 'uitloggen') { WP.weergave = 'inloggen'; WP.logstap = 'email'; location.href = '/inloggen'; }
  else if (a === 'scherm') { WP.scherm = arg; wpRender('.wp-main h1, .wp-terug'); }
  else if (a === 'verleng') { WP.verlengingen = Math.min(3, WP.verlengingen + 1); wpRender('[data-act="verleng"], .wp-terug'); }
  else if (a === 'verberg') { WP.verborgen[arg] = !WP.verborgen[arg]; wpRender('[data-act="verberg"][data-arg="' + arg + '"]'); }
  else if (a === 'dienin') { if (WP.voorwaarden) { WP.ingediend = true; wpRender('.wp-ingediend'); } }
  else if (a === 'plaats') { WP.aedVoltooid = true; WP.scherm = 'overzicht'; wpRender('.wp-main h1'); }
});
wpEl.addEventListener('change', function (e) {
  if (e.target.getAttribute('data-act') === 'vw') { WP.voorwaarden = e.target.checked; wpRender('#wp-vw'); }
});
wpRender();
})();
