'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Mic, MapPin } from 'lucide-react';
import { searchLocations, Location } from '../lib/api';
import { useWeatherStore } from '../store/useWeatherStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { setCurrentLocation, addRecentSearch } = useWeatherStore();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        setIsSearching(true);
        const data = await searchLocations(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    };
    
    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location: Location) => {
    setCurrentLocation(location);
    addRecentSearch(location);
    setQuery('');
    setResults([]);
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
            country: 'Auto',
          });
        },
        (error) => {
          console.error("Error getting location", error);
          alert('Could not get your location. Please search manually.');
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-md z-50" ref={searchRef}>
      <div className="relative flex items-center w-full h-12 rounded-full glass-panel overflow-hidden px-4 focus-within:ring-2 focus-within:ring-white/50 transition-all">
        <Search className="text-white/70 w-5 h-5 mr-3" />
        <input
          type="text"
          className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/60 font-medium"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={startVoiceSearch}
          className={`ml-2 p-2 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-white/70'}`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button 
          onClick={requestLocation}
          className="ml-1 p-2 rounded-full hover:bg-white/10 transition-colors text-white/70"
          title="Use current location"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 w-full glass-panel rounded-xl overflow-hidden shadow-2xl flex flex-col py-2"
          >
            {results.map((loc, i) => (
              <button
                key={`${loc.name}-${loc.lat}-${loc.lon}-${i}`}
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-4 py-3 hover:bg-white/20 text-white transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-lg">{loc.name}</span>
                <span className="text-sm text-white/70">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
