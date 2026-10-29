// Woordcontrole: doorzoekt na de build de pagina's in dist/ op de woordregel (inhoud/woordregel.mjs).
// Gebruik:  node bouw/woordcontrole.mjs --meld     (rapporteren, altijd afsluiten met 0)
//           node bouw/woordcontrole.mjs --streng   (afsluiten met 1 als er een fout is)
// Wijzigt geen teksten. Draait op wat de bezoeker en de zoekmachine krijgen: zichtbare tekst, title, meta, og, alt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { termen } from '../inhoud/woordregel.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const modus = process.argv.includes('--streng') ? 'streng' : 'meld';

const ontsnap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'", '&euro;': '€', '&larr;': '←', '&middot;': '·' };
const ontcijfer = (t) => t.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&[a-z]+;|&#39;/gi, (m) => ontsnap[m.toLowerCase()] ?? m);

function paginas(map) {
  const uit = [];
  for (const f of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, f.name);
    if (f.isDirectory()) uit.push(...paginas(p)); else if (f.name.endsWith('.html')) uit.push(p);
  }
  return uit;
}

const adres = (bestand) => {
  const rel = path.relative(DIST, bestand).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
};

// Per pagina: lijst van { bron, tekst }
function stukken(html) {
  const lijst = [];
  const attr = (naam, tag) => { const m = tag.match(new RegExp('\\b' + naam + '="([^"]*)"')); return m ? ontcijfer(m[1]) : null; };
  const t = html.match(/<title>([\s\S]*?)<\/title>/); if (t) lijst.push({ bron: 'title', tekst: ontcijfer(t[1]) });
  for (const tag of html.match(/<meta\b[^>]*>/g) || []) {
    const naam = attr('name', tag) || attr('property', tag);
    if (['description', 'og:title', 'og:description', 'og:image:alt'].includes(naam)) lijst.push({ bron: naam, tekst: attr('content', tag) || '' });
  }
  for (const tag of html.match(/<img\b[^>]*>/g) || []) { const a = attr('alt', tag); if (a) lijst.push({ bron: 'alt', tekst: a }); }
  const lijf = (html.match(/<body[\s\S]*<\/body>/) || [html])[0]
    .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  lijst.push({ bron: 'tekst', tekst: ontcijfer(lijf).replace(/\s+/g, ' ') });
  return lijst;
}

const regex = termen.map((t) => ({ ...t, re: new RegExp('(?<![\\p{L}\\d])(?:' + t.patroon + ')(?![\\p{L}\\d])', 'gu' + (t.hoofdlettergevoelig ? '' : 'i')) }));
const treffers = [];
for (const bestand of paginas(DIST).sort()) {
  const url = adres(bestand);
  for (const s of stukken(fs.readFileSync(bestand, 'utf8'))) {
    for (const t of regex) {
      if (t.alleenZichtbaar && s.bron !== 'tekst') continue;
      for (const m of s.tekst.matchAll(t.re)) {
        const toegestaan = (t.toegestaanOp || []).some((v) => url.startsWith(v));
        const van = Math.max(0, m.index - 20), tot = Math.min(s.tekst.length, m.index + m[0].length + 20);
        treffers.push({ url, term: t.naam, gevonden: m[0], soort: t.soort, bron: s.bron, toegestaan, opmerking: t.opmerking || '',
          context: (van > 0 ? '…' : '') + s.tekst.slice(van, tot) + (tot < s.tekst.length ? '…' : '') });
      }
    }
  }
}

const echt = treffers.filter((x) => !x.toegestaan);
const fouten = echt.filter((x) => x.soort === 'fout');
const waarschuwingen = echt.filter((x) => x.soort === 'waarschuwing');
const mooi = (x) => '| ' + [x.url, x.term, x.soort, x.bron, '"' + x.context.replace(/\|/g, '/') + '"' + (x.opmerking ? ' (' + x.opmerking + ')' : '')].join(' | ') + ' |';

console.log('Woordcontrole (' + modus + '): ' + paginas(DIST).length + ' pagina\'s doorzocht.\n');
for (const [kop, lijst] of [['Fouten', fouten], ['Waarschuwingen', waarschuwingen]]) {
  console.log(kop + ': ' + lijst.length);
  if (lijst.length) { console.log('| pagina | term | soort | waar | context |\n|---|---|---|---|---|'); lijst.forEach((x) => console.log(mooi(x))); }
  console.log('');
}
const toegestaan = treffers.filter((x) => x.toegestaan);
console.log('Toegestaan volgens de uitzonderingen (/verschil/): ' + toegestaan.length);
toegestaan.forEach((x) => console.log(mooi(x)));

if (modus === 'streng' && fouten.length) { console.error('\nGefaald: ' + fouten.length + ' fout(en).'); process.exit(1); }
