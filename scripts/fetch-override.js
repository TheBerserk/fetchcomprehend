// fetch-override.js

const originalFetch = window.fetch;

window.fetch = async function(resource, options) {
  if (typeof resource === 'string' &&
      resource.includes('https://api.deepl.com/v2/translate') &&
      options?.method === 'POST') {
    try {
      // Converti la body urlencoded in oggetto JSON
      const params = new URLSearchParams(options.body);
      const jsonBody = Object.fromEntries(params.entries());

      // Invia la richiesta POST al proxy con JSON
      const response = await originalFetch("http://127.0.0.1:3010/deepl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody)
      });

      const data = await response.json();

      // Ricrea la Response compatibile con fetch
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("Errore fetch proxy DeepL:", error);
      return Promise.reject(error);
    }
  }

  // Per tutte le altre chiamate usa fetch originale
  return originalFetch.apply(this, arguments);
};
