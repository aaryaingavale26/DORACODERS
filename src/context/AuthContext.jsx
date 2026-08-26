import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const AUTH_STORAGE_KEY = 'udaan_auth_v5';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop-detail' | 'dashboard'
  const [activeSisterId, setActiveSisterId] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('bookings'); // 'bookings' | 'shop' | 'subscription'
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/auth/user', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const fetchedUser = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              avatar: data.user.profileImage,
              subscription: data.user.sisters?.[0]?.subscription || 'free',
              sisterId: data.user.sisters?.[0]?._id || data.user.sisters?.[0]?.id || null,
              sisterProfile: data.user.sisters?.[0] || null
            };
            setCurrentUser(fetchedUser);
            if (fetchedUser.role === 'sister') {
              setCurrentView('dashboard');
              setDashboardTab('bookings');
            } else {
              setCurrentView('home');
            }
            return;
          }
        }
      } catch (e) {
        // Backend auth offline, fallback to local storage
      }

      // Check localStorage
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          if (parsed.role === 'sister') {
            setCurrentView('dashboard');
            setDashboardTab('bookings');
          } else {
            setCurrentView('home');
          }
        } catch (err) {
          console.error("Failed to parse saved auth", err);
        }
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save auth state", e);
    }
  }, [currentUser]);

  const loginWithGoogle = async (role = 'buyer', customEmail = null, customName = null, customAvatar = null, customPhone = null) => {
    let finalEmail = customEmail?.trim();
    if (!finalEmail) {
      finalEmail = role === 'sister' ? 'sister.partner@gmail.com' : 'buyer.user@gmail.com';
    }
    
    let finalName = customName?.trim();
    if (!finalName) {
      const prefix = finalEmail.split('@')[0];
      finalName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    const finalPhone = customPhone?.trim() || "+91 98000 00000";
    const finalAvatar = customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalName)}`;
    const sisterId = `sister-usr-${Date.now()}`;

    const sisterProfile = role === 'sister' ? {
      id: sisterId,
      name: finalName,
      specialty: "Boutique Tailoring & Crafts",
      category: "tailoring",
      rating: 5.0,
      reviewsCount: 1,
      rate: 400,
      rateUnit: "/visit",
      avatar: finalAvatar,
      location: "Local Community Zone",
      experience: "Skilled artisan partner with verified qualifications.",
      phone: finalPhone,
      services: [
        { id: `s-1`, name: "Standard Doorstep Service", price: 400, duration: "60 mins" },
        { id: `s-2`, name: "Custom Consultation & Fitting", price: 500, duration: "75 mins" }
      ],
      badges: ["Skill Certified", "Newly Enrolled"]
    } : null;

    // Google User Profile with user's own email, name, and real phone
    const googleUser = {
      id: `google-${Date.now()}`,
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      role: role,
      avatar: finalAvatar,
      subscription: 'free',
      sisterId: role === 'sister' ? sisterId : null,
      sisterProfile
    };

    // Synchronize user into Monika's MongoDB Atlas database
    try {
      await fetch('/api/auth/google-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          phone: googleUser.phone,
          profileImage: googleUser.avatar,
          role: googleUser.role
        })
      })
      .then(r => r.json())
      .then(res => {
        if (res.user && res.user.id) {
          console.log("[MongoDB Atlas] Successfully registered user:", res.user);
        }
      })
      .catch(e => console.warn("MongoDB sync notification:", e));
    } catch (err) {}

    setCurrentUser(googleUser);
    setCurrentView(role === 'sister' ? 'dashboard' : 'home');
    if (role === 'sister') {
      setDashboardTab('bookings');
    }
    setIsOnboardingModalOpen(false);
    return googleUser;
  };

  const login = async (email, password, role = 'buyer') => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, role })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No account found with this email in MongoDB Atlas. Please register first.");
      }

      const user = {
        id: data.user?._id || `usr-${Date.now()}`,
        name: data.user?.name || cleanEmail.split('@')[0],
        email: data.user?.email || cleanEmail,
        phone: data.user?.phone || "+91 98000 00000",
        role: data.user?.role || role,
        avatar: data.user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user?.name || cleanEmail)}`,
        subscription: 'free',
        sisterId: data.user?.role === 'sister' ? (data.sisterProfile?._id || 'sister-1') : null
      };

      setCurrentUser(user);
      setCurrentView(user.role === 'sister' ? 'dashboard' : 'home');
      if (user.role === 'sister') {
        setDashboardTab('bookings');
      }
      setIsOnboardingModalOpen(false);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password, role = 'buyer', phone = '') => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone.trim() || "+91 98000 00000";

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, phone: cleanPhone, role })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "An account with this email already exists in MongoDB Atlas.");
      }

      const user = {
        id: data.user?._id || `usr-${Date.now()}`,
        name: data.user?.name || cleanName,
        email: data.user?.email || cleanEmail,
        phone: cleanPhone,
        role: data.user?.role || role,
        avatar: data.user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
        subscription: 'free',
        sisterId: data.user?.role === 'sister' ? (data.sisterProfile?._id || 'sister-1') : null
      };

      setCurrentUser(user);
      setCurrentView(user.role === 'sister' ? 'dashboard' : 'home');
      if (user.role === 'sister') {
        setDashboardTab('bookings');
      }
      setIsOnboardingModalOpen(false);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/auth/logout');
    } catch (e) {
      console.error("Failed backend logout", e);
    }
    setCurrentUser(null);
    setCurrentView('home');
    setActiveSisterId(null);
    setDashboardTab('bookings');
    setIsOnboardingModalOpen(false);
    setSearchQuery('');
  };

  const enrollCurrentAsSister = (sisterId) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: 'sister',
      sisterId
    };
    setCurrentUser(updated);
    setDashboardTab('shop');
    setCurrentView('dashboard');
    setIsOnboardingModalOpen(false);
  };

  const switchPlan = (tier) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      subscription: tier
    };
    setCurrentUser(updated);
  };

  const toggleDemoRole = () => {
    if (!currentUser) return;
    const isSister = currentUser.role === 'sister';
    const updated = {
      ...currentUser,
      role: isSister ? 'buyer' : 'sister',
      sisterId: isSister ? null : (currentUser.sisterId || 'sister-1')
    };
    setCurrentUser(updated);
    setCurrentView(isSister ? 'home' : 'dashboard');
    if (!isSister) {
      setDashboardTab('bookings');
    }
  };

  const navigateTo = (view, sisterId = null, tab = null) => {
    setCurrentView(view);
    if (sisterId) {
      setActiveSisterId(sisterId);
    } else if (view === 'home') {
      setActiveSisterId(null);
    }

    if (view === 'dashboard' && tab) {
      setDashboardTab(tab);
    }
  };

  const isAuthenticated = !!currentUser;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#d81b60]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      currentView,
      activeSisterId,
      dashboardTab,
      setDashboardTab,
      isOnboardingModalOpen,
      setIsOnboardingModalOpen,
      searchQuery,
      setSearchQuery,
      loginWithGoogle,
      login,
      register,
      logout,
      enrollCurrentAsSister,
      switchPlan,
      toggleDemoRole,
      navigateTo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
