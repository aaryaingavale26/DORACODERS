import React, { useState } from 'react';
import { useSisters } from '../context/SistersContext';
import { useCart } from '../context/CartContext';
import { useBookings } from '../context/BookingContext';
import { useOrders } from '../context/OrdersContext';
import { 
  ShoppingBag, 
  Calendar, 
  Package,
  UserPlus, 
  Search, 
  Heart, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function Navbar() {
  const { setIsEnrollModalOpen, searchQuery, setSearchQuery } = useSisters();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { bookings, setIsMyBookingsOpen } = useBookings();
  const { orders, setIsMyOrdersOpen } = useOrders();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => b.status !== 'Cancelled').length;
  const activeOrdersCount = orders.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200/80 transition-all shadow-sm">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
        <span>100% Direct Income to Rural Women Artisans & Skilled Sisters across India</span>
        <span className="hidden md:inline text-pink-300">| Free doorstep service consultation</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif text-2xl font-bold italic">u</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#231b15] group-hover:text-brand-pink transition-colors">
                  udaan
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-pink-700 -mt-1">
                  Empowering Women
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <a 
                href="#sisters" 
                className="hover:text-brand-pink transition-colors flex items-center gap-1.5 py-1 text-pink-700 bg-pink-50 px-3 rounded-full border border-pink-200/60"
              >
                <ShieldCheck className="w-4 h-4 text-brand-pink" />
                Hire Skilled Sisters
              </a>
              <a href="#products" className="hover:text-brand-pink transition-colors py-1">
                Handmade Crafts
              </a>
              <a href="#impact" className="hover:text-brand-pink transition-colors py-1">
                Artisan Stories & Impact
              </a>
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <input
              type="text"
              placeholder="Search sisters, services, crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-warm-100/90 border border-warm-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Orders & Tracking Button */}
            <button
              onClick={() => setIsMyOrdersOpen(true)}
              className="relative p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Track My Craft Orders"
            >
              <Package className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Orders</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center -ml-1">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* My Bookings Button */}
            <button
              onClick={() => setIsMyBookingsOpen(true)}
              className="relative p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="My Service Bookings"
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="w-4 h-4 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center -ml-1">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Handmade Store Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="w-4 h-4 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center -ml-1">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Primary Enroll CTA */}
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#d81b60] hover:bg-[#c2185b] text-white px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-pink-600/20 hover:shadow-lg active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll as Sister</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-brand-pink rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-warm-200 animate-fade-in space-y-3">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search sisters, services, crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-warm-100 border border-warm-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-col gap-2 font-medium text-sm">
              <a 
                href="#sisters" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-pink-700 bg-pink-50 rounded-lg flex items-center justify-between"
              >
                <span>Hire Skilled Sisters</span>
                <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">Radar Active</span>
              </a>
              <a 
                href="#products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-gray-700 hover:bg-warm-100 rounded-lg"
              >
                Handmade Crafts Store
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMyOrdersOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-warm-100 rounded-lg flex items-center justify-between"
              >
                <span>Track My Orders</span>
                {activeOrdersCount > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMyBookingsOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-warm-100 rounded-lg flex items-center justify-between"
              >
                <span>My Service Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsEnrollModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-white bg-[#d81b60] hover:bg-[#c2185b] font-semibold rounded-lg flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join as a Skilled Sister Partner</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
