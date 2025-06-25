(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;

    if (url.includes("deepl.com")) {
      console.log("✅ [fetch-override] Intercettata richiesta DeepL:", url);

      const params = new URLSearchParams(new URL(url).search);
      const body = {};
      for (const [key, value] of params.entries()) {
        body[key] = value;
      }

      return originalFetch("http://127.0.0.1:3010/deepl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    }

    return originalFetch(input, init);
  };

  console.log("🟢 [fetch-override] Attivo e in ascolto.");
})();
