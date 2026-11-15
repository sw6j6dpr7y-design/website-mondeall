// Organisatieregister: voorbeeldgegevens uit de mock-up van 15-11-2026 (artifact "Mock-up organisatieregister mondeall.nl").
// Alle namen, nummers en gegevens zijn fictief. De echte gegevens komen pas na de oprichting van Stichting Mondéall en de privacytoets.
// status: open = uit openbare bronnen, aan = aangemeld, beg = Begunstigde.

export const REG_KERN = { naam: 'Dorpveld', gemeente: 'Voorbeeld', url: '/organisaties/voorbeeld/dorpveld' };

export const REG_STATUS = {
  open: 'Uit openbare bronnen',
  aan: 'Aangemeld',
  beg: 'Begunstigde',
};

export const REG_ORGS = [
  { naam: 'Voetbalvereniging Dorpveld ’28', nummer: '482-173-605', soort: 'Vereniging', sector: '03', anbi: false, status: 'beg', init: true, pagina: true },
  { naam: 'Muziekvereniging Eendracht Dorpveld', nummer: '731-904-218', soort: 'Vereniging', sector: '05', anbi: false, status: 'aan', init: false },
  { naam: 'Stichting Dorpshuis De Brink', nummer: '265-480-937', soort: 'Stichting', sector: '11', anbi: true, status: 'beg', init: false },
  { naam: 'Basisschool De Vlinderhof', nummer: '590-316-742', soort: 'School', sector: '08', anbi: false, status: 'open', init: false },
  { naam: 'Protestantse Gemeente Dorpveld', nummer: '148-627-359', soort: 'Kerkgenootschap', sector: '10', anbi: true, status: 'open', init: false },
  { naam: 'Stichting Natuurbeheer Dorpveldse Weide', nummer: '873-052-461', soort: 'Stichting', sector: '06', anbi: true, status: 'aan', init: true },
];

// Gegevens van de organisatiepagina, met bron en peildatum per gegeven
export const REG_DETAIL = {
  '482-173-605': {
    initiatief: { titel: 'Lichtmasten voor het trainingsveld', looptijd: 'Loopt nog 12 van de 21 dagen.' },
    opgericht: 1928,
    lustrum: 'Het eerstvolgende lustrum is in <strong>2028</strong>, als de vereniging 100 jaar bestaat.',
    gegevens: [
      ['Organisatienummer', '482-173-605', 'Organisatieregister · sinds 12-11-2026'],
      ['Soort en rechtsvorm', 'Vereniging met volledige rechtsbevoegdheid', 'KvK Handelsregister · 10-11-2026'],
      ['KvK-nummer', '12345678', 'KvK Handelsregister · 10-11-2026'],
      ['RSIN', '001234567', 'KvK Handelsregister · 10-11-2026'],
      ['Plaats', 'Dorpveld, gemeente Voorbeeld', 'Kernenregister · 10-11-2026'],
      ['Sector', '03 Sport & Recreatie', 'Door de organisatie gekozen, getoetst · 14-11-2026'],
      ['Website', 'www.vvdorpveld.example', 'Eigen website · 10-11-2026'],
      ['ANBI', 'Nee', 'ANBI-register Belastingdienst · 09-11-2026'],
      ['Bondslidmaatschap', 'KNVB', 'Clublijst van de bond · 08-11-2026'],
      ['Oprichtingsjaar', '1928', 'Extractieprotocol, geverifieerd · 08-11-2026'],
      ['Status', 'Begunstigde', 'Toegelaten · 14-11-2026'],
    ],
  },
};

export const regOrgUrl = (o) => '/organisaties/' + o.nummer;
