'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getWeatherIcon } from '../lib/weatherCodes';
import { useWeatherStore } from '../store/useWeatherStore';

interface DailyForecastProps {
  data: any;
}

export default function DailyForecast({ data }: DailyForecastProps) {
  const { unit } = useWeatherStore();
  
  if (!data || !data.daily) return null;

  const { daily } = data;
  
  const days = daily.time.map((time: string, idx: number) => ({
    time: new Date(time),
    maxTemp: daily.temperature_2m_max[idx],
    minTemp: daily.temperature_2m_min[idx],
    weatherCode: daily.weather_code[idx],
  })).slice(0, 7); // Ensure 7 days

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="glass-panel p-6 w-full">
      <h3 className="text-xl font-medium text-white/90 mb-6 tracking-wide">7-Day Forecast</h3>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-4"
      >
        {days.map((day: any, idx: number) => {
          const displayMax = unit === 'C' 
            ? Math.round(day.maxTemp) 
            : Math.round((day.maxTemp * 9/5) + 32);
            
          const displayMin = unit === 'C' 
            ? Math.round(day.minTemp) 
            : Math.round((day.minTemp * 9/5) + 32);
            
          const Icon = getWeatherIcon(day.weatherCode, true); // Assume day icon for daily forecast
          
          return (
            <motion.div 
              key={idx}
              variants={item}
              className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
            >
              <span className="text-white/80 font-medium w-24">
                {idx === 0 ? 'Today' : format(day.time, 'EEEE')}
              </span>
              
              <div className="flex flex-1 justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex items-center justify-end w-32 gap-3">
                <span className="text-white font-semibold">{displayMax}&deg;</span>
                <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 w-full" />
                </div>
                <span className="text-white/60 font-medium">{displayMin}&deg;</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
