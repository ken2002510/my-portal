// ===== Exchange Rate API Module =====

const CACHE_KEY = 'portaly_exchange_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Fallback static rates (approximate, used when API fails)
const FALLBACK_RATES = {
  USD: 30.8,
  JPY: 0.21,
  EUR: 33.5,
  KRW: 0.023,
  GBP: 38.9,
  AUD: 20.1,
  CAD: 22.5,
  CNY: 4.25,
  HKD: 3.95,
  SGD: 23.1
};

// Currency display info
export const CURRENCY_INFO = {
  USD: { name: '美元', flag: '🇺🇸', symbol: '$' },
  JPY: { name: '日圓', flag: '🇯🇵', symbol: '¥' },
  EUR: { name: '歐元', flag: '🇪🇺', symbol: '€' },
  KRW: { name: '韓元', flag: '🇰🇷', symbol: '₩' },
  GBP: { name: '英鎊', flag: '🇬🇧', symbol: '£' },
  AUD: { name: '澳幣', flag: '🇦🇺', symbol: '$' },
  CAD: { name: '加幣', flag: '🇨🇦', symbol: '$' },
  CNY: { name: '人民幣', flag: '🇨🇳', symbol: '¥' },
  HKD: { name: '港幣', flag: '🇭🇰', symbol: '$' },
  SGD: { name: '新幣', flag: '🇸🇬', symbol: '$' },
  TWD: { name: '台幣', flag: '🇹🇼', symbol: 'NT$' }
};

function getCachedRates() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return rates;
      }
    }
  } catch (e) {
    // ignore cache errors
  }
  return null;
}

function setCachedRates(rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now()
    }));
  } catch (e) {
    // ignore cache errors
  }
}

/**
 * Fetch exchange rates for given currencies vs TWD
 * Returns an object: { USD: 30.8, JPY: 0.21, ... }
 */
export async function fetchExchangeRates(currencies = ['USD', 'JPY', 'EUR', 'KRW']) {
  // Check cache first
  const cached = getCachedRates();
  if (cached) {
    const result = {};
    for (const c of currencies) {
      if (cached[c] !== undefined) {
        result[c] = cached[c];
      }
    }
    if (Object.keys(result).length === currencies.length) {
      return { rates: result, fromCache: true, lastUpdate: getLastUpdateTime() };
    }
  }

  try {
    // Use the free ExchangeRate-API (no key needed)
    const res = await fetch('https://open.er-api.com/v6/latest/TWD');
    if (!res.ok) throw new Error('API response not ok');
    
    const data = await res.json();
    
    if (data.result === 'success' && data.rates) {
      // data.rates gives how many units of foreign currency per 1 TWD
      // We want: 1 foreign currency = X TWD
      const allRates = {};
      for (const [currency, rate] of Object.entries(data.rates)) {
        if (rate > 0) {
          allRates[currency] = parseFloat((1 / rate).toFixed(4));
        }
      }
      
      setCachedRates(allRates);
      
      const result = {};
      for (const c of currencies) {
        result[c] = allRates[c] || FALLBACK_RATES[c] || 0;
      }
      
      return { rates: result, fromCache: false, lastUpdate: new Date().toLocaleString('zh-TW') };
    }
    
    throw new Error('Invalid API response');
  } catch (err) {
    console.warn('Exchange rate API failed, using fallback:', err);
    const result = {};
    for (const c of currencies) {
      result[c] = FALLBACK_RATES[c] || 0;
    }
    return { rates: result, fromCache: false, lastUpdate: '使用參考匯率', error: true };
  }
}

function getLastUpdateTime() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp } = JSON.parse(cached);
      return new Date(timestamp).toLocaleString('zh-TW');
    }
  } catch (e) {
    // ignore
  }
  return '';
}
