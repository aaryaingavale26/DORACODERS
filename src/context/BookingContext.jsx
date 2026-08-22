import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const BookingContext = createContext();
const BOOKINGS_KEY = 'udaan_bookings_v2';

const initialSampleBookings = [
  {
    id: "bk-1001",
    bookingRef: "UD-94821",
    sisterId: "sister-1",
    sisterName: "Anjali Sharma",
    specialty: "Boutique Tailoring",
    serviceName: "Designer Blouse Stitching",
    amount: 450,
    visitFee: 50,
    totalAmount: 500,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: "Morning (9 AM - 12 PM)",
    customerName: "Radha Verma",
    customerPhone: "+91 98765 11223",
    customerAddress: "Flat 302, Palm Heights, Sector 14",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  }
];

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load bookings", e);
    }
    return initialSampleBookings;
  });

  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings", e);
    }
  }, [bookings]);

  const createBooking = (bookingData) => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingRef: `UD-${randomCode}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...bookingData
    };

    setBookings(prev => [newBooking, ...prev]);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      cancelBooking,
      isMyBookingsOpen,
      setIsMyBookingsOpen
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
