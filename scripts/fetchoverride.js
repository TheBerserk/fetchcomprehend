(() => {
  console.log("[FetchComprehend] Inizializzo override fetch");

  const originalFetch = window.fetch;

  window.fetch = async function(url, options) {
    if (typeof url === 'string' && url.includes("https://api.deepl.com/v2/translate")) {
      console.log("[FetchComprehend] Redirect fetch DeepL a proxy locale");

      try {
        const body = options?.body ? JSON.parse(options.body) : {};
        return originalFetch("http://localhost:3010/deepl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: body.text,
            target_lang: body.target_lang
          })
        });
      } catch (err) {
        console.error("[FetchComprehend] Errore parsing body:", err);
        return originalFetch(url, options);
      }
    }
    return originalFetch(url, options);
  };

  ui.notifications.info("FetchComprehend attivato");
})();
