/* Stichting Mondéall: gemeentefilter voor het voorbeeldblok met steunende organisaties. Er wordt niets opgeslagen of verstuurd. */
(function () {
  var knoppen = document.querySelectorAll('.st-filter');
  var groepen = ['st-sponsors', 'st-publiek', 'st-overig'];
  if (!knoppen.length) return;

  function toon(g) {
    Array.prototype.forEach.call(knoppen, function (k) {
      k.setAttribute('aria-pressed', k.getAttribute('data-g') === g ? 'true' : 'false');
    });
    groepen.forEach(function (id) {
      var ul = document.getElementById(id);
      if (!ul) return;
      var n = 0;
      Array.prototype.forEach.call(ul.querySelectorAll('li'), function (li) {
        var d = li.getAttribute('data-g');
        var ok = g === 'alle' || d === g || d === 'alle';
        li.hidden = !ok;
        if (ok) n++;
      });
      var tekst = ul.previousElementSibling;
      var kop = tekst && tekst.previousElementSibling;
      ul.hidden = n === 0;
      if (tekst) tekst.hidden = n === 0;
      if (kop) kop.hidden = n === 0;
    });
  }
  Array.prototype.forEach.call(knoppen, function (k) {
    k.addEventListener('click', function () { toon(k.getAttribute('data-g')); });
  });
})();
