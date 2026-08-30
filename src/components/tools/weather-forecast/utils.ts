import { fetchLiveApi } from '@/lib/api/client';

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  windDirection: number;
  relativeHumidity: number;
  surfacePressure: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export const OPEN_METEO_PROVIDER = {
  name: 'Open-Meteo Weather API',
  url: 'https://open-meteo.com',
  privacyNote: 'Location searches are sent directly to geocoding-api.open-meteo.com and api.open-meteo.com without storing search history on our servers.',
};

// Map WMO Weather Interpretation Codes (WW)
export function getWeatherDescription(code: number): { label: string; iconEmoji: string } {
  switch (code) {
    case 0: return { label: 'Clear Sky', iconEmoji: '☀️' };
    case 1: return { label: 'Mainly Clear', iconEmoji: '🌤️' };
    case 2: return { label: 'Partly Cloudy', iconEmoji: '⛅' };
    case 3: return { label: 'Overcast', iconEmoji: '☁️' };
    case 45:
    case 48: return { label: 'Foggy', iconEmoji: '🌫️' };
    case 51:
    case 53:
    case 55: return { label: 'Drizzle', iconEmoji: '🌦️' };
    case 61:
    case 63:
    case 65: return { label: 'Rain', iconEmoji: '🌧️' };
    case 71:
    case 73:
    case 75: return { label: 'Snowfall', iconEmoji: '🌨️' };
    case 80:
    case 81:
    case 82: return { label: 'Rain Showers', iconEmoji: '🌧️' };
    case 95:
    case 96:
    case 99: return { label: 'Thunderstorm', iconEmoji: '⛈️' };
    default: return { label: 'Variable Weather', iconEmoji: '🌡️' };
  }
}

export async function fetchLiveWeather(cityName: string) {
  const clean = cityName.trim();
  if (!clean) return { data: null, error: 'Please enter a city or location name.', lastUpdated: new Date().toLocaleTimeString() };

  // Step 1: Geocoding lookup
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=en&format=json`;
  
  const geoRes = await fetchLiveApi<{ results?: Array<{ name: string; country?: string; latitude: number; longitude: number }> }>(
    geoUrl,
    OPEN_METEO_PROVIDER,
    { cacheTtlMs: 24 * 60 * 60 * 1000 } // Geocodes cached 24h
  );

  if (geoRes.error || !geoRes.data?.results || geoRes.data.results.length === 0) {
    return { data: null, error: `No location found matching "${clean}". Try searching a major city.`, lastUpdated: new Date().toLocaleTimeString() };
  }

  const loc = geoRes.data.results[0];

  // Step 2: Forecast metrics lookup
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`;

  return fetchLiveApi<WeatherData>(
    forecastUrl,
    OPEN_METEO_PROVIDER,
    {
      transform: (raw: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const json = raw as any;
        const current = json.current;
        return {
          city: loc.name,
          country: loc.country || '',
          latitude: loc.latitude,
          longitude: loc.longitude,
          temperature: current.temperature_2m,
          apparentTemperature: current.apparent_temperature,
          windSpeed: current.wind_speed_10m,
          windDirection: current.wind_direction_10m,
          relativeHumidity: current.relative_humidity_2m,
          surfacePressure: current.surface_pressure,
          weatherCode: current.weather_code,
          isDay: current.is_day === 1,
          time: current.time,
        };
      },
      cacheTtlMs: 10 * 60 * 1000, // 10 minutes
    }
  );
}
