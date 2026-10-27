/* Gemeenschappelijk: helpers, lint met keuzemenu's, scrollgedrag, tabs en contactformulier */
  function iniEsc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function iniTint(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function iniSector(nr) { return sectoren.filter(function (x) { return x.nr === nr; })[0]; }
  var IF_ICON = { "01": "sector-01-internationale-hulp", "02": "sector-02-sociale-hulp", "03": "sector-03-sport", "04": "sector-04-zorg", "05": "sector-05-kunst", "06": "sector-06-dieren", "07": "sector-07-milieu", "08": "sector-08-onderwijs", "09": "sector-09-wetenschap", "10": "sector-10-religie", "11": "sector-11-samenleving", "12": "sector-12-gezondheid" };

  (function () {
    var knop = document.getElementById('pauze'), hero = document.getElementById('hero');
    if (!knop || !hero) return;
    knop.addEventListener('click', function () {
      var uit = hero.classList.toggle('paused');
      var tekst = uit ? 'Beweging hervatten' : 'Beweging pauzeren';
      knop.setAttribute('aria-label', tekst);
      knop.setAttribute('title', tekst);
    });
  })();

  /* LINT: keuzemenu's, inloggen-knoppen, Kan jouw organisatie starten? */
  var menuKnoppen = document.querySelectorAll('header [data-menu]');
  var hoofdnavEl = document.getElementById('hoofdmenu');
  function sluitMenus(focusTerug) {
    var terug = null;
    menuKnoppen.forEach(function (b) {
      if (b.getAttribute('aria-expanded') === 'true') terug = b;
      b.setAttribute('aria-expanded', 'false');
      if (b.dataset.menu !== 'nav') document.getElementById(b.getAttribute('aria-controls')).hidden = true;
    });
    if (hoofdnavEl) hoofdnavEl.classList.remove('open');
    if (focusTerug && terug) terug.focus();
  }
  menuKnoppen.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = b.getAttribute('aria-expanded') === 'true';
      sluitMenus(false);
      if (open) return;
      b.setAttribute('aria-expanded', 'true');
      if (b.dataset.menu === 'nav' && hoofdnavEl) hoofdnavEl.classList.add('open');
      else document.getElementById(b.getAttribute('aria-controls')).hidden = false;
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('header .menupaneel') && !e.target.closest('header [data-menu]')) sluitMenus(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sluitMenus(true); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.closest('header')) sluitMenus(false);
  });

  /* Lint schuift weg bij naar beneden scrollen en komt terug bij omhoog scrollen (blijft staan als een menu open is) */
  var kopEl = document.querySelector('header .bar-wrap'), kopY = 0;
  function kopMenuOpen() { return !!document.querySelector('header [data-menu][aria-expanded="true"]'); }
  if (kopEl) window.addEventListener('scroll', function () {
    var y = window.scrollY || document.documentElement.scrollTop || 0, d = y - kopY;
    if (Math.abs(d) < 6) return;
    kopY = y;
    kopEl.classList.toggle('weg', y > 80 && d > 0 && !kopMenuOpen());
  }, { passive: true });
  if (kopEl) kopEl.addEventListener('focusin', function () { kopEl.classList.remove('weg'); });


  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var rolParam = new URLSearchParams(location.search).get('rol');
    if (rolParam) document.getElementById('rol').value = rolParam;
  }
  if (contactForm) contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var naam = document.getElementById('naam').value.trim();
    var rol = document.getElementById('rol').value;

    var subject = encodeURIComponent('Aanmelding mondeall.nl');
    var bodyLines = ['E-mailadres: ' + email];
    if (naam) bodyLines.push('Naam: ' + naam);
    if (rol) bodyLines.push('Rol: ' + rol);
    var body = encodeURIComponent(bodyLines.join('\n'));

    window.location.href = 'mailto:info@mondeall.eu?subject=' + subject + '&body=' + body;
  });

  /* Oude adressen met een hekje (#/...) sturen door naar de echte pagina's */
  (function () {
    if (location.pathname !== '/' || location.hash.indexOf('#/') !== 0) return;
    var h = location.hash.slice(2), kaart = {
      'starten': '/starten/check', 'inloggen': '/inloggen', 'werkplaats': '/inloggen', 'hoe-het-werkt': '/hoe-het-werkt',
      'wat-is-mondeall': '/over/missie', 'vertrouwen': '/over/missie', 'sectoren': '/sectoren', 'stelsel': '/over/stelsel',
      'gemeenten': '/partners#gemeenten', 'verhaal': '/over/verhaal', 'voorwaarden': '/voorwaarden', 'privacy': '/privacy', 'cookies': '/cookies'
    };
    var m = h.match(/^initiatief\/([a-z0-9-]+)$/);
    var doel = m ? '/initiatieven/' + m[1] : kaart[h];
    if (doel) location.replace(doel);
  })();

  /* Formulieren met data-mailto: openen het e-mailprogramma met de ingevulde gegevens (niets wordt opgeslagen of verstuurd door de site) */
  document.querySelectorAll('form[data-mailto]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var regels = [], groepen = {};
      f.querySelectorAll('[data-label]').forEach(function (el) {
        var label = el.getAttribute('data-label');
        if (el.type === 'checkbox') { if (el.checked) (groepen[label] = groepen[label] || []).push(el.value === 'on' ? 'ja' : el.value); }
        else if (el.value.trim()) regels.push(label + ': ' + el.value.trim());
      });
      Object.keys(groepen).forEach(function (k) { regels.push(k + ': ' + groepen[k].join(', ')); });
      window.location.href = 'mailto:' + f.getAttribute('data-mailto') + '?subject=' + encodeURIComponent(f.getAttribute('data-onderwerp') || 'Aanmelding') + '&body=' + encodeURIComponent(regels.join('\n'));
    });
  });