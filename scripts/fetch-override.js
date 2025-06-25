// fetch-override.js

(() => {
  const originalFetch = window.fetch;

  window.fetch = async function(resource, options) {
    if (typeof resource === 'string' &&
        resource.includes('https://api.deepl.com/v2/translate') &&
        options?.method === 'POST') {
      try {
        const params = new URLSearchParams(options.body);
        const jsonBody = Object.fromEntries(params.entries());

        const response = await originalFetch("http://127.0.0.1:3010/deepl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonBody)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Errore fetch proxy DeepL:", error);
        return Promise.reject(error);
      }
    }

    return originalFetch.apply(this, arguments);
  };
})();
