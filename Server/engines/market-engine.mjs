// =============================================================
// BEAST GALAXY – MARKET DATA ENGINE
// STEP 10
// =============================================================

import fetch from "node-fetch";

let CACHE = {
  time: 0,
  data: null
};

export async function getMarketData() {
  const now = Date.now();

  // Cache for 30 seconds
  if (CACHE.data && now - CACHE.time < 30000) {
    return CACHE.data;
  }

  try {
    // Public Yahoo Finance endpoints (lightweight)
    const [nifty, sensex, bank] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ENSEI"),
      fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EBSESN"),
      fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ENSEBANK")
    ]);

    const parse = async r => (await r.json()).quoteResponse.result[0];

    const data = {
      NIFTY: await parse(nifty),
      SENSEX: await parse(sensex),
      BANKNIFTY: await parse(bank)
    };

    CACHE = { time: now, data };
    return data;

  } catch (e) {
    // Safe fallback (never breaks dashboard)
    return {
      NIFTY: { regularMarketChangePercent: 0 },
      SENSEX: { regularMarketChangePercent: 0 },
      BANKNIFTY: { regularMarketChangePercent: 0 }
    };
  }
}
