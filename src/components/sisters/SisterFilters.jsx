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
  MapPin,
  ArrowUpDown,
  Map as MapIcon,
  LayoutGrid,
  Columns
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Scissors,
  Palette,
  Utensils,
  Activity,
  BookOpen,
  Home,
  Heart
};

export default function SisterFilters() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy,
    maxDistanceKm,
    setMaxDistanceKm,
    viewMode,
    setViewMode,
    filteredSisters
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

      {/* Filter & Sort Controls & View Mode Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-warm-200 shadow-sm text-xs sm:text-sm">
        
        {/* Proximity / Location Zone */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-[#d81b60]" />
          <span className="font-bold text-xs sm:text-sm hidden sm:inline">Serving Zone:</span>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="bg-warm-100/90 border border-warm-300 text-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-500/30 cursor-pointer"
          >
            <option value={3}>Within 3 km zone (Fastest)</option>
            <option value={5}>Within 5 km zone</option>
            <option value={10}>Within 10 km zone</option>
            <option value={50}>All Neighborhoods</option>
          </select>
        </div>

        {/* View Mode Switcher: Split / Grid / Map */}
        <div className="flex items-center gap-1 bg-warm-100 p-1 rounded-xl border border-warm-200">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-[#d81b60] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Split Map & Grid View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Map & Cards</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-[#d81b60] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Interactive Map Only"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Only</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#d81b60] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Cards Grid Only"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards Grid</span>
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-gray-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-warm-100/90 border border-warm-300 text-gray-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top Rated (★)</option>
            <option value="likes">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>
    </div>
  );
}
