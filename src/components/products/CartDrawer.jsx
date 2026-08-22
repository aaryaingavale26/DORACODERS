import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal 
  } = useCart();

  const [isOrdered, setIsOrdered] = useState(false);

  if (!isCartOpen) return null;

  const shipping = cartSubtotal > 999 ? 0 : 70;
  const orderTotal = cartSubtotal + shipping;

  const handleCheckout = () => {
    setIsOrdered(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsOrdered(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-300" />
            <h3 className="font-bold font-serif text-lg">Handmade Crafts Cart</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isOrdered ? (
          <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-600">
              Thank you for directly supporting rural women artisans. Your authentic handmade package is being prepared with care.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 bg-[#d81b60] text-white font-bold rounded-xl text-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-3">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
            <h4 className="font-bold text-gray-700 font-serif">Your Cart is Empty</h4>
            <p className="text-xs text-gray-500 max-w-xs">
              Explore authentic handcrafted ceramics, sarees, tribal jewelry, and organic goods.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-5 py-2 bg-pink-50 text-pink-700 font-bold rounded-xl text-xs"
            >
              Browse Crafts
            </button>
          </div>
        ) : (
          <div className="flex-1 p-5 overflow-y-auto space-y-3 divide-y divide-warm-100">
            {items.map(item => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-warm-200 shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{item.artisan}</p>
                  <p className="text-xs font-extrabold text-pink-700 mt-1">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-warm-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded text-gray-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded text-gray-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Billing & Checkout */}
        {items.length > 0 && !isOrdered && (
          <div className="p-5 bg-warm-50 border-t border-warm-200 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Artisan Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-warm-200 text-sm">
                <span>Total Amount</span>
                <span className="text-pink-700 text-base">{formatCurrency(orderTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#d81b60] hover:bg-[#c2185b] text-white py-3.5 px-4 rounded-xl text-sm font-bold shadow-md shadow-pink-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Place Order (Cash on Delivery)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
