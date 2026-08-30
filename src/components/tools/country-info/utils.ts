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

export const COUNTRIES_PROVIDER = {
  name: 'World Countries Database (Open Source)',
  url: 'https://github.com/mledoze/countries',
  privacyNote: 'Country datasets are retrieved via GitHub open raw data and cached in browser memory.',
};

// Raw dataset item definition
interface RawCountryItem {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  flag?: string;
  timezones?: string[];
  borders?: string[];
}

export async function fetchLiveCountry(query: string) {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return {
      data: null,
      error: 'Please enter a country name or ISO country code.',
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }

  // Fetch verified open world countries JSON repository (raw GitHub)
  const url = `https://raw.githubusercontent.com/mledoze/countries/master/countries.json`;

  return fetchLiveApi<CountryProfile>(
    url,
    COUNTRIES_PROVIDER,
    {
      transform: (raw: unknown) => {
        const list = raw as RawCountryItem[];
        if (!Array.isArray(list)) throw new Error('Invalid dataset received');

        const match = list.find((c) => {
          const common = c.name?.common?.toLowerCase() || '';
          const official = c.name?.official?.toLowerCase() || '';
          const cca2 = c.cca2?.toLowerCase() || '';
          const cca3 = c.cca3?.toLowerCase() || '';

          return (
            common === clean ||
            official === clean ||
            cca2 === clean ||
            cca3 === clean ||
            common.includes(clean)
          );
        });

        if (!match) {
          throw new Error(`No country found matching "${query}". Try searching "Japan", "Canada", "Germany", etc.`);
        }

        const currenciesList: Array<{ code: string; name: string; symbol: string }> = [];
        if (match.currencies) {
          Object.keys(match.currencies).forEach((key) => {
            currenciesList.push({
              code: key,
              name: match.currencies?.[key]?.name || key,
              symbol: match.currencies?.[key]?.symbol || '',
            });
          });
        }

        const langs: string[] = match.languages ? Object.values(match.languages) : [];

        return {
          name: match.name?.common || query,
          officialName: match.name?.official || query,
          cca2: match.cca2 || '',
          cca3: match.cca3 || '',
          capital: match.capital && match.capital.length > 0 ? match.capital[0] : 'N/A',
          region: match.region || 'N/A',
          subregion: match.subregion || 'N/A',
          population: match.population || 0,
          area: match.area || 0,
          languages: langs,
          currencies: currenciesList,
          flagEmoji: match.flag || '🏳️',
          flagSvg: match.cca2 ? `https://flagcdn.com/${match.cca2.toLowerCase()}.svg` : '',
          timezones: match.timezones || [],
          borders: match.borders || [],
        };
      },
      cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours
    }
  );
}
