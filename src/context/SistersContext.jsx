import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSisters } from '../data/initialSisters';
import confetti from 'canvas-confetti';

const SistersContext = createContext();

const STORAGE_KEY = 'udaan_sisters_v2';
const LIKES_KEY = 'udaan_user_likes_v2';

export function SistersProvider({ children }) {
  const [sisters, setSisters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load sisters from localStorage", e);
    }
    return initialSisters;
  });

  const [userLikes, setUserLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load likes", e);
    }
    return {};
  });

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState(5);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'rating', 'price-asc', 'price-desc', 'likes'

  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedSisterForBooking, setSelectedSisterForBooking] = useState(null);
  const [selectedSisterForProfile, setSelectedSisterForProfile] = useState(null);
  const [selectedSisterForChat, setSelectedSisterForChat] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sisters));
    } catch (e) {
      console.error("Failed to save sisters", e);
    }
  }, [sisters]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes));
    } catch (e) {
      console.error("Failed to save likes", e);
    }
  }, [userLikes]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Enroll new sister
  const enrollSister = (formData) => {
    const newSister = {
      id: `sister-${Date.now()}`,
      name: formData.name,
      specialty: formData.specialty,
      category: formData.category || 'tailoring',
      rating: 5.0,
      reviewsCount: 1,
      rate: Number(formData.rate) || 350,
      rateUnit: "/visit",
      likes: 1,
      isVerified: true,
      avatar: formData.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      distance: `${formData.distance || '0.9'} km away`,
      location: formData.location || "Local Community Zone",
      experience: formData.experience || "Skilled professional with dedicated local training.",
      phone: formData.phone || "+91 98000 00000",
      availableDays: formData.availableDays?.length ? formData.availableDays : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      timeSlots: formData.timeSlots?.length ? formData.timeSlots : ["Morning (9 AM - 1 PM)", "Afternoon (2 PM - 6 PM)"],
      services: formData.services?.length ? formData.services : [
        { id: `s-${Date.now()}-1`, name: `${formData.specialty} Standard Service`, price: Number(formData.rate) || 350, duration: "60 mins" },
        { id: `s-${Date.now()}-2`, name: "Consultation & Custom Work", price: Number(formData.rate) + 150 || 500, duration: "90 mins" }
      ],
      badges: ["Newly Enrolled", "Skill Verified", "Self-Empowered"],
      enrolledDate: new Date().toISOString().split('T')[0]
    };

    setSisters(prev => [newSister, ...prev]);

    // Celebrate
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`🎉 Congratulations! ${formData.name} is now enrolled as a verified Skilled Sister.`);
    setIsEnrollModalOpen(false);
  };

  // Like / favorite a sister
  const toggleLike = (sisterId) => {
    const isLiked = !!userLikes[sisterId];
    setUserLikes(prev => ({
      ...prev,
      [sisterId]: !isLiked
    }));

    setSisters(prev =>
      prev.map(s => {
        if (s.id === sisterId) {
          return {
            ...s,
            likes: isLiked ? Math.max(0, s.likes - 1) : s.likes + 1
          };
        }
        return s;
      })
    );
  };

  // Reset to default seed data if needed
  const resetToSeedData = () => {
    setSisters(initialSisters);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Reset to initial skilled sisters.");
  };

  // Computed filtered & sorted sisters
  const filteredSisters = sisters.filter(sister => {
    // Category filter
    if (selectedCategory !== 'all' && sister.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sister.name.toLowerCase().includes(q);
      const matchSpecialty = sister.specialty.toLowerCase().includes(q);
      const matchLocation = sister.location.toLowerCase().includes(q);
      const matchServices = sister.services?.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchSpecialty && !matchLocation && !matchServices) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.rate - b.rate;
    if (sortBy === 'price-desc') return b.rate - a.rate;
    if (sortBy === 'likes') return b.likes - a.likes;
    return 0; // featured default order
  });

  return (
    <SistersContext.Provider value={{
      sisters,
      filteredSisters,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      maxDistanceKm,
      setMaxDistanceKm,
      sortBy,
      setSortBy,
      userLikes,
      toggleLike,
      enrollSister,
      resetToSeedData,
      isEnrollModalOpen,
      setIsEnrollModalOpen,
      selectedSisterForBooking,
      setSelectedSisterForBooking,
      selectedSisterForProfile,
      setSelectedSisterForProfile,
      selectedSisterForChat,
      setSelectedSisterForChat,
      toastMessage,
      showToast
    }}>
      {children}
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231b15] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-pink-500/30 animate-fade-in">
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-gray-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}
    </SistersContext.Provider>
  );
}

export function useSisters() {
  const context = useContext(SistersContext);
  if (!context) {
    throw new Error('useSisters must be used within a SistersProvider');
  }
  return context;
}
