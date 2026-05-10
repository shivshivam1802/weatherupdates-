'use client';

import { Droplets, Wind, Sun, Eye, Gauge, Cloud as CloudIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrentDetailsGridProps {
  data: any;
}

export default function CurrentDetailsGrid({ data }: CurrentDetailsGridProps) {
  if (!data) return null;

  const { current, daily } = data;
  
  const details = [
    {
      title: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      icon: Droplets,
    },
    {
      title: 'Wind Speed',
      value: `${current.wind_speed_10m} km/h`,
      icon: Wind,
    },
    {
      title: 'UV Index',
      value: daily?.uv_index_max?.[0] || 'N/A',
      icon: Sun,
    },
    {
      title: 'Cloud Cover',
      value: `${current.cloud_cover}%`,
      icon: CloudIcon,
    },
    {
      title: 'Pressure',
      value: `${current.pressure_msl} hPa`,
      icon: Gauge,
    },
    {
      title: 'Visibility',
      // Open-Meteo current API might not have visibility directly, fallback to hourly if needed or just use precipitation
      value: current.precipitation > 0 ? `${current.precipitation} mm` : 'Clear',
      icon: Eye,
      title_override: current.precipitation > 0 ? 'Precipitation' : 'Status'
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full"
    >
      {details.map((detail, idx) => (
        <motion.div 
          key={idx}
          variants={item}
          className="glass-panel p-5 flex flex-col justify-center items-start group hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center text-white/60 mb-2">
            <detail.icon className="w-5 h-5 mr-2 group-hover:text-white transition-colors" />
            <span className="font-medium">{detail.title_override || detail.title}</span>
          </div>
          <p className="text-2xl font-semibold text-white tracking-wide">{detail.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
