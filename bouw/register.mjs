// Organisatieregister: zoekpagina, organisatiepagina en kernpagina, volgens de mock-up van 15-11-2026.
// Alle gegevens zijn fictief (inhoud/data/organisaties.mjs); de pagina's zijn noindex tot het register echt live gaat.
import { sectoren } from '../inhoud/data/sectoren.mjs';
import { REG_ORGS, REG_STATUS, REG_DETAIL, REG_KERN, regOrgUrl } from '../inhoud/data/organisaties.mjs';
import { esc, sectorVan } from './initiatief.mjs';

const banner = '<span class="preview-status">Voorbeeld: het organisatieregister wordt gebouwd. Alle organisaties, nummers en gegevens op deze pagina zijn fictief.</span>';
const sectorNaam = (nr) => { const s = sectorVan(nr); return s ? s.nr + ' ' + s.naam : nr; };
const plaats = REG_KERN.naam + ', gemeente ' + REG_KERN.gemeente;
const klokje = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>';

const statusChip = (s) => '<span class="reg-chip reg-st-' + s + '">' + esc(REG_STATUS[s]) + '</span>';
const naamLink = (o) => o.pagina ? '<a href="' + regOrgUrl(o) + '">' + esc(o.naam) + '</a>' : esc(o.naam);

function kaart(o) {
  return `<article class="reg-kaart" data-naam="${esc(o.naam.toLowerCase())}" data-nummer="${o.nummer}" data-soort="${o.soort}" data-sector="${o.sector}" data-status="${o.status}" data-anbi="${o.anbi ? 1 : 0}" data-init="${o.init ? 1 : 0}">
        <div class="reg-kaart-kop"><h3>${naamLink(o)}</h3><span class="reg-nr">Nr. ${o.nummer}</span></div>
        <p class="reg-sub">${esc(o.soort)} · ${esc(plaats)}</p>
        <div class="reg-chips">${statusChip(o.status)}<span class="reg-chip reg-ch-sector">${esc(sectorNaam(o.sector))}</span>${o.anbi ? '<span class="reg-chip reg-ch-anbi">ANBI</span>' : ''}${o.init ? '<span class="reg-chip reg-ch-init">Initiatief loopt</span>' : ''}</div>
      </article>`;
}

const vinkje = (naam, waarde, label, aan = true, type = 'checkbox') =>
  `<label class="reg-keuze"><input type="${type}" name="${naam}" value="${waarde}"${aan ? ' checked' : ''}>${esc(label)}</label>`;

export function registerZoekHtml() {
  return `<section class="reg">
  <div class="reg-wrap">
    ${banner}
    <h1 class="pagina-kop">Zoek een vereniging, stichting, school of kerk</h1>
    <p class="reg-intro">Verenigingen, stichtingen, scholen en kerken in heel Nederland, per gemeente en per kern. Zoeken is gratis en je hebt geen account nodig.</p>
    <form class="reg-zoek" role="search" action="/organisaties" method="get" id="reg-form">
      <label class="verborgen" for="reg-q">Zoek op naam, plaats of organisatienummer</label>
      <input id="reg-q" type="search" name="q" placeholder="Zoek op naam, plaats of organisatienummer" autocomplete="off" maxlength="80">
      <button type="submit" class="cta-btn">Zoeken</button>
    </form>
    <div class="reg-layout">
      <aside class="reg-filters" aria-label="Filters" id="reg-filters">
        <div class="reg-filters-kop"><h2>Filters</h2><button type="button" class="reg-link" id="reg-wis">Wis alles</button></div>
        <fieldset>
          <legend>Plaats</legend>
          <label for="reg-prov">Provincie</label>
          <select id="reg-prov"><option>Alle provincies</option></select>
          <label for="reg-gem">Gemeente</label>
          <select id="reg-gem"><option value="">Alle gemeenten</option><option>${esc(REG_KERN.gemeente)}</option></select>
          <label for="reg-kern">Kern</label>
          <select id="reg-kern"><option value="">Alle kernen</option><option>${esc(REG_KERN.naam)}</option></select>
        </fieldset>
        <fieldset>
          <legend>Soort</legend>
          ${['Vereniging', 'Stichting', 'School', 'Kerkgenootschap'].map((s) => vinkje('soort', s, s)).join('\n          ')}
        </fieldset>
        <div class="reg-veld">
          <label for="reg-sector">Sector</label>
          <select id="reg-sector"><option value="">Alle sectoren</option>${sectoren.map((s) => '<option value="' + s.nr + '">' + esc(s.nr + ' ' + s.naam) + '</option>').join('')}</select>
        </div>
        <fieldset>
          <legend>Status in het register</legend>
          ${vinkje('status', '', 'Alle', true, 'radio')}
          ${Object.entries(REG_STATUS).map(([k, v]) => vinkje('status', k, v, false, 'radio')).join('\n          ')}
        </fieldset>
        <fieldset>
          <legend>Verder</legend>
          ${vinkje('anbi', '1', 'Alleen ANBI', false)}
          ${vinkje('init', '1', 'Met een lopend Initiatief', false)}
        </fieldset>
      </aside>
      <div class="reg-resultaten">
        <div class="reg-balk">
          <p aria-live="polite" id="reg-aantal"><strong>${REG_ORGS.length} organisaties</strong> in kern <a href="${REG_KERN.url}">${esc(REG_KERN.naam)}</a>, gemeente ${esc(REG_KERN.gemeente)}</p>
          <div class="reg-volgorde"><label for="reg-sort">Volgorde</label><select id="reg-sort"><option value="match">Beste match</option><option value="alfabet">Alfabet</option></select></div>
        </div>
        <div id="reg-lijst" class="reg-lijst">
      ${REG_ORGS.map(kaart).join('\n      ')}
        </div>
        <p class="reg-leeg" id="reg-leeg" hidden>Geen organisaties gevonden. Pas je zoekwoord of de filters aan.</p>
        <div class="reg-voetnoot">
          <p>Bij elk gegeven staan de bron en de datum waarop we het hebben nagekeken. Lijsten downloaden kan niet.</p>
          <p>Gebruik je het register beroepsmatig, bijvoorbeeld als bestand of gekoppeld aan je eigen systeem? Lees de <a href="/voorwaarden">voorwaarden voor gebruik door anderen</a>.</p>
          <p>Staat jouw organisatie er niet in, of klopt er iets niet? <a href="/melden">Meld het ons</a>.</p>
          <p>Het organisatieregister is van Stichting Mondéall.</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function registerOrganisatieHtml(o) {
  const d = REG_DETAIL[o.nummer];
  return `<section class="reg">
  <div class="reg-wrap">
    ${banner}
    <div class="reg-chips">${statusChip(o.status)}<span class="reg-chip reg-ch-sector">${esc(sectorNaam(o.sector))}</span>${o.anbi ? '<span class="reg-chip reg-ch-anbi">ANBI</span>' : ''}${o.init ? '<span class="reg-chip reg-ch-init">Initiatief loopt</span>' : ''}</div>
    <h1 class="pagina-kop reg-org-kop">${esc(o.naam)}</h1>
    <p class="reg-intro">${esc(o.soort)} in ${esc(plaats)} · Organisatienummer <strong class="reg-nr-groot">${o.nummer}</strong></p>
    <p class="reg-klein">Vast adres van deze pagina: mondeall.nl${regOrgUrl(o)}</p>
    <div class="reg-layout reg-layout-org">
      <div class="reg-hoofd">
        ${d.initiatief ? `<section class="reg-init" aria-labelledby="reg-init-kop">
          <div>
            <span class="reg-eyebrow">Lopend Initiatief</span>
            <h2 id="reg-init-kop">${esc(d.initiatief.titel)}</h2>
            <p>${esc(d.initiatief.looptijd)} Alles wat je deelt, komt aan bij de vereniging.</p>
          </div>
          <a class="cta-btn" href="/initiatieven">Naar de Initiatieven</a>
        </section>` : ''}
        <section class="reg-blok" aria-labelledby="reg-over-kop">
          <h2 id="reg-over-kop">Over de vereniging</h2>
          <p>[Korte beschrijving, door de vereniging zelf geschreven en beheerd. Alleen zichtbaar bij organisaties die zich hebben aangemeld.]</p>
        </section>
        <section class="reg-gegevens" aria-labelledby="reg-geg-kop">
          <div class="reg-gegevens-kop"><h2 id="reg-geg-kop">Gegevens</h2><span>Met bron en peildatum per gegeven</span></div>
          <dl>
${d.gegevens.map(([l, w, b]) => `            <div><dt>${esc(l)}</dt><dd>${esc(w)}</dd><dd class="reg-bron">${klokje}${esc(b)}</dd></div>`).join('\n')}
          </dl>
        </section>
        <section class="reg-blok" aria-labelledby="reg-lus-kop">
          <h2 id="reg-lus-kop">Lustrumjaren</h2>
          <p>Opgericht in ${d.opgericht}, vastgesteld volgens het Extractieprotocol. ${d.lustrum} Is het oprichtingsjaar niet zeker vastgesteld, dan laten we dit leeg.</p>
        </section>
      </div>
      <aside class="reg-zij">
        <section class="reg-zijblok">
          <h2>Beheer je deze organisatie?</h2>
          <p>Log in om de beschrijving, de Starters en de Initiatieven bij te werken. Naam, KvK-nummer en adres volgen het Handelsregister.</p>
          <a href="/inloggen">Inloggen voor beheer</a>
        </section>
        <section class="reg-zijblok">
          <h2>Klopt er iets niet?</h2>
          <p>Meld een fout, of vraag om verwijdering uit het register.</p>
          <a href="/melden">Meld het ons</a>
        </section>
        <section class="reg-zijblok reg-zijblok-grijs">
          <h2>Wat je hier niet ziet</h2>
          <p>Namen en contactgegevens van bestuurders, contactpersonen en Starters tonen we nooit. Ook niet als ze elders openbaar zijn.</p>
        </section>
      </aside>
    </div>
  </div>
</section>`;
}

const meervoud = { Vereniging: 'Verenigingen', Stichting: 'Stichtingen', School: 'Scholen', Kerkgenootschap: 'Kerkgenootschappen' };

export function registerKernHtml() {
  const soorten = ['Vereniging', 'Stichting', 'School', 'Kerkgenootschap'];
  const tel = (s) => REG_ORGS.filter((o) => o.soort === s).length;
  const tegels = soorten.map((s) => `<div class="reg-tegel"><strong>${tel(s)}</strong><span>${tel(s) === 1 ? s : meervoud[s]}</span></div>`).join('')
    + `<div class="reg-tegel reg-tegel-init"><strong>${REG_ORGS.filter((o) => o.init).length}</strong><span>Lopende Initiatieven</span></div>`;
  const groepen = soorten.map((s) => {
    const orgs = REG_ORGS.filter((o) => o.soort === s).sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
    return `<section class="reg-groep">
      <h2>${meervoud[s]}</h2>
      <ul class="reg-rijen">
${orgs.map((o) => `        <li><div><span class="reg-rij-naam">${naamLink(o)}</span><span class="reg-sub">Nr. ${o.nummer} · ${esc(sectorNaam(o.sector))}</span></div><div class="reg-chips">${statusChip(o.status)}${o.init ? '<span class="reg-chip reg-ch-init">Initiatief loopt</span>' : ''}</div></li>`).join('\n')}
      </ul>
    </section>`;
  }).join('\n    ');
  return `<section class="reg">
  <div class="reg-wrap">
    ${banner}
    <h1 class="pagina-kop">${esc(REG_KERN.naam)}</h1>
    <p class="reg-intro">Kern in de gemeente ${esc(REG_KERN.gemeente)}</p>
    <div class="reg-tegels" aria-label="Overzicht">${tegels}</div>
    ${groepen}
    <div class="reg-voetnoot">
      <p>Mist er een organisatie in ${esc(REG_KERN.naam)}? <a href="/starten/aanmelden">Meld haar aan</a>, dat is gratis.</p>
      <p><a href="/organisaties">&larr; Terug naar Zoek een organisatie</a></p>
    </div>
  </div>
</section>`;
}
