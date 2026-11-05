/* Doelgroeptags (bron: Mondeall_doelgroeptags_v1_2_20261105.xlsx, alle 15 Actief).
   Een tag is geen sector: een Initiatief heeft 1 aandachtsgebied en 0 of meer tags.
   Een Initiatief zonder tag blijft in elk filterresultaat zichtbaar en geldt als "voor iedereen". */
export const DOELGROEPEN = [
  { id: 'kinderen', naam: 'Kinderen', omschrijving: 'Tot en met de basisschool (circa 0 t/m 12 jaar)' },
  { id: 'jongeren', naam: 'Jongeren', omschrijving: 'Vanaf het voortgezet onderwijs (circa 13 t/m 25 jaar)' },
  { id: 'studenten', naam: 'Studenten', omschrijving: 'MBO, HBO en WO' },
  { id: 'ouderen', naam: 'Ouderen', omschrijving: '65 jaar en ouder' },
  { id: 'beperking', naam: 'Mensen met een beperking', omschrijving: 'Fysiek, verstandelijk of zintuiglijk' },
  { id: 'nieuwkomers', naam: 'Vluchtelingen & nieuwkomers', omschrijving: 'Nationaal en internationaal' },
  { id: 'daklozen', naam: 'Dak- en thuislozen', omschrijving: 'Mensen zonder eigen woonruimte of vaste verblijfplaats, ook wie tijdelijk bij anderen verblijft of in een opvang slaapt' },
  { id: 'vrouwen', naam: 'Vrouwen', omschrijving: 'Vrouwen en meisjes' },
  { id: 'mannen', naam: 'Mannen', omschrijving: 'Mannen en jongens' },
  { id: 'lhbtiq', naam: 'LHBTIQ+', omschrijving: 'Lesbische, homoseksuele, biseksuele, transgender, interseksuele en queer personen, en anderen binnen dit spectrum' },
  { id: 'zieken', naam: 'Zieken & patiënten', omschrijving: 'Inclusief chronisch zieken, psychiatrische kwetsbaarheid en verslaving' },
  { id: 'gezinnen', naam: 'Gezinnen', omschrijving: 'Inclusief eenoudergezinnen' },
  { id: 'mantelzorgers', naam: 'Mantelzorgers', omschrijving: 'Mensen die langdurig en onbetaald zorgen voor een naaste met een ziekte, beperking of verslaving, ook jonge mantelzorgers' },
  { id: 'inheems', naam: 'Inheemse volken', omschrijving: 'Vooral sector Internationale Hulp & Mensenrechten' },
  { id: 'veteranen', naam: 'Militairen & veteranen', omschrijving: 'Actief dienende en voormalige militairen, en hun naasten en nabestaanden' }
];

/* Tags per voorbeeld-Initiatief. Geen vermelding = voor iedereen. */
export const DOELGROEP_PER_INITIATIEF = {
  'waterput-partnerdorp': ['kinderen', 'gezinnen'],
  'koelcellen-voedselbank': ['gezinnen'],
  'aangepast-sportmateriaal-laren': ['beperking'],
  'duofiets-zorgcentrum-gorssel': ['ouderen', 'beperking'],
  'weerstation-schoolplein-joppe': ['kinderen'],
  'digitale-vaardigheden-harfsen': ['ouderen'],
  'muurschildering-lochem': ['jongeren'],
  'renovatie-kleedkamers-sv-laren': ['jongeren'],
  'instrumentenfonds-concordia': ['jongeren'],
  'ontmoetingscafe-dementie-gorssel': ['ouderen', 'zieken', 'mantelzorgers'],
  'verkeerseducatie-eefde': ['kinderen'],
  'schoolbibliotheek-de-regenboog': ['kinderen'],
  'toegankelijke-kerkingang-barchem': ['beperking', 'ouderen'],
  'netten-klavertje': ['jongeren']
};
