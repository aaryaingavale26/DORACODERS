import React from 'react';
import { useSisters } from '../../context/SistersContext';
import { sisterCategories } from '../../data/categories';
import { 
  Sparkles, 
  Scissors, 
  Palette, 
  Utensils, 
  Activity, 
  BookOpen, 
  Home, 
  Heart,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Scissors: Scissors,
  Palette: Palette,
  Utensils: Utensils,
  Activity: Activity,
  BookOpen: BookOpen,
  Home: Home,
  Heart: Heart
};

export default function SisterFilters() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy,
    maxDistanceKm,
    setMaxDistanceKm
  } = useSisters();

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {sisterCategories.map(cat => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#d81b60] text-white shadow-md shadow-pink-600/20 scale-[1.02]'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-warm-300/80 hover:border-pink-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-pink-600'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-warm-200 shadow-sm text-xs sm:text-sm">
        
        {/* Proximity / Location Zone */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-brand-pink" />
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">Serving Zone:</span>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="bg-warm-100/80 border border-warm-300 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
          >
            <option value={3}>Within 3 km zone (Fastest)</option>
            <option value={5}>Within 5 km zone</option>
            <option value={10}>Within 10 km zone</option>
            <option value={50}>All Neighborhoods</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-gray-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-warm-100/80 border border-warm-300 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
          >
            <option value="featured">Featured Sisters</option>
            <option value="rating">Top Rated (Highest ★)</option>
            <option value="likes">Most Popular (Likes)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>
    </div>
  );
}
