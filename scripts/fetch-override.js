console.log("[FetchComprehend] Inizializzo override fetch");

// Override fetch per eventuali moduli che usano DeepL via fetch
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

// Intercetta quando axios viene assegnato su window
Object.defineProperty(window, "axios", {
  configurable: true,
  enumerable: true,
  set(value) {
    console.log("[FetchComprehend] axios assegnato, preparo override");
    if (value && typeof value.post === "function") {
      const originalPost = value.post;
      value.post = function(url, data, config) {
        if (url.includes("deepl.com/v2/translate")) {
          console.log("[FetchComprehend] Intercetto axios -> proxy");
          return originalPost.call(this, "http://localhost:3010/deepl", data, config);
        }
        return originalPost.call(this, url, data, config);
      };
      console.log("[FetchComprehend] Override axios.post attivato dinamicamente");
    }
    this._axios = value;
  },
  get() {
    return this._axios;
  }
});
