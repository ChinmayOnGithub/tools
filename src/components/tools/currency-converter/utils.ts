import { fetchLiveApi } from '@/lib/api/client';

export interface CurrencyConversion {
  amount: number;
  base: string;
  target: string;
  rate: number;
  result: number;
  date: string;
}

export const FRANKFURTER_PROVIDER = {
  name: 'Frankfurter API (European Central Bank)',
  url: 'https://www.frankfurter.app',
  privacyNote: 'Currency conversion queries are requested directly from api.frankfurter.app. Financial amounts and selections are not logged on our servers.',
};

export const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
];

export async function fetchLiveExchangeRate(amount: number, from: string, to: string) {
  if (from === to) {
    return {
      data: {
        amount,
        base: from,
        target: to,
        rate: 1,
        result: amount,
        date: new Date().toISOString().split('T')[0],
      },
      error: null,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }

  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  return fetchLiveApi<CurrencyConversion>(
    url,
    FRANKFURTER_PROVIDER,
    {
      transform: (raw: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const json = raw as any;
        const rate = json.rates[to];
        return {
          amount: json.amount,
          base: json.base,
          target: to,
          rate: rate / amount,
          result: rate,
          date: json.date,
        };
      },
      cacheTtlMs: 30 * 60 * 1000, // 30 minutes cache for daily central bank rates
    }
  );
}
