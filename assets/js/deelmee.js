// Meedelen-formulier op de voorbeeld-Initiatiefpagina. Er wordt niets opgeslagen of verstuurd.
(function () {
  var pagina = document.getElementById('initiatief-pagina');
  var formulier = document.getElementById('ip-formulier');
  if (!pagina || !formulier) return;

  function el(id) { return document.getElementById(id); }
  var bedragVeld = el('ip-bedrag'), naamVeld = el('ip-naam'), naamBlok = el('ip-naamveld');
  var berichtVeld = el('ip-bericht'), verstuur = el('ip-verstuur'), verdubbeling = el('ip-verdubbeling');
  var url = pagina.getAttribute('data-url');
  var wijze = 'naam';
  var tel = parseInt(el('ip-getal').textContent, 10) || 0;
  var ruimte = parseInt(verdubbeling.getAttribute('data-ruimte'), 10) || 0;
  var maxPer = parseInt(verdubbeling.getAttribute('data-max'), 10) || 100;

  function lees(waarde) {
    var n = parseFloat(String(waarde || '').replace(/\s/g, '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  function euro(n) {
    var heel = Math.round(n * 100) % 100 === 0;
    return '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: heel ? 0 : 2, maximumFractionDigits: 2 });
  }

  function bijwerken() {
    var n = lees(bedragVeld.value);
    var geldig = n >= 1;
    verstuur.textContent = geldig ? 'Deel ' + euro(n) + ' mee' : 'Vul een bedrag vanaf € 1 in';
    verstuur.disabled = !geldig;
  }

  function kiesWijze(w) {
    wijze = w;
    var knoppen = formulier.querySelectorAll('[data-wijze]');
    for (var i = 0; i < knoppen.length; i++) {
      knoppen[i].setAttribute('aria-pressed', knoppen[i].getAttribute('data-wijze') === w ? 'true' : 'false');
    }
    naamBlok.hidden = w !== 'naam';
  }

  var snel = formulier.querySelectorAll('[data-bedrag]');
  for (var i = 0; i < snel.length; i++) {
    snel[i].addEventListener('click', function () {
      bedragVeld.value = this.getAttribute('data-bedrag');
      bijwerken();
    });
  }
  var wijzen = formulier.querySelectorAll('[data-wijze]');
  for (var j = 0; j < wijzen.length; j++) {
    wijzen[j].addEventListener('click', function () { kiesWijze(this.getAttribute('data-wijze')); });
  }
  bedragVeld.addEventListener('input', bijwerken);

  verdubbeling.hidden = ruimte <= 0;
  bijwerken();

  formulier.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = lees(bedragVeld.value);
    if (n < 1) return;
    var verdubbeld = Math.min(n, maxPer, ruimte);
    ruimte -= verdubbeld;
    tel += 1;
    var naam = wijze === 'naam' && naamVeld.value.trim() ? naamVeld.value.trim() : 'Anoniem';
    var bericht = berichtVeld.value.trim();

    var li = document.createElement('li');
    var a = document.createElement('span');
    a.className = 'ip-naam';
    a.textContent = naam;
    li.appendChild(a);
    var z = document.createElement('span');
    z.className = 'ip-zojuist';
    z.textContent = ' (zojuist)';
    li.appendChild(z);
    if (bericht) {
      var c = document.createElement('span');
      c.className = 'ip-citaat';
      c.textContent = bericht;
      li.appendChild(c);
    }
    var lijst = el('ip-delers');
    lijst.insertBefore(li, lijst.firstChild);

    el('ip-getal').textContent = tel;
    el('ip-telregel').textContent = tel + ' Geld Delers deelden al mee.';
    el('ip-ruimte').textContent = euro(ruimte);
    verdubbeling.hidden = ruimte <= 0;

    el('ip-bedankt-bedrag').textContent = euro(n);
    el('ip-bedankt-extra').textContent = euro(verdubbeld);
    el('ip-bedankt-verdubbeld').hidden = verdubbeld <= 0;
    el('ip-bedankt-regel').textContent = naam === 'Anoniem' ? 'Je staat anoniem bij wie deelden.' : 'Je naam staat nu bij wie deelden.';
    el('ip-formulierblok').hidden = true;
    el('ip-bedankt').hidden = false;
    el('ip-bedankt-kop').focus();
  });

  var kopieer = el('ip-kopieer'), label = el('ip-kopieerlabel');
  kopieer.addEventListener('click', function () {
    function terug() { setTimeout(function () { label.textContent = 'Kopieer de link'; }, 3000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { label.textContent = 'Link gekopieerd'; terug(); },
        function () { label.textContent = 'Kopiëren lukt niet, selecteer de link'; terug(); }
      );
    } else {
      label.textContent = 'Kopiëren lukt niet, selecteer de link';
      terug();
    }
  });

  var qrBlok = el('ip-qr');
  if (qrBlok && typeof qrcode === 'function') {
    var q = qrcode(0, 'Q');
    q.addData(url);
    q.make();
    var aantal = q.getModuleCount(), rand = 4, zijde = aantal + 2 * rand, pad = '';
    for (var r = 0; r < aantal; r++) {
      for (var k = 0; k < aantal; k++) {
        if (q.isDark(r, k)) pad += 'M' + (k + rand) + ' ' + (r + rand) + 'h1v1h-1z';
      }
    }
    qrBlok.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + zijde + ' ' + zijde + '" shape-rendering="crispEdges" role="img" aria-label="QR-code naar deze pagina">' +
      '<rect width="' + zijde + '" height="' + zijde + '" fill="#ffffff"/><path fill="#12211d" d="' + pad + '"/></svg>';
  }
})();
