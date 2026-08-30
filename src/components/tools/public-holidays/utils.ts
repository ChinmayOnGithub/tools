import { fetchLiveApi } from '@/lib/api/client';

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties?: string[];
  types: string[];
}

export const NAGER_DATE_PROVIDER = {
  name: 'Nager.Date Worldwide Public Holiday API',
  url: 'https://date.nager.at',
  privacyNote: 'Selected country codes and years are queried directly from date.nager.at without tracking individual calendars.',
};

export const COMMON_HOLIDAY_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'SG', name: 'Singapore' },
];

export async function fetchLiveHolidays(year: number, countryCode: string) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;

  return fetchLiveApi<PublicHoliday[]>(
    url,
    NAGER_DATE_PROVIDER,
    {
      cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours cache
    }
  );
}
