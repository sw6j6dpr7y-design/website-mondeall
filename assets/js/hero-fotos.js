/* Voorpagina: wisselende voorbeeldfoto's met stippen en pauzeknop. Geen gegevens, geen scripts van derden. */
(function () {
  var lijst = document.getElementById('fh-lijst');
  if (!lijst) return;
  var dia = Array.prototype.slice.call(lijst.querySelectorAll('.fh-slide'));
  var stip = Array.prototype.slice.call(document.querySelectorAll('.fh-stip'));
  var tekst = document.getElementById('fh-tekst');
  var pauze = document.getElementById('fh-pauze');
  var nu = 0, timer = null;
  var stil = false;
  try { stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function toon(n) {
    nu = (n + dia.length) % dia.length;
    dia.forEach(function (d, k) { d.classList.toggle('on', k === nu); });
    stip.forEach(function (s, k) {
      s.classList.toggle('on', k === nu);
      if (k === nu) s.setAttribute('aria-current', 'true'); else s.removeAttribute('aria-current');
    });
    tekst.innerHTML = dia[nu].querySelector('figcaption').innerHTML;
  }
  function loop() {
    clearInterval(timer);
    if (!stil) timer = setInterval(function () { toon(nu + 1); }, 5000);
    pauze.textContent = stil ? '\u25B6' : 'II';
    pauze.setAttribute('aria-label', stil ? 'Wisseling hervatten' : 'Wisseling pauzeren');
    lijst.setAttribute('aria-live', stil ? 'polite' : 'off');
  }
  stip.forEach(function (s) { s.addEventListener('click', function () { toon(parseInt(s.getAttribute('data-ga'), 10)); loop(); }); });
  pauze.addEventListener('click', function () { stil = !stil; loop(); });
  loop();
})();
