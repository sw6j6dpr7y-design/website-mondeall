/* Pers: de tekst "Mondéall in het kort" kopiëren. Er wordt niets verstuurd. */
(function () {
  var knop = document.getElementById('pe-kopieer');
  var status = document.getElementById('pe-status');
  if (!knop || !status) return;
  knop.addEventListener('click', function () {
    var tekst = Array.prototype.map.call(document.querySelectorAll('#pe-boilerplate p'), function (p) { return p.textContent.trim(); }).join('\n\n');
    function klaar(ok) { status.textContent = ok ? 'Gekopieerd.' : 'Kopiëren lukte niet. Selecteer de tekst en kopieer hem zelf.'; }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(tekst).then(function () { klaar(true); }, function () { klaar(false); }); }
      else { klaar(false); }
    } catch (e) { klaar(false); }
  });
})();
