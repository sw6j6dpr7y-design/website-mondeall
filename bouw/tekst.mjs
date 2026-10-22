// Teksten uit inhoud/teksten/*.md: voorblad (frontmatter), een kleine Markdown-vertaler en blokken zoals knoppen en formulieren.
// Geen externe pakketten. Ruwe HTML in een tekst wordt nooit doorgelaten.
import fs from 'node:fs';
import path from 'node:path';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function leesTeksten(map) {
  const resultaat = new Map();
  if (!fs.existsSync(map)) return resultaat;
  const loop = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) { loop(p); continue; }
      if (!f.name.endsWith('.md') || f.name.toLowerCase() === 'readme.md') continue;
      const rel = path.relative(map, p).replace(/\\/g, '/').replace(/\.md$/, '');
      const url = '/' + rel.replace(/\/index$/, '');
      const ruw = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
      resultaat.set(url, { bestand: rel + '.md', ...splits(ruw) });
    }
  };
  loop(map);
  return resultaat;
}

function splits(ruw) {
  const meta = {};
  let body = ruw;
  const m = ruw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m) {
    body = ruw.slice(m[0].length);
    for (const regel of m[1].split('\n')) {
      const k = regel.match(/^([a-zA-Z]+):\s*(.*)$/);
      if (k) meta[k[1]] = k[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return { meta, body };
}

// ---- inline: **vet**, *cursief*, [tekst](adres)
function inline(t) {
  let h = esc(t);
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, tekst, url) => {
    if (!/^(\/|https?:\/\/|mailto:|#)/.test(url)) return m;
    const extern = /^https?:\/\//.test(url);
    return '<a href="' + url + '"' + (extern ? ' rel="noopener"' : '') + '>' + tekst + '</a>';
  });
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return h;
}

// ---- blokken
export function renderMd(body, ctx = {}) {
  const regels = body.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const uit = [];
  let i = 0;
  const leeg = (r) => !r || !r.trim();
  while (i < regels.length) {
    const r = regels[i];
    if (leeg(r)) { i++; continue; }
    let m;
    if ((m = r.match(/^\{\{\s*([a-z-]+)\s*(?::\s*(.*?))?\s*\}\}\s*$/))) {
      const f = ctx[m[1]];
      uit.push(f ? f(m[2] ? m[2].split('|').map((s) => s.trim()) : []) : '<p class="preview-status">Onbekend blok: ' + esc(m[1]) + '</p>');
      i++; continue;
    }
    if ((m = r.match(/^(#{1,3})\s+(.*)$/))) { const n = m[1].length + 1; uit.push('<h' + n + '>' + inline(m[2]) + '</h' + n + '>'); i++; continue; }
    if (/^---+\s*$/.test(r)) { uit.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(r)) {
      const q = [];
      while (i < regels.length && /^>\s?/.test(regels[i])) q.push(regels[i++].replace(/^>\s?/, ''));
      uit.push('<blockquote><p>' + inline(q.join(' ')) + '</p></blockquote>');
      continue;
    }
    if (/^\s*[-*]\s+/.test(r)) {
      const li = [];
      while (i < regels.length && /^\s*[-*]\s+/.test(regels[i])) li.push('<li>' + inline(regels[i++].replace(/^\s*[-*]\s+/, '')) + '</li>');
      uit.push('<ul>' + li.join('') + '</ul>');
      continue;
    }
    if (/^\s*\d+\.\s+/.test(r)) {
      const li = [];
      while (i < regels.length && /^\s*\d+\.\s+/.test(regels[i])) li.push('<li>' + inline(regels[i++].replace(/^\s*\d+\.\s+/, '')) + '</li>');
      uit.push('<ol>' + li.join('') + '</ol>');
      continue;
    }
    if (/^\|/.test(r)) {
      const rijen = [];
      while (i < regels.length && /^\|/.test(regels[i])) rijen.push(regels[i++]);
      const cellen = (x) => x.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
      const kop = cellen(rijen[0]);
      const lijf = rijen.slice(/^\|[\s:|-]+\|?\s*$/.test(rijen[1] || '') ? 2 : 1).map(cellen);
      uit.push('<div class="tabel"><table><thead><tr>' + kop.map((c) => '<th scope="col">' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' +
        lijf.map((rij) => '<tr>' + rij.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    const alinea = [];
    while (i < regels.length && !leeg(regels[i]) && !/^(#{1,3}\s|[-*]\s|\d+\.\s|>|\||\{\{|---)/.test(regels[i])) alinea.push(regels[i++]);
    if (!alinea.length) { alinea.push(regels[i++]); }
    uit.push('<p>' + inline(alinea.join(' ')) + '</p>');
  }
  return uit.join('\n');
}
