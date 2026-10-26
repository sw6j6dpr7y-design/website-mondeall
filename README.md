# Website mondeall.nl

Hoofdadres is mondeall.nl. mondeall.eu wijst naar dezelfde site; de canonieke adressen in de pagina's en de sitemap verwijzen naar mondeall.nl.

De site wordt gebouwd met een klein bouwscript zonder externe pakketten (Node.js 20 of hoger).

- `inhoud/paginas.mjs`: de paginabron. Eén lijst voedt de pagina's, de kruimels, `/sitemap` en `/sitemap.xml`.
- `inhoud/teksten/`: de teksten van de pagina's als Markdown (zie het README-bestand in die map). Hier vult Cowork de inhoud in.
- `inhoud/config.mjs`: het domein en vaste gegevens op één plek.
- `inhoud/data/`: gegevens (sectoren, voorbeeld-Initiatieven, kernen).
- `inhoud/fragmenten/` en `inhoud/sjabloon/`: de HTML-stukken van de pagina's, het lint en de footer.
- `assets/`: stijl (`site.css`), scripts (`js/`), foto's en iconen.
- `bouw/bouw.mjs`: maakt `dist/`. Vercel draait `node bouw/bouw.mjs` bij elke wijziging (zie `vercel.json`).

Lokaal bekijken:

```
node bouw/bouw.mjs
node bouw/serveer.mjs
```

Dan staat de site op http://localhost:8791.
