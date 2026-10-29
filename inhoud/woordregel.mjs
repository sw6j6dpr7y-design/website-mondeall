// De woordregel van Mondéall, op één plek. bouw/woordcontrole.mjs leest deze lijst en doorzoekt de gebouwde pagina's.
// Elke term is een stukje van een reguliere expressie (hele woorden, hoofdletterongevoelig) zodat ook vervoegingen en meervouden gevonden worden.
//
// soort:
//   'fout'    verboden. Met --streng faalt de controle.
//   'waarschuwing'  melden, maar geen fout.
// toegestaanOp: adressen (beginnen met) waar de term wel mag staan. Leeg of weggelaten: nergens toegestaan.
// hoofdlettergevoelig: alleen voor termen waar de schrijfwijze zelf de regel is.
// alleenZichtbaar: alleen in zichtbare tekst zoeken, niet in title, meta of alt (bijvoorbeeld voor de schrijfwijze van de merknaam).

export const VERSCHIL = ['/verschil/'];

export const termen = [
  // Verboden overal
  { naam: 'donateur', patroon: 'donateurs?', soort: 'fout' },
  { naam: 'donatie', patroon: 'donaties?', soort: 'fout' },
  { naam: 'schenking', patroon: 'schenkingen?', soort: 'fout' },
  { naam: 'collecteren', patroon: 'collect(?:e|es|eren|eert|eerde|eerden|ant|anten)', soort: 'fout' },
  { naam: 'goed doel', patroon: 'goede? doelen?', soort: 'fout' },
  { naam: 'klant', patroon: 'klanten?', soort: 'fout' },
  { naam: 'gebruiker', patroon: 'gebruikers?', soort: 'fout' },
  { naam: 'Drager', patroon: 'dragers?', soort: 'fout' },
  { naam: 'Supporter', patroon: 'supporters?', soort: 'fout' },
  // Jubileum alleen waar het als merkterm staat: de context wordt meegegeven, de beoordeling is aan jou.
  { naam: 'jubileum', patroon: 'jubilea|jubileums?|jubileumstichting', soort: 'fout', opmerking: 'alleen als merkterm een fout; beoordeel de context' },

  // Verboden buiten /verschil/
  { naam: 'crowdfunding', patroon: 'crowdfund(?:ing|ingplatforms?|en|t|de|den|ed)?', soort: 'fout', toegestaanOp: VERSCHIL },
  { naam: 'doneren', patroon: 'doneer(?:t|de|den)?|doneren|gedoneerd', soort: 'fout', toegestaanOp: VERSCHIL },
  { naam: 'geld inzamelen', patroon: 'geld\\s+(?:in)?(?:zamel|zamelt|zamelen|gezameld|zamelde|zamelden)|geld\\s+ingezameld', soort: 'fout', toegestaanOp: VERSCHIL },

  // Waarschuwingen
  { naam: 'inzamelingsactie', patroon: 'inzamelingsacties?', soort: 'waarschuwing' },
  { naam: 'inzamelen', patroon: 'inzamel(?:en|t|de|den)|ingezameld', soort: 'waarschuwing' },
  { naam: 'Mondeall zonder accent', patroon: '(?<![@/.\\p{L}\\d-])Mondeall(?![\\p{L}\\d-]|\\.(?:nl|eu|com))', soort: 'waarschuwing', hoofdlettergevoelig: true, alleenZichtbaar: true },
];
