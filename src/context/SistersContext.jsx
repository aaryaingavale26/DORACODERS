import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSisters, DEFAULT_USER_LOCATION } from '../data/initialSisters';
import { initialProducts } from '../data/products';
import confetti from 'canvas-confetti';

const SistersContext = createContext();

const SISTERS_STORAGE_KEY = 'udaan_sisters_v8';
const PRODUCTS_STORAGE_KEY = 'udaan_products_v8';
const LIKES_KEY = 'udaan_user_likes_v8';

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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
  const [userLocation, setUserLocation] = useState({
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    address: DEFAULT_USER_LOCATION.address,
    city: "Local Hub",
    isLiveGPS: false
  });

  // Sisters state - always ensure all initial sisters are loaded
  const [sisters, setSisters] = useState(() => {
    try {
      const saved = localStorage.getItem(SISTERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialSisters.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load sisters", e);
    }
    return initialSisters.map(s => ({
      ...s,
      subscription: s.subscription || 'free'
    }));
  });

  // Products state
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load products", e);
    }
    return initialProducts;
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState(25); // Default to 25km so all shops are visible
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('split');
  const [activeSisterOnMap, setActiveSisterOnMap] = useState(null);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedSisterForBooking, setSelectedSisterForBooking] = useState(null);
  const [selectedSisterForProfile, setSelectedSisterForProfile] = useState(null);
  const [selectedSisterForChat, setSelectedSisterForChat] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem(SISTERS_STORAGE_KEY, JSON.stringify(sisters));
  }, [sisters]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5500);
  };

  // Live polling for newly created sisters from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    const fetchLiveSisters = async () => {
      try {
        const res = await fetch('/api/sisters');
        if (res.ok) {
          const liveSisters = await res.json();
          if (Array.isArray(liveSisters) && liveSisters.length > 0 && isMounted) {
            setSisters(prev => {
              const existingIds = new Set(prev.map(s => String(s._id || s.id)));
              const newArrivals = liveSisters.filter(ls => !existingIds.has(String(ls._id || ls.id)));
              
              if (newArrivals.length > 0) {
                const latest = newArrivals[0];
                showToast(`🌟 New Sister Partner ${latest.name} (${latest.specialty}) just opened a shop near your area!`);
              }

              const mergedMap = new Map();
              prev.forEach(s => mergedMap.set(String(s._id || s.id), s));
              liveSisters.forEach(ls => {
                const key = String(ls._id || ls.id);
                mergedMap.set(key, {
                  ...ls,
                  id: key,
                  rating: ls.rating || 5.0,
                  reviewsCount: ls.reviewsCount || 1,
                  distance: ls.distance || '1.2 km away',
                  distanceKm: ls.distanceKm || 1.2
                });
              });
              return Array.from(mergedMap.values());
            });
          }
        }
      } catch (e) {
        console.warn("Atlas live sync:", e);
      }
    };

    fetchLiveSisters();
    const interval = setInterval(fetchLiveSisters, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Helper to place sisters around a coordinate clustered within 0.5km - 2.2km
  const repositionSistersAroundCoords = (lat, lng, cityName = "Your Neighborhood") => {
    setSisters(prev => {
      const baseSisters = prev.length >= initialSisters.length ? prev : initialSisters;
      return baseSisters.map((sister, idx) => {
        const angle = (idx / baseSisters.length) * Math.PI * 2;
        const dist = 0.5 + ((idx % 8) * 0.22) + ((idx % 3) * 0.1);
        const latOffset = (dist / 111) * Math.cos(angle);
        const lngOffset = (dist / (111 * Math.cos(lat * (Math.PI / 180)))) * Math.sin(angle);

        return {
          ...sister,
          coordinates: {
            lat: lat + latOffset,
            lng: lng + lngOffset
          },
          distance: `${dist.toFixed(1)} km away`,
          distanceKm: Number(dist.toFixed(1)),
          location: `${cityName} Zone`
        };
      });
    });
  };

  // Auto-detect location on initial load (IP Geolocation fallback + browser GPS)
  useEffect(() => {
    let isMounted = true;

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && data.latitude && data.longitude) {
          const detectedCity = data.city || data.region || "Your Local Area";
          setUserLocation({
            lat: data.latitude,
            lng: data.longitude,
            address: `${detectedCity}, ${data.country_name || 'India'}`,
            city: detectedCity,
            isLiveGPS: true
          });

          repositionSistersAroundCoords(data.latitude, data.longitude, detectedCity);
          showToast(`📍 Live Location Auto-Detected: ${detectedCity}`);
        }
      })
      .catch(err => {
        console.log("IP location fallback failed, using browser geolocation", err);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted) return;
          const { latitude, longitude } = pos.coords;
          setUserLocation(prev => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: "Live Device GPS",
            isLiveGPS: true
          }));
          repositionSistersAroundCoords(latitude, longitude, "Local GPS");
        },
        () => {},
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const detectLiveGPSLocation = () => {
    if (!navigator.geolocation) {
      showToast("⚠️ Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingGPS(true);
    showToast("🛰️ Detecting live device coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: "Exact Device GPS",
          city: "Live GPS",
          isLiveGPS: true
        });
        setIsLocatingGPS(false);
        repositionSistersAroundCoords(latitude, longitude, "Live GPS");
        showToast(`📍 GPS Locked: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`);
      },
      (error) => {
        console.error("GPS error:", error);
        setIsLocatingGPS(false);
        showToast("⚠️ Could not access device GPS. Using network location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const updateUserPinLocation = (newLat, newLng) => {
    setUserLocation(prev => ({
      ...prev,
      lat: newLat,
      lng: newLng,
      address: "Custom Pinned Zone"
    }));
    repositionSistersAroundCoords(newLat, newLng, "Custom Pinned");
  };

  const enrollSister = (formData) => {
    const distNum = Number(formData.distance) || 1.1;
    const angle = Math.random() * Math.PI * 2;
    const latOffset = (distNum / 111) * Math.cos(angle);
    const lngOffset = (distNum / (111 * Math.cos(userLocation.lat * (Math.PI / 180)))) * Math.sin(angle);
    const generatedId = `sister-${Date.now()}`;

    const newSister = {
      id: generatedId,
      name: formData.name,
      specialty: formData.specialty,
      category: formData.category || 'tailoring',
      rating: 5.0,
      reviewsCount: 1,
      rate: Number(formData.rate) || 350,
      rateUnit: formData.rateUnit || "/visit",
      likes: 1,
      isVerified: true,
      subscription: 'free',
      avatar: formData.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      distance: `${distNum.toFixed(1)} km away`,
      distanceKm: distNum,
      coordinates: {
        lat: userLocation.lat + latOffset,
        lng: userLocation.lng + lngOffset
      },
      location: formData.location || `${userLocation.city || 'Neighborhood'} Zone`,
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

    // Persist Sister Profile in MongoDB Atlas
    try {
      fetch('/api/sisters/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSister.name,
          specialty: newSister.specialty,
          category: newSister.category,
          rate: newSister.rate,
          rateUnit: newSister.rateUnit,
          avatar: newSister.avatar,
          distance: newSister.distance,
          distanceKm: newSister.distanceKm,
          location: newSister.location,
          experience: newSister.experience,
          phone: newSister.phone,
          availableDays: newSister.availableDays,
          timeSlots: newSister.timeSlots,
          services: newSister.services
        })
      })
      .then(r => r.json())
      .then(res => {
        if (res.sister) {
          console.log("[MongoDB Atlas] Sister successfully enrolled in database:", res.sister);
        }
      })
      .catch(e => console.warn("MongoDB sister sync notification:", e));
    } catch (err) {}

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`🎉 Congratulations! ${formData.name} is now enrolled as a verified Skilled Sister.`);
    setIsEnrollModalOpen(false);
    return generatedId;
  };

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

  // State Updates from Dashboard
  const updateSisterShop = (sisterId, fields) => {
    setSisters(prev =>
      prev.map(s => {
        if (s.id === sisterId) {
          return {
            ...s,
            ...fields
          };
        }
        return s;
      })
    );
    showToast("✨ Sister Shop details updated successfully!");
  };

  const addSisterService = (sisterId, service) => {
    setSisters(prev =>
      prev.map(s => {
        if (s.id === sisterId) {
          const currentServices = s.services || [];
          return {
            ...s,
            services: [...currentServices, { id: `s-${Date.now()}`, ...service }]
          };
        }
        return s;
      })
    );
    showToast("💼 Custom Service package added!");
  };

  const deleteSisterService = (sisterId, serviceId) => {
    setSisters(prev =>
      prev.map(s => {
        if (s.id === sisterId) {
          return {
            ...s,
            services: (s.services || []).filter(svc => svc.id !== serviceId)
          };
        }
        return s;
      })
    );
    showToast("🗑️ Service package removed.");
  };

  const addSisterProduct = (sisterId, product) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      sisterId,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      ...product
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast("🎨 Handmade craft product listed successfully!");
  };

  const deleteSisterProduct = (sisterId, productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast("🗑️ Product listing removed.");
  };

  const switchSisterPlan = (sisterId, tier) => {
    setSisters(prev =>
      prev.map(s => {
        if (s.id === sisterId) {
          return {
            ...s,
            subscription: tier
          };
        }
        return s;
      })
    );
    showToast(`🚀 Upgraded to Udaan ${tier === 'pro' ? 'Pro' : 'Starter'} plan!`);
  };

  const resetToSeedData = () => {
    setSisters(initialSisters.map(s => ({ ...s, subscription: s.subscription || 'free' })));
    setProducts(initialProducts);
    localStorage.removeItem(SISTERS_STORAGE_KEY);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    showToast("Reset to initial 16 skilled sister shops and craft catalogs.");
  };

  // Enhance sister with dynamic distances
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

  // Filtered & Sorted Sisters (Prioritize PRO tier!)
  const filteredSisters = dynamicSisters.filter(sister => {
    const hasSearch = searchQuery.trim().length > 0;

    if (!hasSearch && selectedCategory !== 'all' && sister.category !== selectedCategory) {
      return false;
    }

    if (sister.distanceKm !== undefined && sister.distanceKm > maxDistanceKm) {
      return false;
    }

    if (hasSearch) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = sister.name.toLowerCase().includes(q);
      const matchSpecialty = sister.specialty.toLowerCase().includes(q);
      const matchCategory = sister.category?.toLowerCase().includes(q);
      const matchLocation = sister.location?.toLowerCase().includes(q);
      const matchExperience = sister.experience?.toLowerCase().includes(q);
      const matchServices = sister.services?.some(s => s.name.toLowerCase().includes(q));
      const matchBadges = sister.badges?.some(b => b.toLowerCase().includes(q));
      const matchProducts = products.some(p => p.sisterId === sister.id && (
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.materials?.toLowerCase().includes(q)
      ));

      if (!matchName && !matchSpecialty && !matchCategory && !matchLocation && !matchExperience && !matchServices && !matchBadges && !matchProducts) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // 1. Subscription priority first
    const aPro = a.subscription === 'pro' ? 1 : 0;
    const bPro = b.subscription === 'pro' ? 1 : 0;
    if (bPro !== aPro) return bPro - aPro;

    // 2. Fallback to standard sorting
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
      products,
      userLocation,
      detectLiveGPSLocation,
      isLocatingGPS,
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
      updateSisterShop,
      addSisterService,
      deleteSisterService,
      addSisterProduct,
      deleteSisterProduct,
      switchSisterPlan,
      toastMessage,
      showToast
    }}>
      {children}
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
