# Teksten van mondeall.eu

Elke pagina die een tekst nodig heeft, krijgt een bestand in deze map. De bestandsnaam bepaalt het adres:

| Bestand | Adres |
|---|---|
| `sponsoren.md` | `/sponsoren` |
| `sponsoren/treden.md` | `/sponsoren/treden` |
| `over/bestuur.md` | `/over/bestuur` |

Een nieuw bestand maakt een nieuwe pagina. Een pagina wordt pas een link in het menu of de footer als hij in `inhoud/navigatie.mjs` staat.

## Bovenaan elk bestand

```
---
titel: Treden en tegenprestatie
beschrijving: Eén zin voor zoekmachines en deelkaarten (maximaal 160 tekens).
status: plaatshouder
---
```

`status` bepaalt wat bezoekers zien:

- `plaatshouder`: de tekst wordt niet getoond. De pagina zegt "Deze pagina wordt nog uitgewerkt" en staat op noindex.
- `concept`: de tekst wordt getoond met de melding dat hij nog niet definitief is. Nog steeds noindex.
- `klaar`: de tekst staat openbaar en mag door zoekmachines worden gevonden.

Zet een pagina pas op `klaar` als de tekst is goedgekeurd en niets beschrijft wat nog niet bestaat.

## Schrijven

De titel van de pagina komt uit `titel`; schrijf zelf geen `h1`. Je kunt gebruiken:

- `# Kop` (grote tussenkop), `## Kop` (kleinere), `### Kop` (kleinst)
- gewone alinea's, gescheiden door een lege regel
- lijsten met `- ` of `1. `
- `**vet**` en `*cursief*`
- `[tekst](/adres)` voor een link naar een pagina op de site, of `[tekst](https://...)` naar een andere site
- een citaat met `> `
- een tabel met `| kolom | kolom |`, een regel `|---|---|` en daarna de rijen
- een streep met `---`

Ruwe HTML werkt niet. Opmerkingen voor jezelf staan tussen `<!--` en `-->` en zijn op de site niet te zien.

## Blokken

Zet een blok op een eigen regel:

- `{{knop: /sponsoren/aanmelden | Aanmelden als Sponsor}}` een knop naar een pagina
- `{{formulier: sponsor}}` het aanmeldformulier voor Sponsors (opent het e-mailprogramma)
- `{{sponsorvoorbeeld}}` voorbeelden van hoe een Sponsor bij een Initiatief staat (fictieve bedrijven, als Voorbeeld gemarkeerd)
- `{{subpaginas}}` een lijst met de pagina's eronder

## Afspraken voor de tekst

- Nederlands, taalniveau B1, jij en jullie.
- Gebruik de vaste termen: Initiatief, Kern, Sector, Begunstigde, Starter, Geld Deler, Sponsor, Partner, Voorziening. Nooit donateur, klant, gebruiker of goed doel.
- Geen streepjes (– of —) in lopende tekst.
- Geen doelbedragen, voortgangsbalken, tellers of urgentietaal.
- Noem niets als bestaand of werkend dat dat nog niet is. Fictieve gegevens zijn altijd als Voorbeeld gemarkeerd.
- Noem LustrumMoment nergens. Stichting Naberschap alleen op `/over/stelsel`, met één zin.
- Bedragen en voorwaarden alleen overnemen uit goedgekeurde bronnen (Sponsorovereenkomst, Stelselherziening). Twijfel je, zet dan een opmerking tussen `<!--` en `-->` en laat de status op `plaatshouder`.

## Wat ik daarna doe

Claude Code bouwt de site (`node bouw/bouw.mjs`), controleert de pagina's en publiceert ze. Het volstaat om de bestanden hier aan te passen.
