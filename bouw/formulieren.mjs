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
      ${veld('s-bedrijf', 'Naam van het bedrijf', { verplicht: true, auto: 'organization' })}
      ${veld('s-contact', 'Contactpersoon', { verplicht: true, auto: 'name' })}
      ${veld('s-email', 'E-mailadres', { type: 'email', verplicht: true, plaats: 'naam@voorbeeld.nl', auto: 'email' })}
      ${veld('s-telefoon', 'Telefoonnummer', { type: 'tel', auto: 'tel' })}
      ${veld('s-gemeente', 'Gemeente waar je Sponsor wilt worden', { verplicht: true, plaats: 'Bijvoorbeeld: Lochem' })}
      ${veld('s-trede', 'Trede of vraag over de treden', { plaats: 'Bijvoorbeeld: welke trede past bij een bedrijf van mijn grootte?' })}
      <fieldset>
        <legend>Sectoren waar je graag aan bijdraagt (optioneel)</legend>
        <div class="vinklijst">
          ${sec}
        </div>
      </fieldset>
      <label class="vink akkoord"><input type="checkbox" required data-label="Privacyverklaring gelezen"><span>Ik heb de <a href="/privacy">privacyverklaring</a> gelezen. Mijn gegevens worden alleen gebruikt om contact op te nemen over deze aanmelding. *</span></label>
      <button type="submit" class="submit-btn">Verstuur per e-mail</button>
      <p class="formulier-uitleg">Dit formulier opent je e-mailprogramma met je gegevens al ingevuld. Je verstuurt het bericht zelf; er wordt niets op de website opgeslagen.</p>
    </form>`;
  },
};
