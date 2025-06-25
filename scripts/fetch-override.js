// fetch-override.js

import axios from 'axios';

// Salva la fetch originale
const originalFetch = window.fetch;

// Sovrascrivi fetch solo per richieste POST a DeepL (o url specifici)
window.fetch = async function(resource, options) {
  // Controlla se la chiamata è al DeepL API (modifica qui se serve)
  if (typeof resource === 'string' && resource.includes('https://api.deepl.com/v2/translate') && options?.method === 'POST') {
    try {
      // I dati da inviare (supponendo che siano in formato x-www-form-urlencoded)
      // Se usi JSON, adattalo di conseguenza
      const params = new URLSearchParams(options.body);

      // Chiamata al proxy locale, convertendo params in oggetto
      const response = await axios.post('http://127.0.0.1:3010/deepl', Object.fromEntries(params.entries()));

      return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Errore fetch proxy DeepL:', error);
      return Promise.reject(error);
    }
  }

  // Per tutte le altre chiamate, usa fetch originale
  return originalFetch.apply(this, arguments);
};
