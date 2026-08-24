import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingBag, HeartHandshake, MapPin } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { navigateTo } = useAuth();

  const handleCardClick = () => {
    navigateTo('shop-detail', product.sisterId || 'sister-1');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      {/* Image & Artisan Tag */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* State/Origin Tag */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1 border border-warm-200">
          <MapPin className="w-3.5 h-3.5 text-[#d81b60]" />
          <span className="truncate max-w-[120px]">{product.state || "India"}</span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(product.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-pink-700 font-semibold mb-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="truncate">{product.artisan}</span>
          </div>
          <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-brand-pink transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5 font-normal">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="p-2.5 bg-pink-50 hover:bg-[#d81b60] text-brand-pink hover:text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
