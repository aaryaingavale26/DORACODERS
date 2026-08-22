import React, { useState } from 'react';
import { initialProducts } from '../../data/products';
import { productCategories } from '../../data/categories';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { Sparkles, Search, ArrowUpDown } from 'lucide-react';

export default function ProductsSection() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = initialProducts.filter(prod => {
    if (selectedCat !== 'all' && prod.category !== selectedCat) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchArtisan = prod.artisan.toLowerCase().includes(q);
      const matchState = prod.state?.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      if (!matchName && !matchArtisan && !matchState && !matchDesc) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (productSort === 'price-asc') return a.price - b.price;
    if (productSort === 'price-desc') return b.price - a.price;
    if (productSort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section id="products" className="py-16 sm:py-20 bg-white border-t border-warm-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-pink-100/80 text-pink-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d81b60]" />
            <span>Fair Trade & 100% Handcrafted ({initialProducts.length} Treasures)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#231b15] tracking-tight">
            Treasures of Rural India
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Every purchase directly supports the livelihoods of self-help group women artisans across India.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-6">
          {productCategories.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#d81b60] text-white shadow-md shadow-pink-600/20 scale-[1.02]'
                    : 'bg-warm-100 text-gray-700 hover:bg-pink-50 border border-warm-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-warm-50 p-3 rounded-2xl border border-warm-200 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search crafts (e.g. Saree, Blue Pottery, Turmeric, Brass...)"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-warm-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/30"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold hidden sm:inline">Sort:</span>
            <select
              value={productSort}
              onChange={(e) => setProductSort(e.target.value)}
              className="bg-white border border-warm-300 text-gray-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
            >
              <option value="featured">Featured Crafts</option>
              <option value="rating">Top Rated (Highest ★)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid (16+ Items) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-warm-50 rounded-2xl p-6">
            <p className="text-sm text-gray-600">No craft products matching your search.</p>
            <button
              onClick={() => { setProductSearch(''); setSelectedCat('all'); }}
              className="mt-2 text-xs font-bold text-pink-700 hover:underline"
            >
              View All Products
            </button>
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </section>
  );
}
