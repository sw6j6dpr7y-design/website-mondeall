/* Iets niet pluis melden: controle van het formulier. Er wordt niets opgeslagen of verstuurd. */
(function () {
  var form = document.getElementById('mb-form');
  var melding = document.getElementById('mb-melding');
  if (!form || !melding) return;
  function zet(id, ok, el) {
    var f = document.getElementById(id + '-fout');
    if (f) f.classList.toggle('zichtbaar', !ok);
    if (el) { if (ok) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true'); }
    return ok;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var soort = !!form.querySelector('input[name="soort"]:checked');
    var wat = document.getElementById('mb-wat');
    var mail = document.getElementById('mb-mail');
    var m = mail.value.trim();
    var a = zet('mb-soort', soort);
    var b = zet('mb-wat', wat.value.trim() !== '', wat);
    var c = zet('mb-mail', m === '' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m), mail);
    melding.classList.remove('zichtbaar');
    if (a && b && c) { melding.classList.add('zichtbaar'); melding.focus(); }
    else if (!a) form.querySelector('input[name="soort"]').focus();
    else if (!b) wat.focus();
    else mail.focus();
  });
})();
