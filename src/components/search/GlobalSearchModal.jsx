import React, { useState, useEffect, useRef } from 'react';
import { useSisters } from '../../context/SistersContext';
import { useCart } from '../../context/CartContext';
import { initialProducts } from '../../data/products';
import { 
  Search, 
  X, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

// Clean text categories for filtering
export const ALL_SEARCH_CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "tailoring", label: "Boutique Tailoring", type: "sister" },
  { id: "mehendi", label: "Mehendi Art", type: "sister" },
  { id: "cooking", label: "Home Cooking & Tiffin", type: "sister" },
  { id: "beauty", label: "Beauty & Skincare", type: "sister" },
  { id: "textiles", label: "Textiles & Sarees", type: "craft" },
  { id: "pottery", label: "Pottery & Terracotta", type: "craft" },
  { id: "jewelry", label: "Tribal Jewelry", type: "craft" },
  { id: "home-decor", label: "Home Decor & Brass", type: "craft" },
  { id: "organic", label: "Organic & Wellness", type: "craft" },
  { id: "paintings", label: "Folk Paintings", type: "craft" },
  { id: "accessories", label: "Bags & Footwear", type: "craft" }
];

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { 
    sisters, 
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile 
  } = useSisters();
  const { addToCart, setIsCartOpen } = useCart();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter Sisters (Text-Based)
  const matchedSisters = sisters.filter(sister => {
    if (selectedCategory !== 'all') {
      const catObj = ALL_SEARCH_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj?.type === 'craft') return false;
      if (sister.category !== selectedCategory) return false;
    }

    if (!query.trim()) return selectedCategory !== 'all';
    const q = query.toLowerCase();
    return (
      sister.name.toLowerCase().includes(q) ||
      sister.specialty.toLowerCase().includes(q) ||
      sister.category?.toLowerCase().includes(q) ||
      sister.location?.toLowerCase().includes(q) ||
      sister.services?.some(s => s.name.toLowerCase().includes(q))
    );
  });

  // Filter Crafts (Text-Based)
  const matchedProducts = initialProducts.filter(prod => {
    if (selectedCategory !== 'all') {
      const catObj = ALL_SEARCH_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj?.type === 'sister') return false;
      if (prod.category !== selectedCategory) return false;
    }

    if (!query.trim()) return selectedCategory !== 'all';
    const q = query.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.artisan.toLowerCase().includes(q) ||
      prod.state?.toLowerCase().includes(q) ||
      prod.category?.toLowerCase().includes(q) ||
      prod.description?.toLowerCase().includes(q)
    );
  });

  const totalCount = matchedSisters.length + matchedProducts.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-warm-200 overflow-hidden mt-8 sm:mt-16 flex flex-col max-h-[82vh]">
        
        {/* Top Search Input */}
        <div className="p-4 sm:p-5 border-b border-warm-200 bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search (e.g. Anjali, Tailoring, Saree, Pottery, Honey...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm sm:text-base bg-warm-100/90 border border-warm-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-warm-100 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Text-Only Category Filter Pills */}
        <div className="px-4 sm:px-5 py-2.5 bg-warm-50 border-b border-warm-200 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 shrink-0 mr-1">
            Category:
          </span>
          {ALL_SEARCH_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#d81b60] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-warm-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Text-Only Results List (Fast & Clean) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
          
          {/* Matched Sisters (Text Rows) */}
          {matchedSisters.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-900 px-1">
                Skilled Sisters ({matchedSisters.length})
              </div>

              <div className="divide-y divide-warm-100 border border-warm-200 rounded-2xl overflow-hidden">
                {matchedSisters.map(sister => (
                  <div
                    key={sister.id}
                    className="p-3 bg-white hover:bg-warm-50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                          {sister.name}
                        </span>
                        <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-1.5 py-0.2 rounded-full">
                          ★ {Number(sister.rating).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        <span className="text-pink-700 font-medium">{sister.specialty}</span> • {sister.distance || 'Near you'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(sister.rate)}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSisterForBooking(sister);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Hire Her
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Crafts (Text Rows) */}
          {matchedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-900 px-1">
                Handmade Crafts ({matchedProducts.length})
              </div>

              <div className="divide-y divide-warm-100 border border-warm-200 rounded-2xl overflow-hidden">
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 bg-white hover:bg-warm-50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        <span className="text-pink-700 font-medium">{prod.artisan}</span> • {prod.state}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(prod.price)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(prod);
                          setIsCartOpen(true);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-xl text-xs font-bold"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If No Query and 'all' Selected, Show Quick Categories to Pick */}
          {!query && selectedCategory === 'all' && (
            <div className="py-6 text-center space-y-4">
              <p className="text-xs text-gray-500 font-medium">
                Choose a category or type a keyword to search:
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {ALL_SEARCH_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="px-3.5 py-1.5 bg-warm-100 hover:bg-pink-50 text-gray-800 hover:text-brand-pink text-xs font-semibold rounded-xl border border-warm-200 transition-colors"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {query && totalCount === 0 && (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-gray-500 font-semibold">No results found for "{query}".</p>
              <button
                onClick={() => { setQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-bold text-pink-700 hover:underline"
              >
                Clear Search & Reset Category
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
