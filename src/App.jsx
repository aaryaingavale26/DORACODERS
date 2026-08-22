import React from 'react';
import { SistersProvider } from './context/SistersContext';
import { BookingProvider } from './context/BookingContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SistersSection from './components/sisters/SistersSection';
import ProductsSection from './components/products/ProductsSection';
import ImpactSection from './components/impact/ImpactSection';
import Footer from './components/Footer';
import CartDrawer from './components/products/CartDrawer';
import MyBookingsModal from './components/bookings/MyBookingsModal';
import OrderTrackingModal from './components/orders/OrderTrackingModal';

export default function App() {
  return (
    <SistersProvider>
      <BookingProvider>
        <CartProvider>
          <OrdersProvider>
            <div className="min-h-screen flex flex-col bg-[#faf7f5] text-[#2c2420]">
              <Navbar />
              <main className="flex-1">
                <Hero />
                <SistersSection />
                <ProductsSection />
                <ImpactSection />
              </main>
              <Footer />

              {/* Global Drawers & Modals */}
              <CartDrawer />
              <MyBookingsModal />
              <OrderTrackingModal />
            </div>
          </OrdersProvider>
        </CartProvider>
      </BookingProvider>
    </SistersProvider>
  );
}
