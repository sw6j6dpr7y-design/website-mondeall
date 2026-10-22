/* Starten: voorbeeldstappen en de vragen bij Kan jouw organisatie starten? */
(function () {
  if (!document.getElementById('start-tiles') && !document.getElementById('st-uitkomst')) return;
var startSectoren = [
  { icon: "sector-01-internationale-hulp", naam: "Internationale Hulp & Mensenrechten", desc: "Voor hulp en verbondenheid over de grens, van noodhulp tot een partnerschool ver weg." },
  { icon: "sector-02-sociale-hulp", naam: "Sociale Hulp & Ondersteuning", desc: "Voor aandacht en steun dichtbij, van een taalmaatje tot een buurtgereedschapbank." },
  { icon: "sector-03-sport", naam: "Sport & Recreatie", desc: "Voor alles wat een club of clubhuis beter maakt, van een kleedkamer tot veldverlichting." },
  { icon: "sector-04-zorg", naam: "Zorg & Welzijn", desc: "Voor zorg en een plek om op adem te komen, dichtbij en toegankelijk voor wie dat nodig heeft." },
  { icon: "sector-05-kunst", naam: "Kunst & Cultuur", desc: "Voor kunst, muziek en erfgoed die een podium of een herstelbeurt verdienen." },
  { icon: "sector-06-dieren", naam: "Dieren & Natuur", desc: "Voor de zorg voor dieren en de natuur in je eigen omgeving." },
  { icon: "sector-07-milieu", naam: "Milieu & Duurzaamheid", desc: "Voor een groenere en duurzamere leefomgeving, stap voor stap." },
  { icon: "sector-08-onderwijs", naam: "Onderwijs & Educatie", desc: "Voor leren en ontwikkelen, op school en daarbuiten." },
  { icon: "sector-09-wetenschap", naam: "Wetenschap & Innovatie", desc: "Voor onderzoek en nieuwe ideeën die een lokaal vraagstuk vooruithelpen." },
  { icon: "sector-10-religie", naam: "Religie & Levensbeschouwing", desc: "Voor ruimte voor bezinning, ontmoeting en levensbeschouwelijk erfgoed." },
  { icon: "sector-11-samenleving", naam: "Samenleving & Maatschappij", desc: "Voor initiatieven die de buurt samenbrengen, van een buurttuin tot een wijkfestival." },
  { icon: "sector-12-gezondheid", naam: "Gezondheid & Preventie", desc: "Voor gezondheid en veiligheid dichtbij, van reanimatietraining tot een beweegroute." }
];

var tiles = document.getElementById('start-tiles');
var uitleg = document.getElementById('start-uitleg');
var tileEls = [];
startSectoren.forEach(function (s, i) {
  var meta = sectoren[i];
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'sector-tile';
  b.setAttribute('aria-pressed', 'false');
  var img = document.createElement('img');
  img.src = '/assets/iconen/merk/' + s.icon + '.svg';
  img.alt = '';
  var naam = document.createElement('span');
  naam.className = 'naam';
  naam.textContent = s.naam;
  b.appendChild(img); b.appendChild(naam);
  b.addEventListener('click', function () {
    tileEls.forEach(function (t) {
      t.el.setAttribute('aria-pressed', 'false');
      t.el.style.borderColor = '';
      t.el.style.background = '';
      t.img.src = '/assets/iconen/merk/' + t.icon + '.svg';
    });
    b.setAttribute('aria-pressed', 'true');
    b.style.borderColor = meta.hex;
    b.style.background = '#fff';
    img.src = '/assets/iconen/kleur/' + s.icon + '.svg';
    uitleg.textContent = '';
    var titel = document.createElement('div');
    titel.className = 'titel';
    titel.textContent = s.naam;
    var tekst = document.createElement('div');
    tekst.textContent = s.desc;
    uitleg.appendChild(titel); uitleg.appendChild(tekst);
  });
  tileEls.push({ el: b, img: img, icon: s.icon });
  tiles.appendChild(b);
});

function toonStap(n) {
  document.querySelectorAll('[data-panel]').forEach(function (p) {
    p.hidden = p.getAttribute('data-panel') !== String(n);
  });
  document.querySelectorAll('#stepper button').forEach(function (b) {
    if (b.getAttribute('data-step') === String(n)) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
}
document.querySelectorAll('#stepper button').forEach(function (b) {
  b.addEventListener('click', function () { toonStap(b.getAttribute('data-step')); });
});
document.querySelectorAll('.flow-next').forEach(function (b) {
  b.addEventListener('click', function () { toonStap(b.getAttribute('data-goto')); });
});
document.querySelectorAll('[data-goto-link]').forEach(function (l) {
  l.addEventListener('click', function (e) { e.preventDefault(); toonStap(l.getAttribute('data-goto-link')); });
});

var ST = { 1: '', 2: '', 3: '' };
function stRender() {
  document.querySelectorAll('#starten .st-opt').forEach(function (b) {
    b.setAttribute('aria-pressed', ST[b.dataset.q] === b.dataset.v ? 'true' : 'false');
  });
  var nee1 = ST[1] === 'nee';
  var nee2 = !nee1 && ST[2] === 'nee';
  var tw2 = !nee1 && ST[2] === 'twijfel';
  var nee3 = !nee1 && !nee2 && !tw2 && ST[3] === 'nee';
  var ja = ST[1] === 'ja' && ST[2] === 'ja' && ST[3] === 'ja';
  var res = nee1 ? 'nee1' : nee2 ? 'nee2' : tw2 ? 'twijfel2' : nee3 ? 'nee3' : ja ? 'ja' : 'open';
  document.querySelectorAll('#st-uitkomst [data-res]').forEach(function (d) { d.hidden = d.dataset.res !== res; });
  document.getElementById('st-uitkomst').classList.toggle('ja', res === 'ja');
}
document.getElementById('starten').addEventListener('click', function (e) {
  var b = e.target.closest('.st-opt');
  if (!b) return;
  ST[b.dataset.q] = b.dataset.v;
  stRender();
});
stRender();
})();
