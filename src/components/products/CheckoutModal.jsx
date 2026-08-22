import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Wallet, 
  Banknote,
  MapPin,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, cartSubtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    paymentMethod: 'Cash on Delivery'
  });

  if (!isOpen) return null;

  const shipping = cartSubtotal > 999 ? 0 : 70;
  const total = cartSubtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Please fill in your name, contact phone, and delivery address.");
      return;
    }

    placeOrder({
      customer: formData,
      items: [...items],
      subtotal: cartSubtotal,
      shipping,
      total
    });

    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif">Checkout & Order Delivery</h2>
            <p className="text-xs text-pink-200">100% Secure Fair Trade Payment & Artisan Support</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-[#faf7f5]">
          
          {/* Step 1: Customer Info */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-warm-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-bold">1</span>
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-warm-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-bold">2</span>
              Delivery Address
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">House / Flat No, Street, Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 302, Lotus Greens, Near City Park"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajasthan"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 302001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-warm-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-bold">3</span>
              Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, sub: 'Pay upon parcel receipt' },
                { id: 'UPI / QR', label: 'UPI / GooglePay / PhonePe', icon: Wallet, sub: 'Instant Zero Fee' },
                { id: 'Card / NetBanking', label: 'Credit/Debit Card', icon: CreditCard, sub: 'Secure 128-bit' },
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === opt.id
                      ? 'border-brand-pink bg-pink-50/70 ring-2 ring-pink-300'
                      : 'border-warm-200 hover:border-pink-200 bg-white'
                  }`}
                >
                  <opt.icon className="w-4 h-4 text-brand-pink mb-1" />
                  <p className="text-xs font-bold text-gray-900">{opt.label}</p>
                  <p className="text-[10px] text-gray-500">{opt.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-warm-100 p-4 rounded-2xl border border-warm-200 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Total ({items.length} unique crafts)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Direct Artisan Dispatch Shipping</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-warm-300 text-sm sm:text-base">
              <span>Total Payable</span>
              <span className="text-pink-700">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Place Order ({formatCurrency(total)})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
