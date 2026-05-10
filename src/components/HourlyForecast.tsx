'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getWeatherIcon } from '../lib/weatherCodes';
import { useWeatherStore } from '../store/useWeatherStore';

interface HourlyForecastProps {
  data: any;
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const { unit } = useWeatherStore();
  
  if (!data || !data.hourly) return null;

  const { hourly } = data;
  
  // Get next 24 hours from current time
  const currentTime = new Date();
  const currentIndex = hourly.time.findIndex((t: string) => new Date(t) > currentTime);
  
  // fallback if index not found
  const startIndex = currentIndex !== -1 ? currentIndex : 0;
  
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time: string, idx: number) => {
    const realIndex = startIndex + idx;
    const isDayTime = hourly.is_day ? hourly.is_day[realIndex] === 1 : true;
    
    return {
      time: new Date(time),
      temp: hourly.temperature_2m[realIndex],
      weatherCode: hourly.weather_code[realIndex],
      isDay: isDayTime,
    };
  });

  return (
    <div className="glass-panel p-6 w-full">
      <h3 className="text-xl font-medium text-white/90 mb-6 tracking-wide">Hourly Forecast</h3>
      
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 snap-x">
        {next24Hours.map((hour: any, idx: number) => {
          const displayTemp = unit === 'C' 
            ? Math.round(hour.temp) 
            : Math.round((hour.temp * 9/5) + 32);
            
          const Icon = getWeatherIcon(hour.weatherCode, hour.isDay);
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center justify-between min-w-[80px] snap-center"
            >
              <span className="text-white/70 font-medium mb-3">
                {idx === 0 ? 'Now' : format(hour.time, 'h a')}
              </span>
              
              <Icon className="w-8 h-8 text-white drop-shadow-md my-2" />
              
              <span className="text-xl font-semibold text-white mt-3">
                {displayTemp}&deg;
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
