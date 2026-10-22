/* Pagina Sectoren: kaarten en venster met aandachtsgebieden */
(function () {
  if (!document.getElementById('sectoren-grid')) return;
var grid = document.getElementById('sectoren-grid');
var sdDialog = document.getElementById('sector-dialog');
var sdKnop = null;

function openSector(s, knop) {
  var lijst = AANDACHT[s.nr] || [];
  sdKnop = knop;
  sdDialog.style.setProperty('--sector-kleur', s.hex);
  sdDialog.textContent = '';

  var kop = document.createElement('div');
  kop.className = 'sd-kop';
  var img = document.createElement('img');
  img.src = s.foto;
  img.alt = '';
  var label = document.createElement('div');
  label.className = 'sd-label';
  var nrEl = document.createElement('span');
  nrEl.className = 'sd-nr';
  nrEl.textContent = 'Sector ' + s.nr;
  label.appendChild(nrEl);
  var h = document.createElement('h2');
  h.id = 'sd-titel';
  h.textContent = s.naam;
  label.appendChild(h);
  var sluit = document.createElement('button');
  sluit.type = 'button';
  sluit.className = 'sd-sluit';
  sluit.setAttribute('aria-label', 'Sluiten');
  sluit.innerHTML = '&times;';
  sluit.addEventListener('click', function () { sdDialog.close(); });
  kop.appendChild(img);
  kop.appendChild(label);
  kop.appendChild(sluit);

  var body = document.createElement('div');
  body.className = 'sd-body';
  var intro = document.createElement('p');
  intro.className = 'sd-intro';
  intro.textContent = s.toelichting;
  var tel = document.createElement('p');
  tel.className = 'sd-tel';
  tel.textContent = lijst.length + ' aandachtsgebieden';
  var ul = document.createElement('ul');
  ul.className = 'sd-lijst';
  lijst.forEach(function (naam, i) {
    var li = document.createElement('li');
    var n = document.createElement('span');
    n.textContent = naam;
    li.appendChild(n);
    ul.appendChild(li);
  });
  body.appendChild(intro);
  body.appendChild(tel);
  body.appendChild(ul);
  if (s.pad) {
    var meer = document.createElement('p');
    meer.className = 'sd-meer';
    var link = document.createElement('a');
    link.href = s.pad;
    link.textContent = 'Naar de pagina van deze sector';
    meer.appendChild(link);
    body.appendChild(meer);
  }

  sdDialog.appendChild(kop);
  sdDialog.appendChild(body);
  sdDialog.showModal();
}
sdDialog.addEventListener('click', function (e) { if (e.target === sdDialog) sdDialog.close(); });
sdDialog.addEventListener('close', function () { if (sdKnop) sdKnop.focus(); });

grid.textContent = '';
sectoren.forEach(function (s) {
  var card = document.createElement('button');
  card.type = 'button';
  card.className = 'sector-card met-foto';
  card.setAttribute('aria-haspopup', 'dialog');
  card.style.setProperty('--sector-kleur', s.hex);
  card.innerHTML =
    '<span class="foto-wrap">' +
      '<img src="' + s.foto + '" alt="">' +
      '<span class="overlay"></span>' +
      '<span class="label"><span class="dot" style="background:' + s.hex + '"></span>' +
      '<span class="nr">' + s.nr + '</span><span class="naam">' + s.naam + '</span></span>' +
    '</span>' +
    '<span class="body">' +
      '<span class="toelichting">' + s.toelichting + '</span>' +
      '<span class="sector-meer">Bekijk de aandachtsgebieden &rarr;</span>' +
      '<span class="foto-credit">Foto: ' + s.credit + '</span>' +
    '</span>';
  card.addEventListener('click', function () { openSector(s, card); });
  grid.appendChild(card);
});
})();
