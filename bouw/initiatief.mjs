// Initiatiefpagina: wordt bij het bouwen gemaakt uit de gegevens, zodat de tekst in de HTML staat.
import { sectoren } from '../inhoud/data/sectoren.mjs';
import { INI_STAPPEN } from '../inhoud/data/initiatieven.mjs';
import { INI_ICON, SP_MARK } from '../inhoud/data/merken.mjs';

export const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const tint = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; };
export const sectorVan = (nr) => sectoren.find((x) => x.nr === nr);

export function initiatiefHtml(d) {
  const s = sectorVan(d.sector);
  const steps = INI_STAPPEN.map((st, i) => '<div class="id-step' + (i === (d.afgesloten ? 3 : 2) ? ' on' : '') + '"><small>' + st[0] + '</small>' + st[1] + '</div>').join('');
  const berichten = d.berichten.map((b) => '<div class="id-bericht"><p>' + esc(b[1]) + '</p><p class="naam">' + esc(b[0]) + '</p></div>').join('');
  const sp = d.sponsor;
  const sponsors =
    '<div class="id-sponsor">' +
      '<span class="id-logo" style="background:' + sp.kleur + ';border-radius:' + (sp.vorm === 'vierkant' ? '12px' : '50%') + '">' +
        '<svg viewBox="0 0 48 48" aria-hidden="true">' + SP_MARK[sp.logo](sp.kleur) + '</svg></span>' +
      '<span><span class="id-sponsor-naam" style="' + sp.stijl + '">' + esc(sp.naam) + '</span>' +
      '<span class="id-sponsor-type">' + esc(sp.type) + '</span></span>' +
    '</div>';
  let wie = '';
  if (d.afgesloten) {
    wie += '<div class="id-afgesloten"><p class="q">' + esc(d.beg) + ': &ldquo;Dank, het is genoeg.&rdquo;</p>' +
      '<p>De Begunstigde heeft dit Initiatief zelf afgesloten op ' + esc(d.afgesloten) + '.</p></div>';
  }
  wie += '<div class="id-stats">' +
    '<div class="id-stat"><span class="n">' + d.mensen + '</span><span class="l">mensen deelden mee</span></div>' +
    '<div class="id-stat"><span class="n">&euro; ' + d.bedrag + '</span><span class="l">gedeeld, alles voor ' + esc(d.beg) + '</span></div>' +
    '</div><ul class="id-ritme">';
  if (!d.afgesloten) {
    wie += '<li><strong>Geen doelbedrag.</strong> ' + esc(d.beg) + ' bepaalt zelf wanneer het genoeg is.</li>' +
      '<li><strong>Vaste uitbetaaldag.</strong> Wat je vandaag deelt, staat vrijdag op de rekening van ' + esc(d.beg) + '.</li>';
  }
  wie += '<li><strong>De eerste.</strong> ' + (d.eerste ? esc(d.eerste) : 'Een anonieme Geld Deler') + ' deelde als eerste mee, op ' + esc(d.sinds) + '.</li>' +
    '<li><strong>' + (d.afgesloten ? 'Open van ' + esc(d.sinds) + ' tot ' + esc(d.afgesloten) + '.' : 'Open sinds ' + esc(d.sinds) + '.') + '</strong>' + (d.afgesloten ? '' : ' De Starter verlengt het wekelijks.') + '</li></ul>';
  const aside = d.afgesloten
    ? '<aside class="id-aside"><h2>Dit Initiatief is afgesloten</h2>' +
        '<p>' + esc(d.beg) + ' zegt: dank, het is genoeg. Bedankt aan de ' + d.mensen + ' mensen die meedeelden.</p>' +
        '<p>Dit is een voorbeeldpagina van een fictief Initiatief.</p>' +
        '<a class="cta-btn" href="/initiatieven">Bekijk andere Initiatieven</a></aside>'
    : '<aside class="id-aside"><h2>Straks deel je mee vanaf € 1</h2>' +
        '<p>Elk bedrag telt. Jij kiest.</p>' +
        '<p>Dit is een voorbeeldpagina van een fictief Initiatief. Meedelen kan nog niet: het platform wordt gebouwd.</p>' +
        '<a class="cta-btn" href="/contact">Blijf op de hoogte</a></aside>';
  return '<section id="initiatief-detail"><div class="hdr-wrap">' +
    '<a class="id-back" href="/initiatieven">&larr; Terug naar Initiatieven</a>' +
    '<div class="id-layout"><div>' +
      '<p class="ini-eyebrow id-eyebrow"><span><span class="dot" style="background:' + s.hex + '"></span>' + esc(s.naam) + '</span><span>' + esc(d.kern) + '</span><span>' + (d.afgesloten ? 'Voorbeeld · afgesloten' : 'Voorbeeld') + '</span></p>' +
      '<h1 id="id-kop">' + esc(d.titel) + '</h1>' +
      '<p class="id-sub">' + esc(d.titel) + ' voor ' + esc(d.beg) + ', gestart door ' + esc(d.starter) + '.</p>' +
      '<span class="preview-status">Fictief voorbeeld van een Initiatiefpagina.</span>' +
      '<div class="id-fotowrap"><div class="id-hero" style="background:' + tint(s.hex, 0.12) + '">' +
        '<img src="' + d.foto + '" alt="Sfeerbeeld bij ' + esc(d.titel) + '" style="object-position:center ' + d.pos + '">' +
        '<span class="id-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + INI_ICON[d.sector] + '</svg></span></div>' +
        '<span class="foto-credit">Sfeerbeeld ter illustratie. Foto: ' + esc(d.credit) + '</span></div>' +
      '<div class="id-steps">' + steps + '</div>' +
      '<h2 class="id-h2">De Voorziening</h2>' +
      '<div class="id-prose"><p><strong>' + esc(d.kop) + '</strong></p><p>' + esc(d.tekst) + '</p></div>' +
      '<p class="id-honderd">Straks gaat 100% van jouw bijdrage naar de Voorziening. De kosten worden gedragen door Sponsors.</p>' +
      '<h2 class="id-h2">Wie delen er mee</h2>' + wie +
      '<h2 class="id-h2">Berichten van Geld Delers</h2>' +
      '<p class="id-note">Voorbeeldberichten.</p>' + berichten +
      '<div class="id-sponsors"><p class="ini-eyebrow">Mede mogelijk gemaakt door</p>' +
        '<div class="id-sponsorrow">' + sponsors + '</div>' +
        '<p class="id-note">Voorbeeld-Sponsor: een fictief bedrijf en logo.</p></div>' +
    '</div>' +
    aside +
    '</div>' +
    '</div></section>';
}
