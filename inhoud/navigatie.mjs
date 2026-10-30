// Navigatie volgens hoofdstuk 2 van de sitemap: vijf ingangen bovenaan, een footer met vijf kolommen en een onderbalk.
// Een link wordt alleen een link als de pagina bestaat; anders staat er "Binnenkort".

export const hoofdnav = [
  ['Initiatieven', '/initiatieven'],
  ['Hoe het werkt', '/hoe-het-werkt'],
  ['Start een Initiatief', '/starten'],
  ['Sponsoren', '/sponsoren'],
  ['Partners', '/partners'],
];

export const voetkolommen = [
  ['Meedelen', [
    ['Alle Initiatieven', '/initiatieven'],
    ['Zoek je kern', '/kernen'],
    ['Sectoren', '/sectoren'],
    ['Zo deel je mee', '/hoe-het-werkt/meedelen'],
    ['Hoe het geld loopt', '/hoe-het-werkt/geldstromen'],
    ['Een euro blijft een euro', '/hoe-het-werkt/een-euro-blijft-een-euro'],
  ]],
  ['Initiatief starten', [
    ['Kan mijn organisatie starten?', '/starten/check'],
    ['Zo werkt het, in vier stappen', '/starten/zo-werkt-het'],
    ['Voorbeelden per sector', '/starten/voorbeelden'],
    ['Het deelpakket', '/starten/deelpakket'],
    ['Verantwoorden', '/starten/verantwoorden'],
    ['Aanmelden', '/starten/aanmelden'],
  ]],
  ['Sponsoren en Partners', [
    ['Sponsor worden', '/sponsoren'],
    ['Treden en tegenprestatie', '/sponsoren/treden'],
    ['Gemeenten', '/partners#gemeenten'],
    ['Fondsen', '/partners#fondsen'],
    ['Strategische partners', '/partners#strategisch'],
  ]],
  ['Mondéall', [
    ['Missie en kernwaarden', '/over/missie'],
    ['Het verhaal', '/over/verhaal'],
    ['Stichting Mondéall', '/over/stichting'],
    ['Bestuur en governance', '/over/bestuur'],
    ['Cijfers en jaarverslag', '/over/cijfers'],
    ['Waar we staan', '/over/waar-we-staan'],
  ]],
  ['Hulp', [
    ['Veelgestelde vragen', '/hulp'],
    ['Contact', '/contact'],
    ['Iets niet pluis melden', '/melden'],
    ['Klachten', '/klachten'],
  ]],
];

export const onderbalk = [
  ['Sitemap', '/sitemap'],
  ['Voorwaarden', '/voorwaarden'],
  ['Privacy', '/privacy'],
  ['Cookies', '/cookies'],
  ['Toegankelijkheid', '/toegankelijkheid'],
  ['Colofon', '/colofon'],
  ['Pers', '/over/pers'],
];

export const auteursrecht = '© 2026 Stichting Mondéall (in oprichting). Alle rechten voorbehouden.';
