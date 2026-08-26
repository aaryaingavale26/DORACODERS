import React from 'react';
import { SistersProvider, useSisters } from './context/SistersContext';
import { BookingProvider } from './context/BookingContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SistersSection from './components/sisters/SistersSection';
import ImpactSection from './components/impact/ImpactSection';
import Footer from './components/Footer';
import CartDrawer from './components/products/CartDrawer';
import MyBookingsModal from './components/bookings/MyBookingsModal';
import SisterBookingModal from './components/sisters/SisterBookingModal';
import OrderTrackingModal from './components/orders/OrderTrackingModal';
import AuthGate from './components/auth/AuthGate';
import SisterDashboard from './components/dashboard/SisterDashboard';
import SisterShopDetail from './components/sisters/SisterShopDetail';

function AppContent() {
  const { 
    isAuthenticated, 
    currentView, 
    isOnboardingModalOpen, 
    setIsOnboardingModalOpen 
  } = useAuth();
  const { setIsEnrollModalOpen } = useSisters();

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f5] text-[#2c2420]">
      <Navbar />
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <SistersSection />
            <ImpactSection />
          </>
        )}
        {currentView === 'shop-detail' && <SisterShopDetail />}
        {currentView === 'dashboard' && <SisterDashboard />}
      </main>
      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <MyBookingsModal />
      <OrderTrackingModal />
      <SisterBookingModal />

      {/* Onboarding Modal step */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-pink-100 text-center animate-fade-in space-y-4">
            <div className="w-16 h-16 bg-pink-100 text-brand-pink rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
              🎉
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900">
              Welcome to Udaan!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Do you want to enroll as a Skilled Sister on Udaan and offer services or handmade products to clients in your local neighborhood?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsOnboardingModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all"
              >
                No, I want to Browse
              </button>
              <button
                onClick={() => {
                  setIsOnboardingModalOpen(false);
                  setIsEnrollModalOpen(true);
                }}
                className="flex-1 py-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-600/25 active:scale-95"
              >
                Yes, Enroll Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SistersProvider>
        <BookingProvider>
          <CartProvider>
            <OrdersProvider>
              <AppContent />
            </OrdersProvider>
          </CartProvider>
        </BookingProvider>
      </SistersProvider>
    </AuthProvider>
  );
}
