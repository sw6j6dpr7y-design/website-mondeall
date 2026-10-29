// Herbruikbare onderdelen voor pagina's. De teksten komen uit inhoud/config.mjs, zodat ze op één plek te wijzigen zijn.
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Statusregel boven een pagina: de eerste zin staat vet, de rest gewoon.
export function statusregel(tekst) {
  const i = tekst.indexOf('. ');
  const kop = i === -1 ? tekst : tekst.slice(0, i + 1);
  const rest = i === -1 ? '' : tekst.slice(i + 2);
  return '<p class="sl-status"><span class="sl-stip" aria-hidden="true"></span><span><strong>' + esc(kop) + '</strong>' + (rest ? ' ' + esc(rest) : '') + '</span></p>';
}
