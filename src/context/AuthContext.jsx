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

  const loginWithGoogle = async (role = 'buyer') => {
    try {
      // Test if backend OAuth server is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await fetch('/auth/user', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        // Redirect to backend OAuth route
        window.location.href = `/auth/google?role=${role}`;
        return;
      }
    } catch (err) {
      // Backend offline or deployed on static host (Vercel)
    }

    // Client-side Google Sign-In Fallback
    const mockGoogleUser = {
      id: `google-${Date.now()}`,
      name: role === 'sister' ? 'Anjali Sharma' : 'Aarya Ingavale',
      email: role === 'sister' ? 'anjali.sharma@gmail.com' : 'aarya.ingavale@gmail.com',
      role: role,
      avatar: role === 'sister'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      subscription: 'free',
      sisterId: role === 'sister' ? 'sister-1' : null
    };

    setCurrentUser(mockGoogleUser);
    setCurrentView(role === 'sister' ? 'dashboard' : 'home');
    if (role === 'sister') {
      setDashboardTab('bookings');
    }
    setIsOnboardingModalOpen(role === 'buyer');
    return mockGoogleUser;
  };

  const login = (email, password, role = 'buyer') => {
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    let sisterId = null;
    if (role === 'sister') {
      sisterId = 'sister-1';
    }

    const user = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email,
      role,
      subscription: 'free',
      sisterId
    };

    setCurrentUser(user);
    setCurrentView(role === 'sister' ? 'dashboard' : 'home');
    if (role === 'sister') {
      setDashboardTab('bookings');
    }
    setIsOnboardingModalOpen(role === 'buyer');
    return user;
  };

  const register = (name, email, password, role = 'buyer') => {
    const user = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      subscription: 'free',
      sisterId: role === 'sister' ? 'sister-1' : null
    };

    setCurrentUser(user);
    setCurrentView(role === 'sister' ? 'dashboard' : 'home');
    if (role === 'sister') {
      setDashboardTab('bookings');
    }
    setIsOnboardingModalOpen(role === 'buyer');
    return user;
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
