// Eén plek voor het domein en de vaste gegevens van de site.
// mondeall.nl is het hoofdadres (canoniek). Staat het adres in het deelbeeld, dan moet dat beeld mee veranderen.
export const DOMEIN = 'https://mondeall.nl';
export const NAAM = 'Mondéall';
export const BASISTITEL = 'Mondéall: deel geld met een goed gevoel';
export const BESCHRIJVING = 'Mondéall maakt het mogelijk om altijd met een goed gevoel volwaardig geld te delen. 100% komt aan, Sponsors dragen de kosten.';
export const DEELBEELD = '/assets/deelbeeld.png';
export const EMAIL = 'info@mondeall.eu';

// Statusregel boven pagina's die dat vragen (frontmatter: statusregel: ja). Pas aan op wat bij publicatie waar is; haal de regel weg bij livegang.
export const STATUSREGEL = 'Mondéall is in opbouw. Delen kan nog niet. Zodra de eerste Initiatieven starten, lees je dat hier.';

// De drie /verschil/-pagina's (crowdfunding, doneren, geld inzamelen) staan op noindex en buiten sitemap.xml zolang dit false is.
// Zet op true zodra de statusregel definitief is en de akkoorden er zijn (zie inhoud/open-punten.md).
export const verschilIndexeren = false;
