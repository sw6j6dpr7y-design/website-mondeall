/* Organisatieregister: zoeken, filteren en sorteren in de lijst op de pagina (voorbeeldgegevens) */
(function () {
  var form = document.getElementById('reg-form');
  var lijst = document.getElementById('reg-lijst');
  if (!form || !lijst) return;
  var filters = document.getElementById('reg-filters');
  var q = document.getElementById('reg-q');
  var aantal = document.getElementById('reg-aantal');
  var leeg = document.getElementById('reg-leeg');
  var sort = document.getElementById('reg-sort');
  var kaarten = Array.prototype.slice.call(lijst.querySelectorAll('.reg-kaart'));
  var basis = aantal.innerHTML;

  var param = new URLSearchParams(location.search).get('q');
  if (param) q.value = param;

  function waarde(sel) { var el = document.querySelector(sel); return el ? el.value : ''; }
  function aangevinkt(naam) {
    return Array.prototype.slice.call(filters.querySelectorAll('input[name="' + naam + '"]:checked')).map(function (i) { return i.value; });
  }

  function pas() {
    var zoek = q.value.trim().toLowerCase();
    var cijfers = zoek.replace(/[^0-9]/g, '');
    var soorten = aangevinkt('soort');
    var status = aangevinkt('status')[0] || '';
    var sector = waarde('#reg-sector');
    var anbi = aangevinkt('anbi').length > 0;
    var init = aangevinkt('init').length > 0;
    var kern = waarde('#reg-kern').toLowerCase();
    var gem = waarde('#reg-gem').toLowerCase();
    var n = 0;
    kaarten.forEach(function (k) {
      var d = k.dataset;
      var plaats = 'dorpveld voorbeeld';
      var tekstMatch = !zoek || d.naam.indexOf(zoek) > -1 || plaats.indexOf(zoek) > -1 ||
        (cijfers.length >= 3 && d.nummer.replace(/-/g, '').indexOf(cijfers) > -1);
      var ok = tekstMatch && soorten.indexOf(d.soort) > -1 && (!status || d.status === status) &&
        (!sector || d.sector === sector) && (!anbi || d.anbi === '1') && (!init || d.init === '1') &&
        (!kern || plaats.indexOf(kern) > -1) && (!gem || plaats.indexOf(gem) > -1);
      k.hidden = !ok;
      if (ok) n++;
    });
    var gefilterd = n !== kaarten.length;
    aantal.innerHTML = gefilterd ? '<strong>' + n + (n === 1 ? ' organisatie' : ' organisaties') + '</strong> gevonden' : basis;
    leeg.hidden = n > 0;
  }

  function sorteer() {
    var volgorde = kaarten.slice();
    if (sort.value === 'alfabet') volgorde.sort(function (a, b) { return a.dataset.naam.localeCompare(b.dataset.naam, 'nl'); });
    volgorde.forEach(function (k) { lijst.appendChild(k); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = new URL(location.href);
    if (q.value.trim()) url.searchParams.set('q', q.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    pas();
  });
  q.addEventListener('input', pas);
  filters.addEventListener('change', pas);
  sort.addEventListener('change', sorteer);
  document.getElementById('reg-wis').addEventListener('click', function () {
    filters.querySelectorAll('input[name="soort"]').forEach(function (i) { i.checked = true; });
    filters.querySelectorAll('input[name="anbi"], input[name="init"]').forEach(function (i) { i.checked = false; });
    filters.querySelector('input[name="status"][value=""]').checked = true;
    filters.querySelectorAll('select').forEach(function (s) { s.selectedIndex = 0; });
    q.value = '';
    pas();
  });
  pas();
})();
