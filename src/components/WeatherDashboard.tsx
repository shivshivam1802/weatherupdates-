'use client';

import { useEffect, useState } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { getWeatherData } from '../lib/api';
import MainWeatherCard from './MainWeatherCard';
import CurrentDetailsGrid from './CurrentDetailsGrid';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import SunriseSunset from './SunriseSunset';
import { motion } from 'framer-motion';

export default function WeatherDashboard() {
  const { currentLocation } = useWeatherStore();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(currentLocation.lat, currentLocation.lon);
        setWeatherData(data);
        
        // Dynamically update body background class based on weather code and time
        updateBackground(data.current.weather_code, data.current.is_day === 1);
      } catch (err) {
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [currentLocation]);

  const updateBackground = (code: number, isDay: boolean) => {
    // Simple dynamic background system based on CSS variables
    const root = document.documentElement;
    if (!isDay) {
      root.style.setProperty('--background', '#0f172a'); // Night
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (code <= 3) {
        root.style.setProperty('--background', '#0284c7'); // Darker Sky Blue
      } else if (code >= 51 && code <= 67) {
        root.style.setProperty('--background', '#334155'); // Darker Slate
      } else {
        root.style.setProperty('--background', '#0f766e'); // Darker Teal (was default light)
      }
    }
  };

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/80">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl mb-4"
        >
          🌍
        </motion.div>
        <p className="text-xl">Search for a city or allow location access to start.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="mt-4 text-white/80">Fetching live weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 text-center text-red-200">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      <MainWeatherCard data={weatherData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HourlyForecast data={weatherData} />
          <CurrentDetailsGrid data={weatherData} />
        </div>
        <div className="space-y-6">
          <SunriseSunset data={weatherData} />
          <DailyForecast data={weatherData} />
        </div>
      </div>
    </div>
  );
}
