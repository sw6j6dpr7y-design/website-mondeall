/* Sponsorpagina's: plaatscontrole en aanmeldformulieren die een e-mail aan Mondéall openen. Er wordt niets opgeslagen. */
(function () {
  var LOCHEM = ['lochem', 'almen', 'barchem', 'eefde', 'epse', 'gorssel', 'harfsen', 'joppe', 'kring van dorth', 'laren', 'exel', 'oolde', 'zwiep'];
  var ADRES = 'info@mondeall.eu';

  function mail(onderwerp, regels) {
    window.location.href = 'mailto:' + ADRES + '?subject=' + encodeURIComponent(onderwerp) + '&body=' + encodeURIComponent(regels.join('\n'));
  }

  var plaatsForm = document.getElementById('plaatsForm');
  if (plaatsForm) {
    var actief = document.getElementById('uitslagActief');
    var niet = document.getElementById('uitslagNiet');
    plaatsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ruw = document.getElementById('plaats').value.trim();
      actief.hidden = true;
      niet.hidden = true;
      if (!ruw) return;
      var naam = ruw.charAt(0).toUpperCase() + ruw.slice(1);
      var doel = LOCHEM.indexOf(ruw.toLowerCase()) >= 0 ? actief : niet;
      Array.prototype.forEach.call(doel.querySelectorAll('.sp-plaats'), function (s) { s.textContent = naam; });
      doel.hidden = false;
      if (doel === niet) niet.dataset.plaats = naam;
    });
    var interesse = document.getElementById('interesseForm');
    if (interesse) interesse.addEventListener('submit', function (e) {
      e.preventDefault();
      var mailadres = document.getElementById('interesse').value.trim();
      if (!mailadres) return;
      mail('Sponsor in een andere gemeente', ['E-mailadres: ' + mailadres, 'Plaats: ' + (niet.dataset.plaats || ''), 'Wil horen wanneer Mondéall naar deze gemeente komt.']);
    });
  }

  var start = document.getElementById('startgroepForm');
  if (start) start.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    mail('Aanmelding Startgroep Sponsors', [
      'Onderneming: ' + v('f-org'), 'Naam: ' + v('f-naam'), 'E-mailadres: ' + v('f-mail'),
      'Gemeente: ' + v('f-gem'), 'Kern: ' + v('f-kern'),
    ]);
  });
})();
