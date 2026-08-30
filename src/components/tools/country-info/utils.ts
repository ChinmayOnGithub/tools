import { fetchLiveApi } from '@/lib/api/client';

export interface CountryProfile {
  name: string;
  officialName: string;
  cca2: string;
  cca3: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: string[];
  currencies: Array<{ code: string; name: string; symbol: string }>;
  flagEmoji: string;
  flagSvg: string;
  timezones: string[];
  borders: string[];
}

export const REST_COUNTRIES_PROVIDER = {
  name: 'REST Countries API',
  url: 'https://restcountries.com',
  privacyNote: 'Country queries are sent directly to restcountries.com. Searches are cached in memory.',
};

export async function fetchLiveCountry(query: string) {
  const clean = query.trim();
  if (!clean) return { data: null, error: 'Please enter a country name or country code.', lastUpdated: new Date().toLocaleTimeString() };

  const isCode = clean.length === 2 || clean.length === 3;
  const endpoint = isCode
    ? `https://restcountries.com/v3.1/alpha/${encodeURIComponent(clean)}`
    : `https://restcountries.com/v3.1/name/${encodeURIComponent(clean)}?fullText=false`;

  return fetchLiveApi<CountryProfile>(
    endpoint,
    REST_COUNTRIES_PROVIDER,
    {
      transform: (raw: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr = raw as any[];
        if (!arr || arr.length === 0) throw new Error('Country not found');
        const c = arr[0];
        
        const currenciesList: Array<{ code: string; name: string; symbol: string }> = [];
        if (c.currencies) {
          Object.keys(c.currencies).forEach((key) => {
            currenciesList.push({
              code: key,
              name: c.currencies[key]?.name || key,
              symbol: c.currencies[key]?.symbol || '',
            });
          });
        }

        const langs: string[] = c.languages ? Object.values(c.languages) : [];

        return {
          name: c.name?.common || clean,
          officialName: c.name?.official || clean,
          cca2: c.cca2 || '',
          cca3: c.cca3 || '',
          capital: c.capital ? c.capital[0] : 'N/A',
          region: c.region || 'N/A',
          subregion: c.subregion || 'N/A',
          population: c.population || 0,
          area: c.area || 0,
          languages: langs,
          currencies: currenciesList,
          flagEmoji: c.flag || '🏳️',
          flagSvg: c.flags?.svg || c.flags?.png || '',
          timezones: c.timezones || [],
          borders: c.borders || [],
        };
      },
      cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours
    }
  );
}
