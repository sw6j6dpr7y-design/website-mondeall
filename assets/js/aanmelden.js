/* Aanmelden: plaatszoeker en controle van het formulier. Er wordt niets opgeslagen of verstuurd. */
(function () {
  // Voorbeeldlijst. In productie komt de lijst met plaatsen en gemeenten uit de gegevens van Mondéall.
  var plaatsen = [
    { naam: 'Laren', detail: 'Gelderland', gemeente: 'Lochem' },
    { naam: 'Laren', detail: 'Noord-Holland', gemeente: 'Laren' },
    { naam: 'Lochem', detail: 'Gelderland', gemeente: 'Lochem' },
    { naam: 'Eibergen', detail: 'Gelderland', gemeente: 'Berkelland' },
    { naam: 'Goor', detail: 'Overijssel', gemeente: 'Hof van Twente' }
  ];
  var inp = document.getElementById('am-plaats');
  var lijst = document.getElementById('am-sug');
  var form = document.getElementById('am-start');
  if (!inp || !lijst || !form) return;
  var gem = document.getElementById('am-gem');
  var gemnaam = document.getElementById('am-gemnaam');
  var melding = document.getElementById('am-melding');
  var gekozen = null, actief = -1, huidig = [];

  function sluit() {
    lijst.hidden = true;
    inp.setAttribute('aria-expanded', 'false');
    inp.removeAttribute('aria-activedescendant');
    actief = -1;
  }
  function kies(i) {
    var p = huidig[i];
    if (!p) return;
    gekozen = p;
    inp.value = p.naam + ' (' + p.detail + ')';
    gemnaam.textContent = p.gemeente;
    gem.classList.add('zichtbaar');
    document.getElementById('am-plaats-fout').classList.remove('zichtbaar');
    inp.removeAttribute('aria-invalid');
    sluit();
  }
  function toon() {
    var q = inp.value.trim().toLowerCase();
    gekozen = null;
    gem.classList.remove('zichtbaar');
    if (!q) { sluit(); return; }
    huidig = plaatsen.filter(function (p) { return p.naam.toLowerCase().indexOf(q) === 0; });
    lijst.innerHTML = '';
    if (!huidig.length) { sluit(); return; }
    huidig.forEach(function (p, i) {
      var li = document.createElement('li');
      li.id = 'am-opt' + i;
      li.setAttribute('role', 'option');
      var naam = document.createTextNode(p.naam);
      var klein = document.createElement('small');
      klein.textContent = p.detail;
      li.appendChild(naam);
      li.appendChild(klein);
      li.addEventListener('mousedown', function (e) { e.preventDefault(); kies(i); });
      lijst.appendChild(li);
    });
    lijst.hidden = false;
    inp.setAttribute('aria-expanded', 'true');
    actief = -1;
  }
  function markeer() {
    Array.prototype.forEach.call(lijst.children, function (li, i) {
      li.setAttribute('aria-selected', i === actief ? 'true' : 'false');
    });
    if (actief >= 0) inp.setAttribute('aria-activedescendant', 'am-opt' + actief);
  }
  inp.addEventListener('input', toon);
  inp.addEventListener('blur', function () { setTimeout(sluit, 100); });
  inp.addEventListener('keydown', function (e) {
    if (lijst.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); actief = Math.min(actief + 1, huidig.length - 1); markeer(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); actief = Math.max(actief - 1, 0); markeer(); }
    else if (e.key === 'Enter' && actief >= 0) { e.preventDefault(); kies(actief); }
    else if (e.key === 'Escape') { sluit(); }
  });

  function check(naam, ok) {
    var el = document.getElementById('am-' + naam);
    var f = document.getElementById('am-' + naam + '-fout');
    if (!el || !f) return ok;
    if (ok) { el.removeAttribute('aria-invalid'); f.classList.remove('zichtbaar'); }
    else { el.setAttribute('aria-invalid', 'true'); f.classList.add('zichtbaar'); }
    return ok;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = check('org', document.getElementById('am-org').value.trim() !== '');
    var b = check('plaats', !!gekozen);
    var c = check('titel', document.getElementById('am-titel').value.trim() !== '');
    var d = check('mail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(document.getElementById('am-mail').value.trim()));
    melding.classList.remove('zichtbaar');
    if (a && b && c && d) { melding.classList.add('zichtbaar'); melding.focus(); }
    else { var eerste = form.querySelector('[aria-invalid="true"]'); if (eerste) eerste.focus(); }
  });
})();
