/* Foto's insturen: controle van het formulier. Er wordt niets opgeslagen of verstuurd. */
(function () {
  var form = document.getElementById('fi-formulier');
  var melding = document.getElementById('fi-melding');
  if (!form || !melding) return;
  function zet(id, ok) {
    var f = document.getElementById(id + '-fout');
    if (f) f.classList.toggle('zichtbaar', !ok);
    var el = document.getElementById(id);
    if (el) { if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true'); }
    return ok;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var link = v('fi-link');
    var vakken = [
      ['fi-naam', v('fi-naam') !== ''],
      ['fi-mail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('fi-mail'))],
      ['fi-plaats', v('fi-plaats') !== ''],
      ['fi-link', link === '' || /^https?:\/\/[^\s.]+\.[^\s]+$/.test(link)],
      ['fi-wat', v('fi-wat') !== ''],
      ['fi-bestand', document.getElementById('fi-bestand').files.length > 0]
    ];
    var eerste = null;
    vakken.forEach(function (x) { if (!zet(x[0], x[1]) && !eerste) eerste = x[0]; });
    var vinkjes = form.querySelectorAll('input[name="akkoord"]');
    var allemaal = Array.prototype.every.call(vinkjes, function (c) { return c.checked; });
    zet('fi-akkoord', allemaal);
    melding.classList.remove('zichtbaar');
    if (!eerste && allemaal) { melding.classList.add('zichtbaar'); melding.focus(); }
    else if (eerste) document.getElementById(eerste).focus();
    else vinkjes[0].focus();
  });
})();
