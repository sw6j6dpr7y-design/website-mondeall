/* Sponsorpagina's: plaatszoeker en aanmeldformulieren die een e-mail aan Mondéall openen. Er wordt niets opgeslagen. */
(function () {
  // Gemeenten waar Mondéall actief is of wordt voorbereid, met hun kernen.
  var GEMEENTEN = [
    { naam: 'Lochem', pad: '/sponsoren/lochem', plaatsen: ['Almen', 'Barchem', 'Eefde', 'Epse', 'Exel', 'Gorssel', 'Harfsen', 'Joppe', 'Kring van Dorth', 'Laren', 'Lochem', 'Oolde', 'Zwiep'] }
  ];
  var ADRES = 'info@mondeall.eu';

  function mail(onderwerp, regels) {
    window.location.href = 'mailto:' + ADRES + '?subject=' + encodeURIComponent(onderwerp) + '&body=' + encodeURIComponent(regels.join('\n'));
  }

  var zoek = document.getElementById('plaats');
  if (zoek) {
    var lijst = document.getElementById('plaatsLijst');
    var niet = document.getElementById('uitslagNiet');
    zoek.addEventListener('input', function () {
      var q = zoek.value.trim().toLowerCase();
      var treffers = [];
      if (q.length >= 2) {
        GEMEENTEN.forEach(function (g) {
          g.plaatsen.forEach(function (p) { if (p.toLowerCase().indexOf(q) === 0) treffers.push({ plaats: p, gemeente: g }); });
        });
      }
      lijst.textContent = '';
      treffers.forEach(function (t) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = t.gemeente.pad;
        var l = document.createElement('span');
        l.textContent = t.plaats;
        var r = document.createElement('span');
        r.className = 'sp-status';
        r.textContent = 'gemeente ' + t.gemeente.naam;
        a.appendChild(l);
        a.appendChild(r);
        li.appendChild(a);
        lijst.appendChild(li);
      });
      lijst.hidden = treffers.length === 0;
      niet.hidden = !(q.length >= 3 && treffers.length === 0);
    });

    document.getElementById('interesseForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var mailadres = document.getElementById('interesse').value.trim();
      if (!mailadres) return;
      mail('Sponsor in een andere gemeente', ['E-mailadres: ' + mailadres, 'Plaats: ' + zoek.value.trim(), 'Wil horen wanneer Mondéall naar deze gemeente komt.']);
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
