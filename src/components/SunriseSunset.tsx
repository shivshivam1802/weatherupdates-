'use client';

import { format } from 'date-fns';
import { Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';

interface SunriseSunsetProps {
  data: any;
}

export default function SunriseSunset({ data }: SunriseSunsetProps) {
  if (!data || !data.daily) return null;

  const { daily } = data;
  const sunrise = new Date(daily.sunrise[0]);
  const sunset = new Date(daily.sunset[0]);
  const now = new Date();

  // Calculate percentage of day passed for the sun arc
  const totalDayTime = sunset.getTime() - sunrise.getTime();
  const timePassed = now.getTime() - sunrise.getTime();
  let percentage = (timePassed / totalDayTime) * 100;
  
  // Cap at 0 and 100
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return (
    <div className="glass-panel p-6 w-full flex flex-col items-center relative overflow-hidden">
      <h3 className="text-xl font-medium text-white/90 mb-8 tracking-wide self-start">Sun & Moon</h3>
      
      {/* Arc Visualization */}
      <div className="relative w-full max-w-[250px] h-[125px] mt-4 mb-8">
        {/* Background Arc */}
        <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-white/20 rounded-t-full border-dashed" />
        
        {/* Sun Element */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (percentage / 100) * 180 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 w-full h-[250px] origin-bottom -translate-x-1/2 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
        </motion.div>
      </div>
      
      <div className="flex justify-between w-full mt-2 text-white/90">
        <div className="flex flex-col items-center">
          <Sunrise className="w-6 h-6 mb-1 text-yellow-400" />
          <span className="font-semibold">{format(sunrise, 'h:mm a')}</span>
          <span className="text-xs text-white/60">Sunrise</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Sunset className="w-6 h-6 mb-1 text-orange-400" />
          <span className="font-semibold">{format(sunset, 'h:mm a')}</span>
          <span className="text-xs text-white/60">Sunset</span>
        </div>
      </div>
    </div>
  );
}
