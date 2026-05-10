import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location } from '../lib/api';

interface WeatherState {
  currentLocation: Location | null;
  unit: 'C' | 'F';
  favorites: Location[];
  recentSearches: Location[];
  setCurrentLocation: (location: Location) => void;
  toggleUnit: () => void;
  addFavorite: (location: Location) => void;
  removeFavorite: (name: string) => void;
  addRecentSearch: (location: Location) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      currentLocation: null,
      unit: 'C',
      favorites: [],
      recentSearches: [],
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      toggleUnit: () => set((state) => ({ unit: state.unit === 'C' ? 'F' : 'C' })),
      
      addFavorite: (location) => set((state) => {
        if (state.favorites.some((f) => f.name === location.name)) return state;
        return { favorites: [...state.favorites, location] };
      }),
      
      removeFavorite: (name) => set((state) => ({
        favorites: state.favorites.filter((f) => f.name !== name),
      })),
      
      addRecentSearch: (location) => set((state) => {
        const filtered = state.recentSearches.filter((s) => s.name !== location.name);
        return { recentSearches: [location, ...filtered].slice(0, 5) };
      }),
    }),
    {
      name: 'weather-storage',
    }
  )
);
