// Alleen bij het bouwen gebruikt: iconen en sponsormerken voor de Initiatiefpagina
export const INI_ICON = {
  "02": '<path d="M20.8 4.6a5 5 0 0 0-7 0l-1.8 1.8-1.8-1.8a5 5 0 0 0-7 7L12 20l8.8-9a5 5 0 0 0 0-6.4z"/><path d="M12 6.4 8 10l2.5 2.5L14 9"/>',
  "03": '<path d="M8 4h8v3a4 4 0 0 1-8 0z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3"/><path d="M12 11v4M9 20h6M10 15h4l1 5H9z"/>',
  "04": '<path d="M20.8 5.6a5 5 0 0 0-8.8-1 5 5 0 0 0-8.8 1c-1.2 2.4-.5 5.2 1.6 7.2L12 20l7.2-7.2c2.1-2 2.8-4.8 1.6-7.2z"/>',
  "05": '<circle cx="8" cy="18" r="3"/><path d="M11 18V5l9-2v11"/><circle cx="17" cy="15" r="3"/>',
  "06": '<path d="M12 3c-1.5 3-4 4-4 7a4 4 0 0 0 8 0c0-3-2.5-4-4-7z"/><path d="M12 14v7M8.5 18l3.5 3 3.5-3"/>',
  "07": '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
  "08": '<path d="M3 6.5 12 3l9 3.5L12 10z"/><path d="M6 8v6c0 1.7 2.7 3 6 3s6-1.3 6-3V8"/><path d="M21 6.5V13"/>',
  "12": '<path d="M3 12h4l2-5 3 10 3-7 2 2h4"/>'
};

export const SP_MARK = {
  huis: function (c) { return '<path d="M9 25 24 11l15 14v13H9z" fill="#fff"/><rect x="20" y="28" width="8" height="10" fill="' + c + '"/>'; },
  klank: function (c) { return '<rect x="10" y="25" width="5" height="11" rx="2.5" fill="#fff"/><rect x="18" y="17" width="5" height="19" rx="2.5" fill="#fff"/><rect x="26" y="10" width="5" height="26" rx="2.5" fill="#fff"/><rect x="34" y="20" width="5" height="16" rx="2.5" fill="#fff"/>'; },
  bloem: function (c) { return '<g fill="#fff"><circle cx="24" cy="14" r="6.5"/><circle cx="33.5" cy="21" r="6.5"/><circle cx="30" cy="32.5" r="6.5"/><circle cx="18" cy="32.5" r="6.5"/><circle cx="14.5" cy="21" r="6.5"/></g><circle cx="24" cy="24" r="5" fill="#ffd54a"/>'; },
  wiel: function (c) { return '<circle cx="24" cy="24" r="14" fill="none" stroke="#fff" stroke-width="3"/><path d="M24 12v24M12 24h24M15.5 15.5l17 17M32.5 15.5l-17 17" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="24" r="3" fill="#fff"/>'; },
  blad: function (c) { return '<path d="M11 36C11 20 21 11 37 11c0 15-7 25-23 25z" fill="#fff"/><path d="M14 34 31 17" stroke="' + c + '" stroke-width="2.2" stroke-linecap="round"/>'; },
  kruis: function (c) { return '<path d="M20 10h8v10h10v8H28v10h-8V28H10v-8h10z" fill="#fff"/>'; },
  moer: function (c) { return '<path d="M24 8l14 8v16l-14 8-14-8V16z" fill="#fff"/><circle cx="24" cy="24" r="6" fill="' + c + '"/>'; },
  zon: function (c) { return '<circle cx="24" cy="24" r="8" fill="#fff"/><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M11.3 36.7l3.5-3.5M33.2 14.8l3.5-3.5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'; }
};
