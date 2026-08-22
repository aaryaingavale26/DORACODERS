import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSisters, DEFAULT_USER_LOCATION } from '../data/initialSisters';
import confetti from 'canvas-confetti';

const SistersContext = createContext();

const STORAGE_KEY = 'udaan_sisters_v4';
const LIKES_KEY = 'udaan_user_likes_v4';

// Popular Indian City Presets with real coordinates
export const CITY_PRESETS = [
  { id: 'jaipur', name: 'Jaipur (Rajasthan)', lat: 26.9124, lng: 75.7873 },
  { id: 'delhi', name: 'Delhi NCR (South Ex)', lat: 28.5700, lng: 77.2200 },
  { id: 'mumbai', name: 'Mumbai (Bandra/Dadar)', lat: 19.0596, lng: 72.8295 },
  { id: 'bengaluru', name: 'Bengaluru (Indiranagar)', lat: 12.9716, lng: 77.5946 },
  { id: 'lucknow', name: 'Lucknow (Hazratganj)', lat: 26.8467, lng: 80.9462 },
  { id: 'kolkata', name: 'Kolkata (Park Street)', lat: 22.5500, lng: 88.3500 },
  { id: 'hyderabad', name: 'Hyderabad (Banjara Hills)', lat: 17.4126, lng: 78.4346 },
  { id: 'pune', name: 'Pune (Kothrud/Viman Nagar)', lat: 18.5204, lng: 73.8567 },
];

// Haversine formula to calculate accurate real-time distance in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function SistersProvider({ children }) {
  // User's live real-time location
  const [userLocation, setUserLocation] = useState({
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    address: DEFAULT_USER_LOCATION.address,
    isLiveGPS: false
  });

  const [selectedCityId, setSelectedCityId] = useState('jaipur');

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
  const [maxDistanceKm, setMaxDistanceKm] = useState(5); // 3, 5, 10, 50
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'rating', 'price-asc', 'price-desc', 'likes', 'distance'
  const [viewMode, setViewMode] = useState('split'); // 'grid', 'map', 'split'
  const [activeSisterOnMap, setActiveSisterOnMap] = useState(null);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

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

  // Real-time GPS Detection
  const detectLiveGPSLocation = () => {
    if (!navigator.geolocation) {
      showToast("⚠️ Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingGPS(true);
    showToast("🛰️ Detecting your real-time GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: "Current GPS Location",
          isLiveGPS: true
        });
        setIsLocatingGPS(false);
        showToast("📍 Live GPS Location detected! Recalculating nearby sisters.");

        // Automatically position surrounding sisters around the user's real GPS coordinates
        setSisters(prev =>
          prev.map((sister, idx) => {
            const angle = (idx / prev.length) * Math.PI * 2;
            const dist = sister.distanceKm || (0.8 + idx * 0.4);
            const latOffset = (dist / 111) * Math.cos(angle);
            const lngOffset = (dist / (111 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(angle);

            return {
              ...sister,
              coordinates: {
                lat: latitude + latOffset,
                lng: longitude + lngOffset
              },
              distance: `${dist.toFixed(1)} km away`,
              distanceKm: dist
            };
          })
        );
      },
      (error) => {
        console.error("GPS error:", error);
        setIsLocatingGPS(false);
        showToast("⚠️ Could not access GPS. Please allow location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Switch City Preset
  const switchCity = (cityId) => {
    const city = CITY_PRESETS.find(c => c.id === cityId);
    if (!city) return;

    setSelectedCityId(cityId);
    setUserLocation({
      lat: city.lat,
      lng: city.lng,
      address: city.name,
      isLiveGPS: false
    });

    // Reposition sisters around new city center
    setSisters(prev =>
      prev.map((sister, idx) => {
        const angle = (idx / prev.length) * Math.PI * 2;
        const dist = 0.8 + (idx * 0.45);
        const latOffset = (dist / 111) * Math.cos(angle);
        const lngOffset = (dist / (111 * Math.cos(city.lat * (Math.PI / 180)))) * Math.sin(angle);

        return {
          ...sister,
          coordinates: {
            lat: city.lat + latOffset,
            lng: city.lng + lngOffset
          },
          distance: `${dist.toFixed(1)} km away`,
          distanceKm: dist,
          location: `${city.name.split(' ')[0]} Neighborhood Zone`
        };
      })
    );

    showToast(`📍 Switched to ${city.name}. Showing local verified sisters.`);
  };

  // Move user location manually (e.g. dragging pin)
  const updateUserPinLocation = (newLat, newLng) => {
    setUserLocation(prev => ({
      ...prev,
      lat: newLat,
      lng: newLng,
      address: "Custom Pinned Zone"
    }));
  };

  // Enroll new sister
  const enrollSister = (formData) => {
    const distNum = Number(formData.distance) || 1.2;
    const angle = Math.random() * Math.PI * 2;
    const latOffset = (distNum / 111) * Math.cos(angle);
    const lngOffset = (distNum / (111 * Math.cos(userLocation.lat * (Math.PI / 180)))) * Math.sin(angle);

    const newSister = {
      id: `sister-${Date.now()}`,
      name: formData.name,
      specialty: formData.specialty,
      category: formData.category || 'tailoring',
      rating: 5.0,
      reviewsCount: 1,
      rate: Number(formData.rate) || 350,
      rateUnit: formData.rateUnit || "/visit",
      likes: 1,
      isVerified: true,
      avatar: formData.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      distance: `${distNum.toFixed(1)} km away`,
      distanceKm: distNum,
      coordinates: {
        lat: userLocation.lat + latOffset,
        lng: userLocation.lng + lngOffset
      },
      location: formData.location || `${userLocation.address} Zone`,
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

  // Like / favorite
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

  // Reset to default seed data
  const resetToSeedData = () => {
    setSisters(initialSisters);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Reset to initial skilled sisters.");
  };

  // Dynamically calculate distance from current real-time userLocation
  const dynamicSisters = sisters.map(sister => {
    if (sister.coordinates) {
      const realDist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        sister.coordinates.lat,
        sister.coordinates.lng
      );
      return {
        ...sister,
        distanceKm: realDist,
        distance: `${realDist.toFixed(1)} km away`
      };
    }
    return sister;
  });

  // Computed filtered & sorted sisters
  const filteredSisters = dynamicSisters.filter(sister => {
    if (selectedCategory !== 'all' && sister.category !== selectedCategory) {
      return false;
    }

    if (sister.distanceKm !== undefined && sister.distanceKm > maxDistanceKm) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sister.name.toLowerCase().includes(q);
      const matchSpecialty = sister.specialty.toLowerCase().includes(q);
      const matchLocation = sister.location?.toLowerCase().includes(q);
      const matchServices = sister.services?.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchSpecialty && !matchLocation && !matchServices) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.rate - b.rate;
    if (sortBy === 'price-desc') return b.rate - a.rate;
    if (sortBy === 'likes') return b.likes - a.likes;
    return 0;
  });

  return (
    <SistersContext.Provider value={{
      sisters: dynamicSisters,
      filteredSisters,
      userLocation,
      detectLiveGPSLocation,
      isLocatingGPS,
      switchCity,
      selectedCityId,
      updateUserPinLocation,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      maxDistanceKm,
      setMaxDistanceKm,
      sortBy,
      setSortBy,
      viewMode,
      setViewMode,
      activeSisterOnMap,
      setActiveSisterOnMap,
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
