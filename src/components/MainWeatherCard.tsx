'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getWeatherIcon, getWeatherDescription } from '../lib/weatherCodes';
import { useWeatherStore } from '../store/useWeatherStore';

interface MainWeatherCardProps {
  data: any;
}

export default function MainWeatherCard({ data }: MainWeatherCardProps) {
  const { currentLocation, unit } = useWeatherStore();
  
  if (!data || !currentLocation) return null;

  const { current } = data;
  const isDay = current.is_day === 1;
  const weatherCode = current.weather_code;
  const tempC = current.temperature_2m;
  const tempF = (tempC * 9/5) + 32;
  const displayTemp = unit === 'C' ? Math.round(tempC) : Math.round(tempF);
  
  const feelsLikeC = current.apparent_temperature;
  const feelsLikeF = (feelsLikeC * 9/5) + 32;
  const displayFeelsLike = unit === 'C' ? Math.round(feelsLikeC) : Math.round(feelsLikeF);

  const Icon = getWeatherIcon(weatherCode, isDay);
  const description = getWeatherDescription(weatherCode);
  const currentDate = new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-8 md:p-12 w-full flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
    >
      {/* Decorative blurred circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      
      <div className="flex flex-col items-center md:items-start z-10">
        <div className="flex items-center text-white/80 mb-2">
          <MapPin className="w-5 h-5 mr-2" />
          <h2 className="text-2xl font-bold tracking-wide">{currentLocation.name}</h2>
          {currentLocation.admin1 && <span className="ml-2 text-white/60">{currentLocation.admin1}</span>}
        </div>
        
        <p className="text-white/70 mb-6">{format(currentDate, 'EEEE, d MMMM yyyy')}</p>
        
        <div className="flex items-center">
          <span className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 drop-shadow-sm leading-none tracking-tighter">
            {displayTemp}&deg;
          </span>
          <span className="text-4xl text-white/60 ml-2 mt-4 font-light">{unit}</span>
        </div>
        
        <p className="text-lg text-white/80 mt-4 font-medium tracking-wide">
          Feels like {displayFeelsLike}&deg;{unit}
        </p>
      </div>

      <div className="flex flex-col items-center z-10">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative"
        >
          {/* Subtle glow behind icon */}
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
          <Icon className="w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-lg relative z-10" />
        </motion.div>
        <p className="text-2xl font-semibold text-white mt-6 capitalize tracking-wider text-glow text-center">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
