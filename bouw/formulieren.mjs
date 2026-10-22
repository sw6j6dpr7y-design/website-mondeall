// Formulieren die in een tekst kunnen worden gezet met {{formulier: naam}}.
// Tot er een platform is, opent een formulier het e-mailprogramma van de bezoeker met de ingevulde gegevens (zonder tracking, zonder server).
import { sectoren } from '../inhoud/data/sectoren.mjs';
import { EMAIL } from '../inhoud/config.mjs';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const veld = (id, label, opties = {}) => {
  const { type = 'text', verplicht = false, plaats = '', auto = '' } = opties;
  return `<label for="${id}">${esc(label)}${verplicht ? ' *' : ' (optioneel)'}</label>
      <input type="${type}" id="${id}" name="${id}" data-label="${esc(label)}"${verplicht ? ' required' : ''}${plaats ? ' placeholder="' + esc(plaats) + '"' : ''}${auto ? ' autocomplete="' + auto + '"' : ''}>`;
};

export const formulieren = {
  sponsor() {
    const sec = sectoren.map((s) => `<label class="vink"><input type="checkbox" name="sector" value="${esc(s.naam)}" data-label="Sectoren"><span>${esc(s.naam)}</span></label>`).join('\n          ');
    return `<form class="mailformulier" data-mailto="${EMAIL}" data-onderwerp="Aanmelding startgroep Sponsors" aria-labelledby="sponsor-formulier-kop">
      <h2 id="sponsor-formulier-kop">Aanmelden als Sponsor</h2>
      ${veld('s-bedrijf', 'Naam van je onderneming', { verplicht: true, auto: 'organization' })}
      ${veld('s-contact', 'Jouw naam', { verplicht: true, auto: 'name' })}
      ${veld('s-email', 'E-mailadres', { type: 'email', verplicht: true, plaats: 'naam@voorbeeld.nl', auto: 'email' })}
      <p class="veldhulp">We gebruiken dit alleen voor berichten over de startgroep.</p>
      <label for="s-gemeente">Gemeente *</label>
      <select id="s-gemeente" name="s-gemeente" data-label="Gemeente" required><option value="">Kies een gemeente</option><option>Lochem</option><option>Andere gemeente</option></select>
      <p class="veldhulp">Kies de gemeente waar je zichtbaar wilt zijn. Staat jouw gemeente er niet bij, kies Andere gemeente en vul haar naam hieronder in.</p>
      ${veld('s-gemeente-naam', 'Naam van je gemeente (bij Andere gemeente)')}
      <label for="s-trede">Waar heb je belangstelling voor? (optioneel)</label>
      <select id="s-trede" name="s-trede" data-label="Belangstelling"><option value="">Weet ik nog niet</option><option>Vriend, € 50</option><option>Sponsor, € 175</option><option>Hoofdsponsor, € 750</option><option>Maatwerk, vanaf € 2.000</option></select>
      <p class="veldhulp">Per jaar, exclusief btw. Je zit nergens aan vast.</p>
      <label for="s-vraag">Wil je iets kwijt? (optioneel)</label>
      <textarea id="s-vraag" name="s-vraag" rows="4" data-label="Vraag of wens"></textarea>
      <p class="veldhulp">Een vraag of een wens.</p>
      <label class="vink akkoord"><input type="checkbox" required data-label="Toestemming"><span>Ik geef toestemming dat Mondéall mij mailt over de startgroep in mijn gemeente. Ik kan dit altijd intrekken. *</span></label>
      <button type="submit" class="submit-btn">Verstuur per e-mail</button>
      <p class="formulier-uitleg">Dit formulier opent je e-mailprogramma met je gegevens al ingevuld. Je verstuurt het bericht zelf; er wordt niets op de website opgeslagen.</p>
    </form>`;
  },
};
