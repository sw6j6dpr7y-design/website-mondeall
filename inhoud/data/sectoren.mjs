import { AFBAKENING } from './aandachtsgebieden.mjs';
// De twaalf sectoren (bron: Sectoren Mondeall v4)
export const sectoren = [
  { nr: "01", naam: "Internationale Hulp & Mensenrechten", hex: "#2e6eb8", toelichting: "Hulp en samenwerking over grenzen heen.", foto: "/assets/fotos/sector-01-internationale-hulp.jpg", credit: "Dalmar Travels / Pexels" },
  { nr: "02", naam: "Sociale Hulp & Ondersteuning", hex: "#d94a3a", toelichting: "Steun voor mensen die het nodig hebben.", foto: "/assets/fotos/sector-02-sociale-hulp.jpg", credit: "Julia M Cameron / Pexels" },
  { nr: "03", naam: "Sport & Recreatie", hex: "#e77123", toelichting: "Verenigingsleven en vrije tijd.", foto: "/assets/fotos/sector-03-sport-recreatie.jpg", credit: "Sam Hofman / Pexels" },
  { nr: "04", naam: "Zorg & Welzijn", hex: "#e4a495", toelichting: "Zorg en welzijn dichtbij huis.", foto: "/assets/fotos/sector-04-zorg-welzijn.jpg", credit: "Jsme Mila / Pexels" },
  { nr: "05", naam: "Kunst & Cultuur", hex: "#813ea3", toelichting: "Creativiteit en cultureel erfgoed.", foto: "/assets/fotos/sector-05-kunst-cultuur.jpg", credit: "Roxanne Minnish / Pexels" },
  { nr: "06", naam: "Dieren & Natuur", hex: "#617e25", toelichting: "Bescherming van dier en natuur.", foto: "/assets/fotos/sector-06-dieren-natuur.jpg", credit: "Vladimir Srajber / Pexels" },
  { nr: "07", naam: "Milieu & Duurzaamheid", hex: "#426827", toelichting: "Een leefbare toekomst voor iedereen.", foto: "/assets/fotos/sector-07-milieu-duurzaamheid.jpg", credit: "Thirdman / Pexels" },
  { nr: "08", naam: "Onderwijs & Educatie", hex: "#e4af44", toelichting: "Kansen door leren en ontwikkelen.", foto: "/assets/fotos/sector-08-onderwijs-educatie.jpg", credit: "Boom / Pexels" },
  { nr: "09", naam: "Wetenschap & Innovatie", hex: "#2e419e", toelichting: "Kennis en vooruitgang delen.", foto: "/assets/fotos/sector-09-wetenschap-innovatie.jpg", credit: "Elif Gökçe / Pexels" },
  { nr: "10", naam: "Religie & Levensbeschouwing", hex: "#69356e", toelichting: "Ruimte voor zingeving en overtuiging.", foto: "/assets/fotos/sector-10-religie-levensbeschouwing.jpg", credit: "Gabby K / Pexels" },
  { nr: "11", naam: "Samenleving & Maatschappij", hex: "#9b3b63", toelichting: "Verbinding binnen de gemeenschap.", foto: "/assets/fotos/sector-11-samenleving-maatschappij.jpg", credit: "Zubair Rafiq / Pexels" },
  { nr: "12", naam: "Gezondheid & Preventie", hex: "#f3cf3f", toelichting: "Gezond blijven en gezond worden.", foto: "/assets/fotos/sector-12-gezondheid-preventie.jpg", credit: "Tima Miroshnichenko / Pexels" }
];

// Namen van de aandachtsgebieden per sector, uit de afbakening voor de Starter.
export const AANDACHT = Object.fromEntries(Object.entries(AFBAKENING).map(([nr, lijst]) => [nr, lijst.map((a) => a.naam)]));
