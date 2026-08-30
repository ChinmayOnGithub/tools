import { fetchLiveApi } from '@/lib/api/client';

export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

export const NASA_APOD_PROVIDER = {
  name: 'NASA APOD Open API',
  url: 'https://apod.nasa.gov',
  privacyNote: 'NASA Astronomy Picture of the Day queries are fetched via api.nasa.gov DEMO_KEY endpoints.',
};

export async function fetchLiveApod() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;

  return fetchLiveApi<ApodData>(
    url,
    NASA_APOD_PROVIDER,
    {
      cacheTtlMs: 60 * 60 * 1000, // 1 hour cache for daily NASA images
    }
  );
}
