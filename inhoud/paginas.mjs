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

  // Tekst: mockup Zo deel je mee (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/hoe-het-werkt/meedelen', titel: 'Zo deel je mee', beschrijving: 'Deel vanaf één euro mee met een Initiatief in je buurt. Je kiest je bedrag en of je naam laat zien. Elke euro komt aan, omdat Sponsors de kosten dragen.', stukken: ['meedelen'], fase: 'I' },

  // Tekst: mockup Hoe het geld loopt (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/hoe-het-werkt/geldstromen', titel: 'Hoe het geld loopt', beschrijving: 'Op Mondéall lopen twee geldstromen gescheiden. Een gift gaat rechtstreeks naar de Begunstigde. Sponsors dragen de kosten van het platform.', stukken: ['geldstromen'], fase: 'I' },

  // Tekst: mockup Het deelpakket (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/starten/deelpakket', titel: 'Het deelpakket', beschrijving: 'Een gratis deelknop voor je website, het klavertje voor je menu en een poster voor de kantine. Zo laat je zien dat jouw organisatie meedoet.', stukken: ['deelpakket'], scripts: ['deelpakket'], fase: 'I' },

  // Tekst: mockup Verantwoorden (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/starten/verantwoorden', titel: 'Verantwoorden', beschrijving: 'Na je Initiatief laat je kort zien wat er is gebeurd. Een bericht, een foto of een korte update, binnen 52 weken na livegang.', stukken: ['verantwoorden'], fase: 'I' },

  // Tekst: mockup Aanmelden (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/starten/aanmelden', titel: 'Aanmelden', beschrijving: 'Begin met je Initiatief. Je hebt alleen de naam van je organisatie, je plaats en een titel nodig.', stukken: ['aanmelden'], scripts: ['aanmelden'], fase: 'I' },

  { url: '/starten', titel: 'Start een Initiatief', beschrijving: 'Zet als vereniging, stichting, school of kerk een Initiatief op Mondéall. Mensen delen mee vanaf € 1 en alles komt bij jullie aan.', stukken: ['starten-landing'], fase: 'I' },
  { url: '/starten/check', titel: 'Kan mijn organisatie starten?', beschrijving: 'Drie vragen om te zien of jouw organisatie een Initiatief kan starten bij Mondéall.', stukken: ['starten'], scripts: ['starten'], fase: 'I' },
  { url: '/starten/zo-werkt-het', titel: 'Zo werkt het, in vier stappen', beschrijving: 'Zo ziet het starten van een Initiatief eruit, in vier stappen.', stukken: ['start-initiatief'], scripts: ['starten'], fase: 'I' },
  { url: '/starten/voorbeelden', titel: 'Voorbeelden per sector', beschrijving: 'Fictieve voorbeelden van Initiatieven in alle twaalf sectoren, zodat je ziet wat er past.', stukken: ['voorbeelden'], fase: 'I' },

  { url: '/over', titel: 'Over Mondéall', beschrijving: 'Missie, verhaal en stelsel van Mondéall.', hub: true, fase: 'I' },
  { url: '/over/missie', titel: 'Missie en kernwaarden', beschrijving: 'De missie en de kernwaarden van Mondéall, en waar we vertrouwen en transparantie voor staan.', stukken: ['wat-is-mondeall', 'vertrouwen'], fase: 'I' },
  // Tekst: mockup Stichting Mondéall (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/over/stichting', titel: 'Stichting Mondéall', beschrijving: 'Stichting Mondéall draagt het platform: exploitatie, merk en missieborging. Zij komt nooit in de giftstroom. Status: in oprichting, vóór de pilot.', stukken: ['stichting'], scripts: ['stichting'], fase: 'I' },
  // Tekst: mockup Bestuur en governance (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/over/bestuur', titel: 'Bestuur en governance', beschrijving: 'Mondéall heeft geen eigenaren en is niet te koop. Lees hoe de borging is bedoeld, wat al vaststaat en wat nog moet worden vastgelegd.', stukken: ['bestuur'], fase: 'I' },
  // Tekst: mockup Cijfers en jaarverslag (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/over/cijfers', titel: 'Cijfers en jaarverslag', beschrijving: 'Alle geldstromen van Mondéall zijn transparant. Hier lees je straks wat er is gebeurd, zonder ranglijsten en zonder tracking.', stukken: ['cijfers'], fase: 'I' },
  // Tekst: mockup Waar we staan (Artifact, 30-10-2026). Statuspagina met datum: bijhouden. Open punten staan in inhoud/open-punten.md.
  { url: '/over/waar-we-staan', titel: 'Waar we staan', beschrijving: 'Wat er nu is, wat er nog niet kan en in welke volgorde Mondéall wordt gebouwd. Stand per 30 oktober 2026.', stukken: ['waar-we-staan'], fase: 'I' },
  // Tekst: mockup Iets niet pluis melden (Artifact, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/melden', titel: 'Iets niet pluis melden', beschrijving: 'Klopt een Initiatief niet, of staat er iets op wat er niet hoort? Meld het. Je hebt er geen account voor nodig.', stukken: ['melden'], scripts: ['melden'], fase: 'I' },
  // Tekst: mockup Klachtenregeling (Artifact, 30-10-2026), op basis van concept v0.1. Open punten staan in inhoud/open-punten.md.
  { url: '/klachten', titel: 'Klachtenregeling', beschrijving: 'Zo gaat Stichting Mondéall met klachten om: hoe je klaagt, wat we binnen welke tijd doen en wie een tweede keer meekijkt. De regeling is in voorbereiding.', stukken: ['klachten'], fase: 'I' },
  // Tekst: mockup Toegankelijkheid (Artifact, 30-10-2026). Statuspagina met datum: bijhouden. Open punten staan in inhoud/open-punten.md.
  { url: '/toegankelijkheid', titel: 'Toegankelijkheid', beschrijving: 'Mondéall is er voor iedereen. Lees waar we naar streven, hoe we de site ontwerpen en wat nog niet is getoetst.', stukken: ['toegankelijkheid'], fase: 'I' },
  // Tekst: mockup Pers (Artifact, 30-10-2026). Statuspagina met datum: bijhouden. Open punten staan in inhoud/open-punten.md.
  { url: '/over/pers', titel: 'Pers', beschrijving: 'Schrijf je over Mondéall? Lees hoe wij ons noemen, wat al vaststaat en hoe je ons bereikt.', stukken: ['pers'], scripts: ['pers'], fase: 'I' },
  // Tekst: mockup Foto's insturen (Fotobrief v0.1 Deel A, 30-10-2026). Open punten staan in inhoud/open-punten.md.
  { url: '/foto-insturen', titel: 'Foto\'s insturen', beschrijving: 'Maak jij foto\'s in je eigen dorp of wijk? Lees wat we zoeken, wat niet kan en hoe je een foto instuurt. Insturen kan nog niet.', stukken: ['foto-insturen'], scripts: ['foto-insturen'], fase: 'I' },
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
  ph('/hoe-het-werkt/wie-kan-ontvangen', 'Wie kan ontvangen'),
  ph('/hoe-het-werkt/spelregels', 'Spelregels'),
  ph('/hoe-het-werkt/veilig-betalen', 'Veilig betalen'),
  ph('/starten/startgids', 'Startgids'),
  ph('/sponsoren/treden', 'Treden en tegenprestatie'),
  ph('/sponsoren/zichtbaarheid', 'Hoe je zichtbaar bent'),
  ph('/sponsoren/ondernemers-vertellen', 'Ondernemer werft ondernemer'),
  ph('/sponsoren/aanmelden', 'Aanmelden als Sponsor'),
  ph('/partners/contact', 'Gesprek aanvragen'),
  ph('/over/jaarverslag', 'Jaarverslag'),
  ph('/hulp', 'Veelgestelde vragen', { hub: true }),
  ph('/hulp/geld-delers', 'Vragen van Geld Delers'),
  ph('/hulp/starters', 'Vragen van Starters'),
  ph('/hulp/sponsoren', 'Vragen van Sponsors'),
  ph('/hulp/partners', 'Vragen van Partners'),
  ph('/voorwaarden/sponsoren', 'Algemene voorwaarden Sponsors'),
  ph('/kernen', 'Zoek je kern'),
];

paginas.push(...plaatshouders);
paginas.push({ url: '/colofon', titel: 'Colofon', beschrijving: 'Wie achter Mondéall zit.', colofon: true, fase: 'I' });
