// Bouwscript van mondeall.eu: maakt van de paginabron en de stukken in inhoud/ de HTML-pagina's in dist/.
// Geen externe pakketten; draait met een gewone Node.js (versie 20 of hoger).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { DOMEIN, NAAM, BASISTITEL, BESCHRIJVING, DEELBEELD } from '../inhoud/config.mjs';
import { paginas, afgeleidePaginas, sectorPad, tekstVolgtZin } from '../inhoud/paginas.mjs';
import { sectoren, AANDACHT } from '../inhoud/data/sectoren.mjs';
import { INI_DATA } from '../inhoud/data/initiatieven.mjs';
import { IF_KERNEN, IF_KERNBUURT } from '../inhoud/data/kernen.mjs';
import { initiatiefHtml, esc, sectorVan } from './initiatief.mjs';

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
  'var INI_DATA = ' + JSON.stringify(INI_DATA) + ';\n' +
  'var IF_KERNEN = ' + JSON.stringify(IF_KERNEN) + ';\n' +
  'var IF_KERNBUURT = ' + JSON.stringify(IF_KERNBUURT) + ';\n');

const versie = (rel) => crypto.createHash('md5').update(fs.readFileSync(path.join(DIST, rel))).digest('hex').slice(0, 8);
const activa = (rel) => '/' + rel + '?v=' + versie(rel);

// ---------- stukken ----------
const stuk = (naam) => lees('inhoud', 'fragmenten', naam + '.html').trimEnd();
const lint = lees('inhoud', 'sjabloon', 'lint.html').trimEnd();
const hero = lees('inhoud', 'sjabloon', 'hero.html').trimEnd();
const voet = lees('inhoud', 'sjabloon', 'footer.html').trimEnd();

// ---------- alle pagina's (voor kruimels, hubs en sitemap) ----------
const alle = [...paginas, ...afgeleidePaginas()];
const perUrl = new Map(alle.map((p) => [p.url, p]));
const segmenten = (u) => u.split('/').filter(Boolean).length;
const kinderen = (url) => alle.filter((p) => p.url.startsWith(url + '/') && segmenten(p.url) === segmenten(url) + 1 && !p.noindex && !p.initiatief && !p.sector);

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
  const titel = p.url === '/' ? BASISTITEL : p.titel + ' · ' + NAAM;
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Source+Serif+4:opsz,wght@8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${activa('assets/site.css')}">
${jsonLd(p)}
</head>
<body>
${kaal ? '' : '<a class="skip" href="#inhoud">Naar de inhoud</a>\n\n<header>\n' + lint + (p.hero ? '\n\n' + hero : '') + '\n</header>\n'}
${kaal ? '' : kruimels(p) + '\n'}<main id="inhoud">
${binnen}
</main>
${kaal ? '' : '\n' + voet + '\n'}
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
  if (p.juridisch) {
    binnen = `<section id="juridisch">
  <div class="hdr-wrap st-wrap">
    <div class="jur-tekst">
      <h1>${esc(p.titel)}</h1>
      <div>${p.juridisch}</div>
    </div>
  </div>
</section>`;
  } else if (p.hub) {
    const lijst = kinderen(p.url);
    binnen = `<section class="hub">
  <div class="wrap">
    <h1 class="pagina-kop">${esc(p.titel)}</h1>
    <p>${esc(p.beschrijving)}</p>
    <ul class="hub-lijst">
${lijst.map((k) => `      <li><a href="${k.url}">${esc(k.titel)}</a><span>${esc(k.beschrijving)}</span></li>`).join('\n')}
    </ul>
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
  schrijf(utf8Url(p.url), schil(p, initiatiefHtml(d)));
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
  ['Initiatieven', '/initiatieven'], ['Sectoren', '/sectoren'], ['Hoe het werkt', '/hoe-het-werkt'], ['Start een Initiatief', '/starten'],
  ['Over Mondéall', '/over'], ['Partners', '/partners'], ['Hulp en contact', '/contact'], ['Juridisch', null],
];
const juridischeUrls = ['/voorwaarden', '/privacy', '/cookies'];
function sitemapHtml() {
  const lijst = (urls) => '<ul>' + urls.map((p) => '<li><a href="' + p.url + '">' + esc(p.titel) + '</a></li>').join('') + '</ul>';
  const blok = ([titel, kop]) => {
    const leden = kop === null ? alle.filter((p) => juridischeUrls.includes(p.url))
      : alle.filter((p) => p.url === kop || p.url.startsWith(kop + '/'));
    return '<section class="sitemap-groep"><h2>' + esc(titel) + '</h2>' + lijst(leden.filter((p) => !p.noindex)) + '</section>';
  };
  return '<section id="sitemap"><div class="wrap"><h1 class="pagina-kop">Sitemap</h1><p>Alle pagina\'s van mondeall.eu.</p><p><a href="/">Home</a></p>' + groepen.map(blok).join('') + '</div></section>';
}
const sitemapPagina = { url: '/sitemap', titel: 'Sitemap', beschrijving: 'Alle pagina\'s van mondeall.eu.' };
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
