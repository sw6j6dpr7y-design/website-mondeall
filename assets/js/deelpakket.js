/* Het deelpakket: kleurkeuze voor het voorbeeld van de deelknop. Er wordt niets opgeslagen of verstuurd. */
(function () {
  var stage = document.getElementById('dp-stage');
  var uit = document.getElementById('dp-contrast');
  if (!stage || !uit) return;
  var WIT = '/assets/deelpakket/klavertje-wit.png';
  var INK = '/assets/deelpakket/klavertje-ink.png';

  function lum(hex) {
    var n = parseInt(hex.slice(1), 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function nl(n) { return n.toFixed(1).replace('.', ','); }

  function zet(hex) {
    var metWit = ratio(hex, '#ffffff'), metInk = ratio(hex, '#12211d');
    var wit = metWit >= metInk, r = wit ? metWit : metInk;
    stage.style.setProperty('--club', hex);
    stage.style.setProperty('--clubtekst', wit ? '#ffffff' : '#12211d');
    var beelden = stage.querySelectorAll('.dp-klaverknop');
    for (var i = 0; i < beelden.length; i++) beelden[i].src = wit ? WIT : INK;
    if (r >= 4.5) {
      uit.className = 'dp-contrast';
      uit.innerHTML = 'Contrast tussen tekst en knop: <b>' + nl(r) + '</b> (voldoet aan AA).';
    } else {
      uit.className = 'dp-contrast dp-slecht';
      uit.innerHTML = 'Contrast tussen tekst en knop: <b>' + nl(r) + '</b>. Dat is te laag om goed te lezen. Kies een donkerdere of lichtere kleur.';
    }
  }

  try {
    document.getElementById('dp-kleurrij').addEventListener('change', function (e) {
      if (e.target.name === 'dp-kleur') zet(e.target.value);
    });
    document.getElementById('dp-eigenkleur').addEventListener('input', function (e) {
      var rs = document.querySelectorAll('input[name="dp-kleur"]');
      for (var i = 0; i < rs.length; i++) rs[i].checked = false;
      zet(e.target.value);
    });
    zet('#005248');
  } catch (err) { /* de pagina blijft leesbaar zonder het voorbeeld */ }
})();
