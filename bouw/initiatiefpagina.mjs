// Volledig uitgewerkte Initiatiefpagina (ontwerp van 25-10-2026), voor Initiatieven met het veld v2.
// De pagina wordt bij het bouwen gemaakt, zodat alle tekst in de HTML staat. Alleen het meedelen-formulier
// en de QR-code gebruiken JavaScript (assets/js/deelmee.js). Er wordt niets opgeslagen of verstuurd.
import { DOMEIN } from '../inhoud/config.mjs';
import { esc, sectorVan, sponsorHtml, tint } from './initiatief.mjs';

const ICOON = {
  '01': 'internationale-hulp', '02': 'sociale-hulp', '03': 'sport', '04': 'zorg', '05': 'kunst', '06': 'dieren',
  '07': 'milieu', '08': 'onderwijs', '09': 'wetenschap', '10': 'religie', '11': 'samenleving', '12': 'gezondheid',
};
const icoon = (nr) => '/assets/iconen/kleur/sector-' + nr + '-' + ICOON[nr] + '.svg';
const euro = (n) => '€ ' + Number(n).toLocaleString('nl-NL');

const FASEN = ['Voorbereiden & Vormgeven', 'Starten & Verbinden', 'Bloeien & Groeien', 'Vieren & Afronden'];

export function initiatiefPaginaHtml(d, alle) {
  const v = d.v2;
  const s = sectorVan(d.sector);
  const url = DOMEIN + '/initiatieven/' + d.slug;
  const wd = v.weldoeners;
  const resterend = wd.lijst.length;

  const fasen = FASEN.map((f, i) => '<li' + (i + 1 === v.fase ? ' class="nu"' : '') + '>' + (i + 1) + '. ' + esc(f) + (i + 1 === v.fase ? ' (nu)' : '') + '</li>').join('');

  const verhaal = v.verhaal.map((t) => '<p>' + esc(t) + '</p>').join('');
  const feiten = v.feiten.map(([k, t]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(t) + '</dd></div>').join('');
  const berichten = v.berichtenVereniging.map(([datum, tekst]) => '<article class="ip-bericht"><p class="ip-datum">' + esc(datum) + '</p><p>' + esc(tekst) + '</p></article>').join('');
  const weldoeners = wd.lijst.map(([naam, status, soort]) => '<li><span class="ip-naam">' + esc(naam) + '</span><span class="ip-status ' + soort + '">' + esc(status) + '</span></li>').join('');
  const delers = v.delers.map(([naam, bericht]) => '<li><span class="ip-naam">' + esc(naam) + '</span>' + (bericht ? '<span class="ip-citaat">' + esc(bericht) + '</span>' : '') + '</li>').join('');
  const zozit = v.zozit.map(([k, t]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(t) + '</dd></div>').join('');

  // Sponsors van deze Kern: elk bedrijf een keer.
  const gezien = new Set();
  const sponsors = alle.filter((x) => x.kern === d.kern).map((x) => x.sponsor).filter((sp) => !gezien.has(sp.naam) && gezien.add(sp.naam)).map(sponsorHtml).join('');

  const andere = alle.filter((x) => x.kern === d.kern && x.slug !== d.slug && !x.afgesloten).slice(0, 2);
  const meer = andere.length
    ? '<section id="meer" aria-labelledby="meer-kop"><h2 id="meer-kop" class="ip-h2">Meer in ' + esc(d.kern) + '</h2><div class="ip-kaarten">' +
      andere.map((x) => { const xs = sectorVan(x.sector); return '<a class="ip-kaart" href="/initiatieven/' + x.slug + '"><span class="ip-sector"><img src="' + icoon(x.sector) + '" alt="" width="22" height="22">' + esc(xs.nr + ' ' + xs.naam) + '</span><span class="ip-kaarttitel">' + esc(x.titel) + '</span></a>'; }).join('') +
      '</div><p class="ip-voet">Nieuwste eerst. We rangschikken niet op populariteit.</p></section>'
    : '';

  const wa = 'https://wa.me/?text=' + encodeURIComponent('Doe je mee? ' + d.titel + ' van ' + d.beg + '. Meedelen kan vanaf € 1: ' + url);

  return `<section id="initiatief-pagina" class="ip" data-url="${esc(url)}">
<div class="hdr-wrap">
<a class="id-back" href="/initiatieven">&larr; Terug naar Initiatieven</a>
<span class="preview-status">Voorbeeldpagina met fictieve gegevens. Er wordt niets afgeschreven.</span>

<div class="ip-top">
  <figure class="ip-foto"><div class="ip-hero" style="background:${tint(s.hex, 0.12)}"><img src="${esc(d.foto)}" alt="Sfeerbeeld bij ${esc(d.titel)}" style="object-position:center ${esc(d.pos)}"></div>
  <figcaption class="foto-credit">Sfeerbeeld ter illustratie. Foto: ${esc(d.credit)}</figcaption></figure>
  <div class="ip-kopblok">
    <p class="ip-chips">
      <a class="ip-chip kern" href="#meer">${esc(d.kern)}</a>
      <a class="ip-chip" href="/initiatieven?weergave=kaart" title="Kaart van de gemeente Lochem">Gemeente Lochem</a>
      <span class="ip-chip"><img src="${icoon(d.sector)}" alt="" width="24" height="24">${esc(s.nr + ' ' + s.naam)}</span>
      <span class="ip-chip sdg" style="background:${v.sdg.kleur};border-color:${v.sdg.kleur}">SDG ${v.sdg.nr} ${esc(v.sdg.naam)}</span>
    </p>
    <h1 id="id-kop">${esc(d.titel)}</h1>
    <p class="ip-door">Een Initiatief van <strong>${esc(d.beg)}</strong></p>
    <p class="ip-belofte">Elke euro komt aan, omdat <a href="#sponsors">deze Sponsors</a> de kosten dragen.</p>
    <div class="ip-knoppen">
      <a class="ip-knop" href="#delen">Deel mee vanaf € 1</a>
      <a class="ip-knop rand" href="#doorvertellen">Vertel het door</a>
    </div>
    <div class="ip-telling">
      <p class="ip-telregel" id="ip-telregel">${d.mensen} Geld Delers deelden al mee.</p>
      <p><a href="#weldoeners">Weldoeners verdubbelen je gift</a></p>
    </div>
    <div class="ip-einde"><p>Meedelen kan tot en met</p><p class="ip-datumgroot">${esc(v.deadline)}</p></div>
  </div>
</div>

<div class="ip-grid">
<div class="ip-main">

<section aria-labelledby="fase-kop" class="ip-fase"><h2 id="fase-kop" class="ip-label">Waar staat dit Initiatief</h2><ol>${fasen}</ol></section>

<section aria-labelledby="verhaal-kop" class="ip-verhaal"><h2 id="verhaal-kop" class="ip-h2">${esc(v.verhaalKop)}</h2>${verhaal}<dl class="ip-feiten">${feiten}</dl></section>

<section aria-labelledby="berichten-kop"><h2 id="berichten-kop" class="ip-h2">Berichten van de vereniging</h2><p class="ip-intro">${esc(v.berichtenIntro)}</p><div class="ip-berichten">${berichten}</div></section>

<section id="weldoeners" aria-labelledby="weldoeners-kop"><h2 id="weldoeners-kop" class="ip-h2">Weldoeners</h2>
<p class="ip-intro">Weldoeners verdubbelen elke euro die jij deelt, tot ${euro(wd.perGeldDeler)} per Geld Deler. Ze vullen elkaar aan in de volgorde waarin ze zich aanmeldden. Per Initiatief kunnen er maximaal ${wd.max === 10 ? 'tien' : wd.max} zijn.</p>
<div class="ip-ruimte"><p class="ip-ruimtegroot">Nog te verdubbelen: <span id="ip-ruimte">${euro(wd.ruimte)}</span></p><p class="ip-ruimteklein">${resterend} van maximaal ${wd.max} weldoeners</p></div>
<ul class="ip-lijst">${weldoeners}</ul>
<a href="/contact">Word weldoener bij dit Initiatief</a></section>

<section aria-labelledby="deelden-kop"><h2 id="deelden-kop" class="ip-h2">Wie deelden</h2>
<div class="ip-groot"><p class="ip-getal" id="ip-getal">${d.mensen}</p><p class="ip-getalregel">Geld Delers deelden al mee</p><p class="ip-getalnoot">Met naam of anoniem, allebei even welkom. Bedragen tonen we niet.</p></div>
<ul class="ip-lijst" id="ip-delers">${delers}</ul></section>

<section aria-labelledby="zozit-kop"><h2 id="zozit-kop" class="ip-h2">Zo zit het</h2><dl class="ip-zozit">${zozit}</dl></section>

<section id="sponsors" aria-labelledby="sponsor-kop" class="ip-sponsors"><h2 id="sponsor-kop" class="ip-h3">Mede mogelijk gemaakt door</h2>
<p class="ip-intro">Deze bedrijven dragen de kosten van geld delen in ${esc(d.kern)}. Daardoor komt elke euro aan. Ze beslissen niet mee over welke Initiatieven er komen.</p>
<div class="id-sponsorrow">${sponsors}</div><p class="id-note">Voorbeeld-Sponsor: een fictief bedrijf en logo.</p></section>

<section id="doorvertellen" aria-labelledby="door-kop"><h2 id="door-kop" class="ip-h2">Vertel het door</h2>
<p class="ip-intro">De meeste mensen delen mee omdat iemand die ze kennen het doorstuurt.</p>
<div class="ip-delen">
  <a class="ip-knop" href="${esc(wa)}" rel="noopener"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg>Stuur via WhatsApp</a>
  <button type="button" class="ip-knop rand" id="ip-kopieer"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg><span id="ip-kopieerlabel" aria-live="polite">Kopieer de link</span></button>
  <span class="ip-url">${esc(url.replace('https://', ''))}</span>
  <div class="ip-qr" id="ip-qr"></div>
</div></section>

${meer}

</div>

<aside id="delen" class="ip-aside" aria-labelledby="delen-kop">
<div id="ip-formulierblok">
<h2 id="delen-kop">Deel mee</h2>
<p class="ip-intro klein">Vanaf € 1. Je hebt geen account nodig.</p>
<p class="ip-verdubbeling" id="ip-verdubbeling" data-ruimte="${wd.ruimte}" data-max="${wd.perGeldDeler}">Je gift wordt verdubbeld door de <a href="#weldoeners">weldoeners</a>, tot ${euro(wd.perGeldDeler)}.</p>
<form id="ip-formulier" novalidate>
  <label for="ip-bedrag" class="ip-label">Bedrag</label>
  <div class="ip-bedragveld"><span aria-hidden="true">€</span><input id="ip-bedrag" name="bedrag" type="text" inputmode="decimal" value="10" autocomplete="off"></div>
  <div class="ip-snel"><span>Of kies:</span><button type="button" data-bedrag="5">€ 5</button><button type="button" data-bedrag="10">€ 10</button><button type="button" data-bedrag="25">€ 25</button></div>
  <fieldset class="ip-wijze"><legend class="ip-label">Hoe wil je meedelen?</legend>
    <div><button type="button" data-wijze="naam" aria-pressed="true">Met mijn naam</button><button type="button" data-wijze="anoniem" aria-pressed="false">Anoniem</button></div>
  </fieldset>
  <div id="ip-naamveld"><label for="ip-naam" class="ip-label">Je naam, zoals die op deze pagina komt</label><input id="ip-naam" name="naam" type="text" autocomplete="name" maxlength="60"></div>
  <label for="ip-bericht" class="ip-label">Bericht (mag leeg blijven)</label>
  <textarea id="ip-bericht" name="bericht" rows="3" maxlength="240"></textarea>
  <button type="submit" class="ip-verstuur" id="ip-verstuur">Deel € 10 mee</button>
  <p class="ip-kleinnoot">Je gift gaat naar ${esc(d.beg)}. We sturen je geen nieuwsbrief en volgen je niet. In dit voorbeeld werkt betalen nog niet.</p>
</form>
</div>
<div id="ip-bedankt" role="status" hidden>
  <img src="/assets/klavertje-mondeall.png" alt="" width="64" height="56">
  <h2 id="ip-bedankt-kop" tabindex="-1">Dank je wel</h2>
  <p>Je gift van <span id="ip-bedankt-bedrag"></span> gaat naar ${esc(d.beg)}.</p>
  <p class="ip-verdubbeling" id="ip-bedankt-verdubbeld" hidden>Een weldoener legt er <span id="ip-bedankt-extra"></span> bij.</p>
  <p id="ip-bedankt-regel" class="ip-intro"></p>
  <p class="ip-kleinnoot">Dit was een voorbeeld: er is niets afgeschreven.</p>
  <a href="#top">Terug naar boven</a>
</div>
</aside>

</div>
</div>
</section>
<script src="/assets/qr.js"></script>`;
}
