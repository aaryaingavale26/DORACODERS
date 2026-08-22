import React, { useState } from 'react';
import { initialProducts } from '../../data/products';
import { productCategories } from '../../data/categories';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function ProductsSection() {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredProducts = initialProducts.filter(prod => {
    if (selectedCat === 'all') return true;
    return prod.category === selectedCat;
  });

  return (
    <section id="products" className="py-16 sm:py-20 bg-white border-t border-warm-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-pink-100/80 text-pink-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
            <span>Fair Trade & 100% Handcrafted</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#231b15] tracking-tight">
            Treasures of Rural India
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Every purchase directly supports the livelihoods of self-help group women artisans.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {productCategories.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#d81b60] text-white shadow-md shadow-pink-600/20'
                    : 'bg-warm-100 text-gray-700 hover:bg-pink-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
