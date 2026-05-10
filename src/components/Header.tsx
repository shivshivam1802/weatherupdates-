'use client';

import { CloudLightning } from 'lucide-react';
import SearchBar from './SearchBar';
import { useWeatherStore } from '../store/useWeatherStore';

export default function Header() {
  const { unit, toggleUnit } = useWeatherStore();

  return (
    <header className="w-full py-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 z-50 relative">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
          <CloudLightning className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">weather<span className="font-light">updates</span></h1>
      </div>

      <div className="flex-1 w-full flex justify-center max-w-2xl px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleUnit}
          className="glass flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
          title={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
        >
          &deg;{unit}
        </button>
      </div>
    </header>
  );
}
