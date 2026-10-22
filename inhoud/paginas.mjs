// De paginabron: één lijst die het menu-pad (kruimels), /sitemap, /sitemap.xml en de pagina's zelf voedt.
// Per pagina: url, titel, beschrijving en uit welke stukken (fragmenten) de pagina bestaat.
// fase volgens de sitemap: B = gebouwd, I = informatief openbaar, L = live na oprichting en Mollie.
import { sectoren } from './data/sectoren.mjs';
import { INI_DATA } from './data/initiatieven.mjs';

export const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const sectorPad = (s) => '/sectoren/' + s.nr + '-' + slugify(s.naam);

const tekstVolgt = 'Deze pagina wordt nog uitgewerkt.';

export const paginas = [
  { url: '/', titel: 'Home', titelTag: null, beschrijving: 'Mondéall maakt het mogelijk om altijd met een goed gevoel volwaardig geld te delen. 100% komt aan, Sponsors dragen de kosten.', hero: true, stukken: ['initiatieven', 'start-initiatief', 'contact'], scripts: ['initiatieven', 'starten'], fase: 'I' },

  { url: '/initiatieven', titel: 'Alle Initiatieven', beschrijving: 'Zoek een Initiatief in jouw dorp of wijk, filter op Kern, sector, soort Begunstigde en status.', stukken: ['initiatieven'], scripts: ['initiatieven'], fase: 'L' },
  // /initiatieven/[slug] wordt gemaakt uit de gegevens (zie bouw.mjs)

  { url: '/sectoren', titel: 'De twaalf sectoren', beschrijving: 'Elk Initiatief valt binnen één van de twaalf sectoren. Bekijk de aandachtsgebieden per sector.', stukken: ['sectoren', 'sector-dialog'], scripts: ['sectoren'], fase: 'I' },
  // /sectoren/[code]-[naam] wordt gemaakt uit de gegevens

  { url: '/hoe-het-werkt', titel: 'Hoe het werkt', beschrijving: 'Hoe Mondéall werkt voor Geld Delers, verenigingen en Sponsors.', stukken: ['hoe-het-werkt'], fase: 'I' },

  { url: '/starten', titel: 'Start een Initiatief', beschrijving: 'Wil je als vereniging, stichting, school of kerk een Initiatief starten? Hier begin je.', hub: true, fase: 'I' },
  { url: '/starten/check', titel: 'Kan mijn organisatie starten?', beschrijving: 'Drie vragen om te zien of jouw organisatie een Initiatief kan starten bij Mondéall.', stukken: ['starten'], scripts: ['starten'], fase: 'I' },
  { url: '/starten/zo-werkt-het', titel: 'Zo werkt het, in vier stappen', beschrijving: 'Zo ziet het starten van een Initiatief eruit, in vier stappen.', stukken: ['start-initiatief'], scripts: ['starten'], fase: 'I' },

  { url: '/over', titel: 'Over Mondéall', beschrijving: 'Missie, verhaal en stelsel van Mondéall.', hub: true, fase: 'I' },
  { url: '/over/missie', titel: 'Missie en kernwaarden', beschrijving: 'De missie en de kernwaarden van Mondéall, en waar we vertrouwen en transparantie voor staan.', stukken: ['wat-is-mondeall', 'vertrouwen'], fase: 'I' },
  { url: '/over/verhaal', titel: 'Het verhaal', beschrijving: 'Waar Mondéall vandaan komt.', stukken: ['verhaal'], fase: 'I' },
  { url: '/over/stelsel', titel: 'Het stelsel', beschrijving: 'Welke organisaties horen bij het stelsel rond Mondéall, en wat elk doet.', stukken: ['stelsel'], fase: 'L' },

  { url: '/partners', titel: 'Partners', beschrijving: 'Voor gemeenten, fondsen en andere organisaties die lokaal delen mogelijk willen maken.', hub: true, fase: 'I' },
  { url: '/partners/gemeenten', titel: 'Gemeenten', beschrijving: 'Mondéall is een aanvulling op bestaande subsidies en regelingen, geen vervanging.', stukken: ['gemeenten'], fase: 'I' },

  { url: '/contact', titel: 'Contact', beschrijving: 'Blijf op de hoogte van Mondéall of neem contact op.', stukken: ['contact'], fase: 'I' },

  { url: '/inloggen', titel: 'Inloggen', beschrijving: 'Inloggen in de Werkplaats voor Starters (voorbeeld).', werkplaats: 'inloggen', noindex: true, fase: 'L' },
  { url: '/mijn', titel: 'Werkplaats', beschrijving: 'De Werkplaats van de Starter (voorbeeld).', werkplaats: 'werkplaats', noindex: true, fase: 'L' },

  { url: '/voorwaarden', titel: 'Algemene voorwaarden', beschrijving: 'De algemene voorwaarden van Mondéall.', juridisch: '<p>Mondéall is nog in opbouw. De algemene voorwaarden worden opgesteld voordat het platform live gaat. Je kunt ze hier lezen voordat je ze hoeft te accepteren.</p>', fase: 'L' },
  { url: '/privacy', titel: 'Privacybeleid', beschrijving: 'Hoe Mondéall met je gegevens omgaat.', juridisch: '<p>Mondéall is nog in opbouw. Wat nu al geldt: je e-mailadres en, als je ze opgeeft, je naam en rol uit het contactformulier gebruiken we uitsluitend om je op de hoogte te houden over Mondéall. Geen tracking, geen doorverkoop van gegevens.</p><p>Het volledige privacybeleid volgt voordat het platform live gaat.</p>', fase: 'I' },
  { url: '/cookies', titel: 'Gebruik van cookies', beschrijving: 'Welke cookies Mondéall gebruikt.', juridisch: '<p>Deze website plaatst geen tracking- of advertentiecookies. Voor het inloggen in de Werkplaats is straks alleen een functionele cookie voor je inlogsessie nodig.</p>', fase: 'I' },
];

export const tekstVolgtZin = tekstVolgt;

// Pagina's die uit de gegevens komen, met hetzelfde formaat als hierboven (voor kruimels en sitemap)
export function afgeleidePaginas() {
  const lijst = [];
  for (const s of sectoren) lijst.push({ url: sectorPad(s), titel: s.nr + ' ' + s.naam, beschrijving: s.toelichting, fase: 'I', sector: s });
  for (const d of INI_DATA) lijst.push({ url: '/initiatieven/' + d.slug, titel: d.titel, beschrijving: d.vz, fase: 'L', initiatief: d });
  return lijst;
}
