import axios from 'axios';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin1?: string; // State or province
}

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query) return [];
  try {
    const response = await axios.get(GEOCODING_API, {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json',
      },
    });
    
    if (!response.data.results) return [];
    
    return response.data.results.map((item: any) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country,
      admin1: item.admin1,
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(WEATHER_API, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m',
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,uv_index',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
        timezone: 'auto',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
