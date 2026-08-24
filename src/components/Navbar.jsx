import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSisters } from '../context/SistersContext';
import { useCart } from '../context/CartContext';
import { useBookings } from '../context/BookingContext';
import { useOrders } from '../context/OrdersContext';
import { 
  ShoppingBag, 
  Package, 
  Search, 
  Zap, 
  LogOut, 
  User, 
  Menu, 
  X,
  Sparkles,
  LayoutDashboard,
  CalendarDays
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    isAuthenticated, 
    logout, 
    currentView, 
    dashboardTab,
    navigateTo, 
    toggleDemoRole 
  } = useAuth();

  const { 
    searchQuery, 
    setSearchQuery 
  } = useSisters();

  const { totalItemsCount, setIsCartOpen } = useCart();
  const { bookings } = useBookings();
  const { orders, setIsMyOrdersOpen } = useOrders();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const isSister = currentUser.role === 'sister';
  const isPro = currentUser.subscription === 'pro';

  // Count requests/bookings
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const activeOrdersCount = orders.length;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (currentView !== 'home') {
      navigateTo('home');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setSearchQuery('');
    navigateTo('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-warm-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LEFT: Branding & Logo */}
          <div className="flex items-center shrink-0">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleLogoClick}>
              <svg className="w-8 h-8 text-pink-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-2xl font-bold text-pink-700 font-serif tracking-wide">udaan</span>
            </div>
          </div>

          {/* CENTER: Prominent Dynamic Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by artisan, skill, craft, or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-warm-50 border border-warm-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink group-hover:border-pink-400 transition-all font-medium"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-brand-pink transition-colors" />
            </div>
          </div>

          {/* RIGHT: Dynamic Actions based on Role */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* 1. Normal User (Buyer) Actions */}
            {!isSister && (
              <>
                <button
                  onClick={() => setIsMyOrdersOpen(true)}
                  className="p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <Package className="w-5 h-5 text-gray-500" />
                  <span>Orders</span>
                  {activeOrdersCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] font-black rounded-full">
                      {activeOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-500" />
                  <span>Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#d81b60] text-white text-[10px] font-black rounded-full animate-bounce">
                      {totalItemsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* 2. Enrolled Sister Actions */}
            {isSister && (
              <>
                {/* My Dashboard Button */}
                <button
                  onClick={() => navigateTo('dashboard', null, 'shop')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                    currentView === 'dashboard' && dashboardTab === 'shop'
                      ? 'text-brand-pink bg-pink-50 ring-1 ring-pink-200'
                      : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-500" />
                  <span>My Dashboard</span>
                </button>

                {/* Requests Button (Automatically opens Service Requests tab) */}
                <button
                  onClick={() => navigateTo('dashboard', null, 'bookings')}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                    currentView === 'dashboard' && dashboardTab === 'bookings'
                      ? 'text-brand-pink bg-pink-50 ring-1 ring-pink-200'
                      : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                  }`}
                >
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  <span>Requests</span>
                  {activeBookingsCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#d81b60] text-white text-[10px] font-black rounded-full animate-pulse">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-0.5 shadow-sm shrink-0 select-none ${
                  isPro ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' : 'bg-warm-100 text-gray-600'
                }`}>
                  {isPro ? <Zap className="w-3 h-3 fill-white text-white" /> : null}
                  {isPro ? 'Udaan Pro' : 'Starter Tier'}
                </span>
              </>
            )}

            {/* 3. Global Profile Menu / Avatar and Switch Demo Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-warm-300 ring-2 ring-transparent hover:ring-pink-400 transition-all flex items-center justify-center bg-pink-100 text-pink-700 font-extrabold shadow-sm"
              >
                {currentUser.name.charAt(0)}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-warm-200 p-2 text-xs font-bold text-gray-700 animate-fade-in z-50">
                  <div className="px-3.5 py-2 border-b border-warm-100 text-gray-900 mb-1">
                    <p className="font-extrabold">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      toggleDemoRole();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-pink-50 hover:text-brand-pink rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>🔄 Switch to {isSister ? 'Buyer' : 'Sister'} View</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Action Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brand-pink rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu drop-down list */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-warm-200 animate-fade-in space-y-3 font-bold text-xs">
            <div className="flex flex-col gap-1 px-2">
              {!isSister ? (
                <>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsMyOrdersOpen(true); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-pink-50 rounded-xl flex items-center justify-between"
                  >
                    <span>Orders</span>
                    {activeOrdersCount > 0 && <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">{activeOrdersCount}</span>}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-pink-50 rounded-xl flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {totalItemsCount > 0 && <span className="bg-pink-100 text-brand-pink px-2 py-0.5 rounded-full font-black">{totalItemsCount}</span>}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigateTo('dashboard', null, 'shop'); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-pink-50 rounded-xl"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigateTo('dashboard', null, 'bookings'); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-pink-50 rounded-xl flex items-center justify-between"
                  >
                    <span>Service Requests</span>
                    {activeBookingsCount > 0 && <span className="bg-pink-100 text-brand-pink px-2 py-0.5 rounded-full font-black">{activeBookingsCount}</span>}
                  </button>
                </>
              )}
              
              <div className="border-t border-warm-150 my-2 pt-2" />
              
              <button
                onClick={() => { setIsMobileMenuOpen(false); toggleDemoRole(); }}
                className="w-full text-left px-4 py-2.5 hover:bg-pink-50 rounded-xl text-brand-pink"
              >
                🔄 Switch View to {isSister ? 'Buyer' : 'Sister'} Mode
              </button>

              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({currentUser.name})</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
