import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  X, 
  Star, 
  ShoppingBag, 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image & Badges */}
          <div className="relative aspect-square md:aspect-auto bg-warm-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-md flex items-center gap-1.5 border border-warm-200">
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              <span>{product.state || "India"}</span>
            </div>
          </div>

          {/* Right: Details & Buying */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-pink-700 uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(product.rating).toFixed(1)} ({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Artisan Tag */}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-700 font-semibold bg-warm-50 p-2.5 rounded-xl border border-warm-200">
                <HeartHandshake className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Crafted by <strong>{product.artisan}</strong></span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-warm-100/70 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400 block">Materials</span>
                  <strong className="text-gray-800">{product.materials || "Natural Handmade"}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Dimensions</span>
                  <strong className="text-gray-800">{product.dimensions || "Standard"}</strong>
                </div>
              </div>
            </div>

            {/* Price & Quantity & CTA */}
            <div className="pt-4 border-t border-warm-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-600 font-bold block">100% Fair Trade Direct Artisan Pay</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 bg-warm-100 rounded-xl p-1 border border-warm-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 bg-white hover:bg-warm-50 rounded-lg flex items-center justify-center text-gray-700 shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 bg-white hover:bg-warm-50 rounded-lg flex items-center justify-center text-gray-700 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-pink-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatCurrency(product.price * quantity)})</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 pt-1">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Artisan Dispatch</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticity Guarantee</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
