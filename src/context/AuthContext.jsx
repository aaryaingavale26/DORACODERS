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
        const res = await fetch('/auth/user');
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
        } else {
          const saved = localStorage.getItem(AUTH_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setCurrentUser(parsed);
            if (parsed.role === 'sister') {
              setCurrentView('dashboard');
              setDashboardTab('bookings');
            } else {
              setCurrentView('home');
            }
          }
        }
      } catch (e) {
        console.warn("Backend auth unavailable, using offline mock state", e);
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          if (parsed.role === 'sister') {
            setCurrentView('dashboard');
            setDashboardTab('bookings');
          } else {
            setCurrentView('home');
          }
        }
      } finally {
        setLoading(false);
      }
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

  const login = (email, password, role = 'buyer') => {
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    let sisterId = null;
    if (role === 'sister') {
      sisterId = 'sister-1'; // Default to first mock sister
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
      sisterId: null
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
