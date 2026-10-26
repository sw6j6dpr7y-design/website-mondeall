// Bouwscript van mondeall.nl: maakt van de paginabron en de stukken in inhoud/ de HTML-pagina's in dist/.
// Geen externe pakketten; draait met een gewone Node.js (versie 20 of hoger).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { DOMEIN, NAAM, BASISTITEL, BESCHRIJVING, DEELBEELD, EMAIL } from '../inhoud/config.mjs';
import { paginas, afgeleidePaginas, sectorPad, tekstVolgtZin } from '../inhoud/paginas.mjs';
import { sectoren, AANDACHT } from '../inhoud/data/sectoren.mjs';
import { INI_DATA } from '../inhoud/data/initiatieven.mjs';
import { IF_KERNEN, IF_KERNBUURT } from '../inhoud/data/kernen.mjs';
import { hoofdnav, voetkolommen, onderbalk, auteursrecht } from '../inhoud/navigatie.mjs';
import { initiatiefHtml, sponsorHtml, esc, sectorVan } from './initiatief.mjs';
import { initiatiefPaginaHtml } from './initiatiefpagina.mjs';
import { leesTeksten, renderMd } from './tekst.mjs';
import { formulieren } from './formulieren.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const lees = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const schrijf = (rel, tekst) => { const p = path.join(DIST, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, tekst); };

// ---------- opruimen en bestanden kopiëren ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
function kopieer(van, naar) {
  fs.mkdirSync(naar, { recursive: true });
  for (const f of fs.readdirSync(van, { withFileTypes: true })) {
    if (f.name.endsWith('.bron') || f.name.endsWith('.bron2')) continue;
    const a = path.join(van, f.name), b = path.join(naar, f.name);
    if (f.isDirectory()) kopieer(a, b); else fs.copyFileSync(a, b);
  }
}
kopieer(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

// ---------- gegevens voor de browser ----------
const sectorenMetPad = sectoren.map((s) => ({ ...s, pad: sectorPad(s) }));
schrijf('assets/data.js',
  '/* Gegenereerd door bouw/bouw.mjs uit inhoud/data. Niet met de hand aanpassen. */\n' +
  'var sectoren = ' + JSON.stringify(sectorenMetPad) + ';\n' +
  'var AANDACHT = ' + JSON.stringify(AANDACHT) + ';\n' +
  'var INI_DATA = ' + JSON.stringify(INI_DATA.map(({ v2, ...rest }) => rest)) + ';\n' +
  'var IF_KERNEN = ' + JSON.stringify(IF_KERNEN) + ';\n' +
  'var IF_KERNBUURT = ' + JSON.stringify(IF_KERNBUURT) + ';\n');

const versie = (rel) => crypto.createHash('md5').update(fs.readFileSync(path.join(DIST, rel))).digest('hex').slice(0, 8);
const activa = (rel) => '/' + rel + '?v=' + versie(rel);

// ---------- stukken ----------
const stuk = (naam) => lees('inhoud', 'fragmenten', naam + '.html').trimEnd();
const hero = lees('inhoud', 'sjabloon', 'hero.html').trimEnd();

// ---------- teksten uit inhoud/teksten/*.md ----------
// Een tekstbestand hoort bij het adres dat de bestandsnaam aangeeft (sponsoren/treden.md = /sponsoren/treden).
// status: plaatshouder (zichtbare plaatshouder, noindex) | concept (tekst zichtbaar, noindex) | klaar (openbaar en indexeerbaar)
const teksten = leesTeksten(path.join(ROOT, 'inhoud', 'teksten'));
for (const [url, t] of teksten) {
  let p = paginas.find((x) => x.url === url);
  if (!p) { p = { url, titel: t.meta.titel || url, fase: t.meta.fase || 'B' }; paginas.push(p); }
  if (t.meta.titel) p.titel = t.meta.titel;
  const status = t.meta.status || 'plaatshouder';
  // Van een plaatshouder komt niets van de tekst naar buiten, ook niet in de beschrijving of de titel van het tabblad
  if (status !== 'plaatshouder') {
    if (t.meta.beschrijving) p.beschrijving = t.meta.beschrijving;
    if (t.meta.h1) p.h1 = t.meta.h1;
    if (t.meta.titeltag) p.titeltag = t.meta.titeltag;
  }
  p.tekst = t; p.status = status;
  if (status === 'plaatshouder') { p.plaatshouder = true; p.noindex = true; }
  else { p.plaatshouder = false; p.hub = false; p.noindex = status !== 'klaar'; }
}

// ---------- alle pagina's (voor kruimels, hubs en sitemap) ----------
const alle = [...paginas, ...afgeleidePaginas()];
const perUrl = new Map(alle.map((p) => [p.url, p]));
const bestaat = (u) => perUrl.has(u);
const zoekIcoon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';
const zoekForm = (id, klasse) => '<form class="zoek ' + klasse + '" role="search" action="/initiatieven" method="get"><label class="verborgen" for="' + id + '">Zoek je dorp of wijk</label><input id="' + id + '" type="search" name="q" placeholder="Zoek je dorp of wijk" autocomplete="off" maxlength="80"><button type="submit" aria-label="Zoeken">' + zoekIcoon + '</button></form>';
const actief = (p, href) => p.url === href || p.url.startsWith(href + '/');

function lintHtml(p) {
  const links = hoofdnav.map(([t, h]) => '<li><a href="' + h + '"' + (actief(p, h) ? ' aria-current="page"' : '') + '>' + esc(t) + '</a></li>').join('\n          ');
  return `  <div class="bar-wrap">
    <div class="hdr-wrap bar">
      <a class="merk" href="/" aria-label="Mondéall, naar de beginpagina">
        <img src="/assets/klavertje-mondeall.png" alt="" width="42" height="37">
        <span>Mondéall</span>
      </a>
      <nav class="hoofdnav" id="hoofdmenu" aria-label="Hoofdmenu">
        <ul>
          ${links}
          <li class="alleenmobiel"><a href="/inloggen">Inloggen</a></li>
        </ul>
        ${zoekForm('zoek-m', 'alleenmobiel')}
      </nav>
      <div class="acties">
        ${zoekForm('zoek-d', '')}
        <a class="inlog" href="/inloggen">Inloggen</a>
        <button type="button" class="burger" data-menu="nav" aria-expanded="false" aria-controls="hoofdmenu" aria-label="Menu">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 6h12M4 10h12M4 14h12" stroke="#005248" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

const linkOfBinnenkort = ([t, h]) => bestaat(h) ? '<li><a href="' + h + '">' + esc(t) + '</a></li>' : '<li><span class="voet-nog">' + esc(t) + ' <em>Binnenkort</em></span></li>';
function voetHtml() {
  const kolommen = voetkolommen.map(([kop, items]) => '      <nav aria-label="' + esc(kop) + '">\n        <h2>' + esc(kop) + '</h2>\n        <ul>\n          ' + items.map(linkOfBinnenkort).join('\n          ') + '\n        </ul>\n      </nav>').join('\n');
  const onder = onderbalk.map(([t, h]) => '<a href="' + h + '">' + esc(t) + '</a>').join('<span aria-hidden="true">|</span>');
  return `<footer>
  <div class="wrap">
    <div class="voetkol">
${kolommen}
    </div>
    <hr class="voetlijn">
    <div class="voet">
      <div>
        <p>${esc(auteursrecht)}</p>
        <nav class="voet-nav" aria-label="Juridische informatie">
          ${onder}
        </nav>
      </div>
      <nav class="voetsoc" aria-label="Mondéall op sociale media">
        <a href="https://www.linkedin.com/company/mond%C3%A9all/" target="_blank" rel="me noopener" aria-label="Mondéall op LinkedIn (opent in een nieuw tabblad)" title="Mondéall op LinkedIn"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3.5" fill="#005248"/><circle cx="7.6" cy="7.4" r="1.7" fill="#ffffff"/><rect x="6.1" y="10" width="3" height="8" fill="#ffffff"/><path d="M11 10h2.9v1.3c.5-.9 1.6-1.5 2.9-1.5 2.3 0 3.2 1.4 3.2 3.9V18h-3v-3.8c0-1.1-.3-1.9-1.4-1.9s-1.6.8-1.6 1.9V18h-3z" fill="#ffffff"/></svg></a>
      </nav>
    </div>
  </div>
</footer>`;
}

const segmenten = (u) => u.split('/').filter(Boolean).length;
const kinderen = (url) => alle.filter((p) => p.url.startsWith(url + '/') && segmenten(p.url) === segmenten(url) + 1 && !p.werkplaats && !p.initiatief && !p.sector);

function ouders(url) {
  const delen = url.split('/').filter(Boolean);
  const lijst = [{ url: '/', titel: 'Home' }];
  for (let i = 1; i < delen.length; i++) {
    const u = '/' + delen.slice(0, i).join('/');
    const p = perUrl.get(u);
    if (p) lijst.push({ url: u, titel: p.titel });
  }
  return lijst;
}

function kruimels(p) {
  if (p.url === '/') return '';
  const ks = ouders(p.url);
  return '<nav class="kruimels wrap" aria-label="Kruimelpad"><ol>' +
    ks.map((k) => '<li><a href="' + k.url + '">' + esc(k.titel) + '</a></li>').join('') +
    '<li aria-current="page">' + esc(p.titel) + '</li></ol></nav>';
}

function jsonLd(p) {
  const blokken = [];
  if (p.url === '/') {
    blokken.push({ '@context': 'https://schema.org', '@type': 'Organization', name: NAAM, url: DOMEIN + '/', logo: DOMEIN + '/assets/klavertje-mondeall.png' });
    blokken.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: NAAM, url: DOMEIN + '/' });
  } else {
    const ks = [...ouders(p.url), { url: p.url, titel: p.titel }];
    blokken.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: ks.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k.titel, item: DOMEIN + (k.url === '/' ? '/' : k.url) })) });
  }
  return blokken.map((b) => '<script type="application/ld+json">' + JSON.stringify(b) + '</script>').join('\n');
}

// ---------- paginaschil ----------
function schil(p, binnen, opties = {}) {
  const titel = p.url === '/' ? BASISTITEL : (p.titeltag || p.titel + ' · ' + NAAM);
  const canoniek = DOMEIN + (p.url === '/' ? '/' : p.url);
  const scripts = ['gemeen', ...(p.scripts || []), ...(opties.scripts || [])];
  const metData = scripts.some((s) => ['initiatieven', 'sectoren', 'starten'].includes(s));
  const js = [metData ? '<script src="' + activa('assets/data.js') + '"></script>' : '']
    .concat(scripts.map((s) => '<script src="' + activa('assets/js/' + s + '.js') + '"></script>')).filter(Boolean).join('\n');
  const kaal = !!p.werkplaats;
  const beschrijving = p.beschrijving || BESCHRIJVING;
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
<link rel="canonical" href="${canoniek}">
${p.noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="${NAAM}">
<meta property="og:locale" content="nl_NL">
<meta property="og:url" content="${canoniek}">
<meta property="og:title" content="${esc(p.url === '/' ? 'Mondéall: wat speelt er in jouw dorp of wijk?' : titel)}">
<meta property="og:description" content="${esc(p.url === '/' ? 'Deel mee met een Initiatief vanaf € 1. Elke euro komt aan, omdat Sponsors de kosten dragen.' : beschrijving)}">
<meta property="og:image" content="${DOMEIN + DEELBEELD}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mondéall. Wat speelt er in jouw dorp of wijk? Deel mee met een Initiatief vanaf één euro. Elke euro komt aan, omdat Sponsors de kosten dragen.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/klavertje-mondeall.png">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-v9-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-serif-4-v15-latin-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${activa('assets/fonts.css')}">
<link rel="stylesheet" href="${activa('assets/site.css')}">
${jsonLd(p)}
</head>
<body>
${kaal ? '' : '<a class="skip" href="#inhoud">Naar de inhoud</a>\n\n<header>\n' + lintHtml(p) + (p.hero ? '\n\n' + hero : '') + '\n</header>\n'}
${kaal ? '' : kruimels(p) + '\n'}<main id="inhoud">
${binnen}
</main>
${kaal ? '' : '\n' + voetHtml() + '\n'}
${js}
</body>
</html>
`;
}

// De eerste kop van een pagina wordt h1 (alleen op pagina's zonder hero)
function metH1(html) {
  if (html.includes('<h1')) return html;
  return html.replace(/<h2>([^<]*)<\/h2>/, '<h1 class="pagina-kop">$1</h1>');
}

function utf8Url(u) { return u === '/' ? 'index.html' : u.slice(1) + '/index.html'; }

// ---------- pagina's uit de paginabron ----------
for (const p of paginas) {
  let binnen;
  if (p.werkplaats) {
    binnen = `<section id="werkplaats">
  <div class="wp-pagina">
    <span class="preview-status">Voorbeeld: het platform wordt gebouwd. Er wordt niets opgeslagen of verstuurd.</span>
    <div class="wp-app" id="wp-app" data-weergave="${p.werkplaats}"></div>
  </div>
</section>`;
    schrijf(utf8Url(p.url), schil(p, binnen, { scripts: ['werkplaats'] }));
    continue;
  }
  if (p.tekst && !p.plaatshouder) {
    const ctx = {
      knop: ([doel, label]) => '<p><a class="cta-btn" href="' + esc(doel) + '">' + esc(label || doel) + '</a></p>',
      formulier: ([naam]) => (formulieren[naam] ? formulieren[naam]() : '<p class="preview-status">Onbekend formulier: ' + esc(naam) + '</p>'),
      sponsorvoorbeeld: () => '<div class="sponsor-voorbeelden"><p class="ini-eyebrow">Voorbeeld: zo staat een Sponsor bij een Initiatief</p>' +
        INI_DATA.slice(0, 4).map((d) => sponsorHtml(d.sponsor)).join('') + '<p class="id-note">Voorbeelden van fictieve bedrijven en logo\'s.</p></div>',
      subpaginas: () => '<ul class="hub-lijst">' + kinderen(p.url).map((k) => '<li><a href="' + k.url + '">' + esc(k.titel) + '</a><span>' + esc(k.beschrijving || '') + '</span></li>').join('') + '</ul>',
    };
    binnen = '<section class="tekstpagina"><div class="wrap"><h1 class="pagina-kop">' + esc(p.h1 || p.titel) + '</h1>' +
      (p.status === 'concept' ? '<span class="preview-status">Conceptversie: de tekst op deze pagina is nog niet definitief.</span>' : '') +
      '<div class="tekst">' + renderMd(p.tekst.body, ctx) + '</div></div></section>';
  } else if (p.colofon) {
    binnen = `<section id="juridisch">
  <div class="hdr-wrap st-wrap">
    <div class="jur-tekst">
      <h1>Colofon</h1>
      <dl class="colofon">
        <dt>Naam</dt><dd>Stichting Mondéall (in oprichting)</dd>
        <dt>E-mail</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd>
        <dt>KvK-nummer</dt><dd>volgt na de oprichting</dd>
        <dt>RSIN</dt><dd>volgt na de oprichting</dd>
        <dt>Btw-nummer</dt><dd>volgt na de oprichting</dd>
        <dt>Adres</dt><dd>volgt na de oprichting</dd>
      </dl>
    </div>
  </div>
</section>`;
  } else if (p.juridisch) {
    binnen = `<section id="juridisch">
  <div class="hdr-wrap st-wrap">
    <div class="jur-tekst">
      <h1>${esc(p.titel)}</h1>
      <div>${p.juridisch}</div>
    </div>
  </div>
</section>`;
  } else if (p.hub || p.plaatshouder) {
    const lijst = kinderen(p.url);
    binnen = `<section class="hub">
  <div class="wrap">
    <h1 class="pagina-kop">${esc(p.titel)}</h1>
    ${p.plaatshouder ? '' : '<p>' + esc(p.beschrijving) + '</p>'}
    ${lijst.length ? '<ul class="hub-lijst">' : ''}
${lijst.map((k) => `      <li><a href="${k.url}">${esc(k.titel)}</a><span>${esc(k.beschrijving)}</span></li>`).join('\n')}
    ${lijst.length ? '</ul>' : ''}
    <span class="preview-status">${tekstVolgtZin}</span>
  </div>
</section>`;
  } else {
    binnen = p.stukken.map(stuk).join('\n\n');
    if (!p.hero) binnen = metH1(binnen);
    if (p.url === '/initiatieven' || p.url === '/') binnen = binnen.replace('<div class="ini-grid" id="ini-grid" role="list"></div>', '<div class="ini-grid" id="ini-grid" role="list">' + zonderScriptLijst() + '</div>');
    if (p.url === '/sectoren') binnen = binnen.replace('<div class="sectoren-grid" id="sectoren-grid"></div>', '<div class="sectoren-grid" id="sectoren-grid">' + sectorenLijst() + '</div>');
  }
  schrijf(utf8Url(p.url), schil(p, binnen));
}

function zonderScriptLijst() {
  return '<ul class="zonder-script">' + INI_DATA.map((d) => '<li><a href="/initiatieven/' + d.slug + '">' + esc(d.titel) + '</a>, ' + esc(d.beg) + ' (' + esc(d.kern) + ')</li>').join('') + '</ul>';
}
function sectorenLijst() {
  return '<ul class="zonder-script">' + sectoren.map((s) => '<li><a href="' + sectorPad(s) + '">' + esc(s.nr + ' ' + s.naam) + '</a>: ' + esc(s.toelichting) + '</li>').join('') + '</ul>';
}

// ---------- Initiatiefpagina's ----------
for (const d of INI_DATA) {
  const p = perUrl.get('/initiatieven/' + d.slug);
  schrijf(utf8Url(p.url), d.v2
    ? schil(p, initiatiefPaginaHtml(d, INI_DATA), { scripts: ['deelmee'] })
    : schil(p, initiatiefHtml(d)));
}

// ---------- sectorpagina's ----------
for (const s of sectoren) {
  const p = perUrl.get(sectorPad(s));
  const voorbeelden = INI_DATA.filter((d) => d.sector === s.nr);
  const binnen = `<section id="sector-pagina" style="--sector-kleur:${s.hex}">
  <div class="wrap">
    <p class="ini-eyebrow"><span class="dot" style="background:${s.hex}"></span> Sector ${s.nr}</p>
    <h1 class="pagina-kop">${esc(s.naam)}</h1>
    <p class="sector-intro">${esc(s.toelichting)}</p>
    <div class="sector-foto"><img src="${s.foto}" alt="" loading="lazy"><span class="foto-credit">Foto: ${esc(s.credit)}</span></div>
    <h2 class="sector-h2">Aandachtsgebieden (${(AANDACHT[s.nr] || []).length})</h2>
    <ul class="sector-lijst">${(AANDACHT[s.nr] || []).map((n) => '<li>' + esc(n) + '</li>').join('')}</ul>
    <h2 class="sector-h2">Voorbeeld-Initiatieven</h2>
    ${voorbeelden.length
      ? '<ul class="sector-voorbeelden">' + voorbeelden.map((d) => '<li><a href="/initiatieven/' + d.slug + '">' + esc(d.titel) + '</a><span>' + esc(d.beg) + ', ' + esc(d.kern) + '. Voorbeeld.</span></li>').join('') + '</ul>'
      : '<p>Nog geen voorbeeld in deze sector.</p>'}
    <p class="sector-terug"><a href="/sectoren">&larr; Alle sectoren</a></p>
  </div>
</section>`;
  schrijf(utf8Url(p.url), schil(p, binnen));
}

// ---------- /sitemap, sitemap.xml, robots.txt, 404 ----------
const groepen = [
  ['Initiatieven', '/initiatieven'], ['Sectoren', '/sectoren'], ['Hoe het werkt', '/hoe-het-werkt'], ['Start een Initiatief', '/starten'], ['Sponsoren', '/sponsoren'],
  ['Over Mondéall', '/over'], ['Partners', '/partners'], ['Hulp', '/hulp'], ['Contact en melden', null],
];
const juridischeUrls = ['/contact', '/melden', '/klachten', '/toegankelijkheid', '/kernen', '/colofon', '/voorwaarden', '/voorwaarden/sponsoren', '/privacy', '/cookies'];
function sitemapHtml() {
  const lijst = (urls) => '<ul>' + urls.map((p) => '<li><a href="' + p.url + '">' + esc(p.titel) + '</a></li>').join('') + '</ul>';
  const blok = ([titel, kop]) => {
    const leden = kop === null ? alle.filter((p) => juridischeUrls.includes(p.url))
      : alle.filter((p) => p.url === kop || p.url.startsWith(kop + '/'));
    return '<section class="sitemap-groep"><h2>' + esc(titel) + '</h2>' + lijst(leden.filter((p) => !p.werkplaats)) + '</section>';
  };
  return '<section id="sitemap"><div class="wrap"><h1 class="pagina-kop">Sitemap</h1><p>Alle pagina\'s van mondeall.nl.</p><p><a href="/">Home</a></p>' + groepen.map(blok).join('') + '</div></section>';
}
const sitemapPagina = { url: '/sitemap', titel: 'Sitemap', beschrijving: 'Alle pagina\'s van mondeall.nl.' };
perUrl.set('/sitemap', sitemapPagina);
schrijf('sitemap/index.html', schil(sitemapPagina, sitemapHtml()));

const vandaag = new Date().toISOString().slice(0, 10);
const publiek = [...alle.filter((p) => !p.noindex && p.url !== '/sitemap'), sitemapPagina];
schrijf('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  publiek.map((p) => '  <url><loc>' + DOMEIN + (p.url === '/' ? '/' : p.url) + '</loc><lastmod>' + vandaag + '</lastmod></url>').join('\n') + '\n</urlset>\n');
schrijf('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /inloggen\nDisallow: /mijn\n\nSitemap: ' + DOMEIN + '/sitemap.xml\n');

const nietGevonden = { url: '/404', titel: 'Pagina niet gevonden', beschrijving: 'Deze pagina bestaat niet.', noindex: true };
schrijf('404.html', schil(nietGevonden, `<section id="juridisch"><div class="hdr-wrap st-wrap"><div class="jur-tekst"><h1>Deze pagina bestaat niet</h1><p>Misschien is het adres veranderd, of staat er een tikfout in. Ga terug naar de <a href="/">beginpagina</a> of zoek een Initiatief in jouw dorp of wijk op <a href="/initiatieven">de pagina met alle Initiatieven</a>.</p></div></div></section>`));

console.log('Klaar: ' + (paginas.length + INI_DATA.length + sectoren.length + 2) + ' pagina\'s in dist/');
