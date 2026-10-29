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

  { url: '/hoe-het-werkt', titel: 'Hoe het werkt', beschrijving: 'Hoe Mondéall werkt: organisaties plaatsen een Initiatief, inwoners delen mee vanaf € 1 en Sponsors dragen de kosten, zodat alles aankomt.', stukken: ['hoe-het-werkt-landing'], fase: 'I' },

  // Tekst: Webtekst Een euro blijft een euro v1.2 (28-10-2026). noindex tot de interne controle in inhoud/open-punten.md is afgerond.
  { url: '/hoe-het-werkt/een-euro-blijft-een-euro', titel: 'Een euro blijft een euro', titeltag: 'Een euro blijft een euro: wie betaalt de kosten van een gift? · Mondéall', beschrijving: 'Deel je één euro, dan ontvangt het Initiatief één euro. Zo zit het met de kosten van online geven, wie ze betaalt en hoe het elders werkt.', stukken: ['een-euro'], noindex: true, fase: 'I' },

  { url: '/starten', titel: 'Start een Initiatief', beschrijving: 'Zet als vereniging, stichting, school of kerk een Initiatief op Mondéall. Mensen delen mee vanaf € 1 en alles komt bij jullie aan.', stukken: ['starten-landing'], fase: 'I' },
  { url: '/starten/check', titel: 'Kan mijn organisatie starten?', beschrijving: 'Drie vragen om te zien of jouw organisatie een Initiatief kan starten bij Mondéall.', stukken: ['starten'], scripts: ['starten'], fase: 'I' },
  { url: '/starten/zo-werkt-het', titel: 'Zo werkt het, in vier stappen', beschrijving: 'Zo ziet het starten van een Initiatief eruit, in vier stappen.', stukken: ['start-initiatief'], scripts: ['starten'], fase: 'I' },
  { url: '/starten/voorbeelden', titel: 'Voorbeelden per sector', beschrijving: 'Fictieve voorbeelden van Initiatieven in alle twaalf sectoren, zodat je ziet wat er past.', stukken: ['voorbeelden'], fase: 'I' },

  { url: '/over', titel: 'Over Mondéall', beschrijving: 'Missie, verhaal en stelsel van Mondéall.', hub: true, fase: 'I' },
  { url: '/over/missie', titel: 'Missie en kernwaarden', beschrijving: 'De missie en de kernwaarden van Mondéall, en waar we vertrouwen en transparantie voor staan.', stukken: ['wat-is-mondeall', 'vertrouwen'], fase: 'I' },
  { url: '/over/verhaal', titel: 'Het verhaal', beschrijving: 'Waar Mondéall vandaan komt.', stukken: ['verhaal'], fase: 'I' },
  { url: '/over/stelsel', titel: 'Het stelsel', beschrijving: 'Welke organisaties horen bij het stelsel rond Mondéall, en wat elk doet.', stukken: ['stelsel'], fase: 'L' },

  { url: '/sponsoren', titel: 'Word Sponsor', beschrijving: 'Als Sponsor draag je de kosten van Mondéall in jouw gemeente. Zo komt elke euro die een inwoner deelt helemaal aan.', stukken: ['sponsor-algemeen'], scripts: ['sponsoren'], fase: 'I' },
  { url: '/sponsoren/lochem', titel: 'Word Sponsor in Lochem', beschrijving: 'Maak geld delen in Lochem gratis. Bekijk de tredes en meld je aan voor de Startgroep van Sponsors.', stukken: ['sponsor-lochem'], scripts: ['sponsoren'], fase: 'I' },

  { url: '/partners', titel: 'Partners', beschrijving: 'Voor gemeenten, fondsen en andere organisaties die lokaal delen mogelijk willen maken.', stukken: ['partners'], fase: 'I' },

  { url: '/contact', titel: 'Contact', beschrijving: 'Blijf op de hoogte van Mondéall of neem contact op.', stukken: ['contact'], fase: 'I' },

  { url: '/inloggen', titel: 'Inloggen', beschrijving: 'Inloggen in de Werkplaats voor Starters (voorbeeld).', werkplaats: 'inloggen', noindex: true, fase: 'L' },
  { url: '/mijn', titel: 'Werkplaats', beschrijving: 'De Werkplaats van de Starter (voorbeeld).', werkplaats: 'werkplaats', noindex: true, fase: 'L' },
  { url: '/starten/nieuw', titel: 'Start een Initiatief', beschrijving: 'Klikbaar voorbeeld van het starten van een Initiatief.', wn: 'snel', noindex: true, fase: 'L' },
  { url: '/werkplaats', titel: 'Werkplaats', beschrijving: 'Klikbaar voorbeeld van de Werkplaats voor Starters.', wn: 'dash', noindex: true, fase: 'L' },
  { url: '/werkplaats/initiatief', titel: 'Werkplaats: Initiatief bewerken', beschrijving: 'Klikbaar voorbeeld van het bewerken van een Initiatief.', wn: 'ini', noindex: true, fase: 'L' },
  { url: '/werkplaats/begunstigden', titel: 'Werkplaats: Begunstigden', beschrijving: 'Klikbaar voorbeeld van de gegevens van de Begunstigde.', wn: 'beg', noindex: true, fase: 'L' },
  { url: '/werkplaats/voorzitter', titel: 'De voorzitter bevestigt', beschrijving: 'Klikbaar voorbeeld van wat de voorzitter van een organisatie te zien krijgt.', wn: 'vz', noindex: true, fase: 'L' },

  { url: '/voorwaarden', titel: 'Algemene voorwaarden', beschrijving: 'De algemene voorwaarden van Mondéall.', juridisch: '<p>Mondéall is nog in opbouw. De algemene voorwaarden worden opgesteld voordat het platform live gaat. Je kunt ze hier lezen voordat je ze hoeft te accepteren.</p>', fase: 'L' },
  { url: '/privacy', titel: 'Privacybeleid', beschrijving: 'Hoe Mondéall met je gegevens omgaat.', juridisch: '<p>Mondéall is nog in opbouw. Wat nu al geldt: je e-mailadres en, als je ze opgeeft, je naam en rol uit het contactformulier gebruiken we uitsluitend om je op de hoogte te houden over Mondéall. Geen tracking, geen doorverkoop van gegevens.</p><p>Het volledige privacybeleid volgt voordat het platform live gaat.</p>', fase: 'I' },
  { url: '/cookies', titel: 'Gebruik van cookies', beschrijving: 'Welke cookies Mondéall gebruikt.', juridisch: '<p>Deze website plaatst geen tracking- of advertentiecookies. Voor het inloggen in de Werkplaats is straks alleen een functionele cookie voor je inlogsessie nodig.</p>', fase: 'I' },
];

export const tekstVolgtZin = tekstVolgt;

// Pagina's die uit de gegevens komen, met hetzelfde formaat als hierboven (voor kruimels en sitemap)
export function afgeleidePaginas() {
  const lijst = [];
  for (const s of sectoren) lijst.push({ url: sectorPad(s), titel: s.nr + ' ' + s.naam, beschrijving: s.toelichting, fase: 'I', sector: s });
  for (const d of INI_DATA) lijst.push({ url: '/initiatieven/' + d.slug, titel: d.titel, beschrijving: d.vz, fase: 'L', initiatief: d, noindex: !!d.voorbeeld });
  return lijst;
}

// Pagina's uit de sitemap waarvan de tekst nog ontbreekt: zichtbare plaatshouders, noindex en niet in sitemap.xml.
// (Regel uit de sitemap: zonder teksten blijft een pagina een plaatshouder, nooit een verzonnen tekst.)
const ph = (url, titel, extra = {}) => ({ url, titel, beschrijving: titel + '. Deze pagina wordt nog uitgewerkt.', plaatshouder: true, noindex: true, fase: 'B', ...extra });
export const plaatshouders = [
  ph('/hoe-het-werkt/meedelen', 'Zo deel je mee'),
  ph('/hoe-het-werkt/geldstromen', 'Hoe het geld loopt'),
  ph('/hoe-het-werkt/wie-kan-ontvangen', 'Wie kan ontvangen'),
  ph('/hoe-het-werkt/spelregels', 'Spelregels'),
  ph('/hoe-het-werkt/veilig-betalen', 'Veilig betalen'),
  ph('/starten/deelpakket', 'Het deelpakket'),
  ph('/starten/verantwoorden', 'Verantwoorden'),
  ph('/starten/startgids', 'Startgids'),
  ph('/starten/aanmelden', 'Aanmelden'),
  ph('/sponsoren/treden', 'Treden en tegenprestatie'),
  ph('/sponsoren/zichtbaarheid', 'Hoe je zichtbaar bent'),
  ph('/sponsoren/ondernemers-vertellen', 'Ondernemer werft ondernemer'),
  ph('/sponsoren/aanmelden', 'Aanmelden als Sponsor'),
  ph('/partners/contact', 'Gesprek aanvragen'),
  ph('/over/stichting', 'Stichting Mondéall'),
  ph('/over/bestuur', 'Bestuur en governance'),
  ph('/over/cijfers', 'Cijfers'),
  ph('/over/jaarverslag', 'Jaarverslag'),
  ph('/over/waar-we-staan', 'Waar we staan'),
  ph('/over/pers', 'Pers'),
  ph('/hulp', 'Veelgestelde vragen', { hub: true }),
  ph('/hulp/geld-delers', 'Vragen van Geld Delers'),
  ph('/hulp/starters', 'Vragen van Starters'),
  ph('/hulp/sponsoren', 'Vragen van Sponsors'),
  ph('/hulp/partners', 'Vragen van Partners'),
  ph('/melden', 'Iets niet pluis'),
  ph('/klachten', 'Klachtenregeling'),
  ph('/voorwaarden/sponsoren', 'Algemene voorwaarden Sponsors'),
  ph('/toegankelijkheid', 'Toegankelijkheid'),
  ph('/kernen', 'Zoek je kern'),
];

paginas.push(...plaatshouders);
paginas.push({ url: '/colofon', titel: 'Colofon', beschrijving: 'Wie achter Mondéall zit.', colofon: true, fase: 'I' });
