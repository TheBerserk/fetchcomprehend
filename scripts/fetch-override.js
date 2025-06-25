console.log("[FetchComprehend] Inizializzo override fetch");

// Override fetch (per altri moduli eventualmente)
const originalFetch = window.fetch;
window.fetch = async function(resource, config = {}) {
  if (typeof resource === "string" && resource.includes("deepl.com/v2/translate")) {
    console.log("[FetchComprehend] Redirect fetch DeepL a proxy locale");

    try {
      const body = config.body;
      let params = new URLSearchParams(body);

      const proxyUrl = "http://localhost:3010/deepl";
      return originalFetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(params.entries()))
      });
    } catch (err) {
      console.error("[FetchComprehend] Errore parsing body:", err);
    }
  }

  return originalFetch(resource, config);
};

// 🔄 Aspetta che axios sia disponibile, poi fai l'override
function waitForAxiosAndOverride(retries = 20) {
  if (window.axios && typeof window.axios.post === "function") {
    const originalPost = window.axios.post;

    window.axios.post = function(url, data, config) {
      if (url.includes("deepl.com/v2/translate")) {
        console.log("[FetchComprehend] Intercetto axios -> proxy");
        return originalPost("http://localhost:3010/deepl", data, config);
      }
      return originalPost(url, data, config);
    };

    console.log("[FetchComprehend] Override axios.post attivato");
  } else if (retries > 0) {
    console.log(`[FetchComprehend] axios non ancora pronto, ritento... (${retries})`);
    setTimeout(() => waitForAxiosAndOverride(retries - 1), 500); // aspetta 500ms
  } else {
    console.warn("[FetchComprehend] axios non disponibile dopo diversi tentativi.");
  }
}

// Inizia a cercare axios quando il gioco è pronto
Hooks.once("ready", () => {
  waitForAxiosAndOverride();
});
