import React, { useState, useEffect, useRef } from 'react';
import { useSisters } from '../../context/SistersContext';
import { useCart } from '../../context/CartContext';
import { initialProducts } from '../../data/products';
import { 
  Search, 
  X, 
  Sparkles, 
  MapPin, 
  Star, 
  ShoppingBag, 
  UserCheck, 
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { 
    sisters, 
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile 
  } = useSisters();
  const { addToCart, setIsCartOpen } = useCart();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'sisters', 'crafts'
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter Sisters
  const matchedSisters = sisters.filter(sister => {
    if (activeTab === 'crafts') return false;
    if (sister.rate > maxPrice) return false;
    if (minRating > 0 && sister.rating < minRating) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      sister.name.toLowerCase().includes(q) ||
      sister.specialty.toLowerCase().includes(q) ||
      sister.category?.toLowerCase().includes(q) ||
      sister.location?.toLowerCase().includes(q) ||
      sister.services?.some(s => s.name.toLowerCase().includes(q))
    );
  });

  // Filter Crafts
  const matchedProducts = initialProducts.filter(prod => {
    if (activeTab === 'sisters') return false;
    if (prod.price > maxPrice) return false;
    if (minRating > 0 && prod.rating < minRating) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.artisan.toLowerCase().includes(q) ||
      prod.state.toLowerCase().includes(q) ||
      prod.category.toLowerCase().includes(q) ||
      prod.description.toLowerCase().includes(q)
    );
  });

  const totalResultsCount = matchedSisters.length + matchedProducts.length;

  const popularSearches = [
    "Jaipur Blue Pottery",
    "Boutique Tailor",
    "Chanderi Silk Saree",
    "Mehendi Artist",
    "Pure Brass Thali",
    "Raw Himalayan Honey",
    "Kolhapuri Chappals"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-warm-300 overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar Header */}
        <div className="p-4 sm:p-5 border-b border-warm-200 bg-white sticky top-0 z-10 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search sisters, tailoring, mehendi, pottery, sarees, brass..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-warm-100/80 border border-warm-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink font-medium"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm p-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-warm-100 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-warm-50 px-4 sm:px-6 py-3 border-b border-warm-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 bg-warm-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-brand-pink shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({sisters.length + initialProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('sisters')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'sisters' ? 'bg-white text-brand-pink shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Skilled Sisters ({sisters.length})
            </button>
            <button
              onClick={() => setActiveTab('crafts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'crafts' ? 'bg-white text-brand-pink shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Handmade Crafts ({initialProducts.length})
            </button>
          </div>

          {/* Quick Filter Modifiers */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-600">
              <span>Max:</span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="bg-white border border-warm-300 rounded-lg px-2 py-1 font-bold text-gray-900 focus:outline-none"
              >
                <option value={1000}>Under ₹1,000</option>
                <option value={2000}>Under ₹2,000</option>
                <option value={5000}>Under ₹5,000</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-white border border-warm-300 rounded-lg px-2 py-1 font-bold text-gray-900 focus:outline-none"
              >
                <option value={0}>All Ratings</option>
                <option value={4.8}>★ 4.8 & above</option>
                <option value={4.9}>★ 4.9 & above</option>
              </select>
            </div>
          </div>

        </div>

        {/* Popular Search Suggestions (when query is empty) */}
        {!query && (
          <div className="px-5 py-3 bg-white border-b border-warm-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Popular:</span>
            {popularSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 bg-warm-100 hover:bg-pink-50 text-gray-700 hover:text-brand-pink rounded-full text-xs font-semibold shrink-0 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#faf7f5]">
          
          {/* Section 1: Matched Skilled Sisters */}
          {matchedSisters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#d81b60]" />
                  <span>Skilled Sisters Available ({matchedSisters.length})</span>
                </h3>
                <span className="text-[11px] text-gray-500">Doorstep services within 3km</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedSisters.map(sister => (
                  <div 
                    key={sister.id}
                    className="bg-white p-3.5 rounded-2xl border border-warm-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sister.avatar}
                        alt={sister.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{sister.name}</h4>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 rounded-full flex items-center gap-0.5">
                            ★ {Number(sister.rating).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-pink-700 font-semibold truncate">{sister.specialty}</p>
                        <p className="text-[11px] text-gray-500 truncate">{sister.location || 'Local Zone'}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{formatCurrency(sister.rate)}</span>
                      <button
                        onClick={() => {
                          setSelectedSisterForBooking(sister);
                          onClose();
                        }}
                        className="px-3 py-1 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Hire Her
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Matched Handmade Crafts */}
          {matchedProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#d81b60]" />
                  <span>Handmade Crafts & Treasures ({matchedProducts.length})</span>
                </h3>
                <span className="text-[11px] text-gray-500">Shipped directly from rural SHGs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-white p-3.5 rounded-2xl border border-warm-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover border border-warm-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{prod.name}</h4>
                        <p className="text-[10px] text-pink-700 truncate">{prod.artisan} ({prod.state})</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-gray-900">{formatCurrency(prod.price)}</span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">{formatCurrency(prod.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(prod);
                        setIsCartOpen(true);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-xl text-xs font-bold shrink-0 transition-all"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalResultsCount === 0 && (
            <div className="py-12 text-center space-y-3">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-800 font-serif">No matching results found</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try searching for a different service like "Tailoring", "Pottery", "Chanderi", or reset your price filters.
              </p>
              <button
                onClick={() => { setQuery(''); setMaxPrice(5000); setMinRating(0); setActiveTab('all'); }}
                className="px-4 py-2 bg-pink-100 text-pink-800 rounded-xl text-xs font-bold hover:bg-pink-200"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
