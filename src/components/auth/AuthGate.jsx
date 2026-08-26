import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, Heart, User, Lock, Mail, ArrowRight, X, CheckCircle2 } from 'lucide-react';

function decodeJwtResponse(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function AuthGate() {
  const { loginWithGoogle, login, register } = useAuth();
  const [role, setRole] = useState('buyer'); // 'buyer' | 'sister'
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Google Account Prompt Modal state
  const [isGooglePromptOpen, setIsGooglePromptOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Email / Password Form state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Error banner state
  const [authError, setAuthError] = useState('');

  // Initialize official Google Identity Services if client ID is configured
  useEffect(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id',
          callback: async (response) => {
            if (response.credential) {
              const payload = decodeJwtResponse(response.credential);
              if (payload && payload.email) {
                setIsSigningIn(true);
                try {
                  await loginWithGoogle(role, payload.email, payload.name, payload.picture);
                } catch (e) {
                  setAuthError("Google authentication failed.");
                } finally {
                  setIsSigningIn(false);
                }
              }
            }
          }
        });
      } catch (e) {}
    }
  }, [role]);

  const handleOpenGooglePrompt = () => {
    setAuthError('');
    // If official Google prompt is available with real client ID, try prompt
    if (window.google?.accounts?.id && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsGooglePromptOpen(true);
        }
      });
    } else {
      setIsGooglePromptOpen(true);
    }
  };

  const handleConfirmGoogleLogin = async (e) => {
    e?.preventDefault();
    if (!googleEmail.trim()) return;

    setAuthError('');
    setIsSigningIn(true);
    try {
      await loginWithGoogle(role, googleEmail.trim(), googleName.trim());
      setIsGooglePromptOpen(false);
    } catch (err) {
      console.error("Google Auth failed", err);
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setAuthError('');
    setIsSigningIn(true);
    try {
      if (isRegisterMode) {
        await register(name.trim() || email.split('@')[0], email.trim(), password, role);
      } else {
        await login(email.trim(), password, role);
      }
    } catch (err) {
      console.error("Auth failed:", err);
      setAuthError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-warm-200">
        
        {/* Left Info Panel */}
        <div className="bg-gradient-to-tr from-pink-900 via-[#831843] to-pink-850 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background overlay decorations */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white text-pink-900 flex items-center justify-center shadow-lg font-serif text-2xl font-bold italic">
                u
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight">udaan</span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-pink-300 -mt-1">
                  Empowering Women
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif leading-tight mt-6">
              Empowering Rural Artisans & Skilled Sisters
            </h1>
            <p className="text-pink-100 text-sm mt-4 leading-relaxed font-light">
              Connecting local service providers and craft weavers directly to customers with zero platform commissions.
            </p>
          </div>

          <div className="space-y-4 z-10 pt-8 border-t border-white/10 mt-8">
            <div className="flex items-center gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-pink-300 shrink-0" />
              <span>100% Direct Bank Transfer to Rural Women</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Heart className="w-5 h-5 text-pink-300 shrink-0" />
              <span>3,500+ Active Self-Help Groups Supported</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Sparkles className="w-5 h-5 text-pink-300 shrink-0" />
              <span>Skill Validation & Pricing Transparency</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-gray-900">
              Welcome to Udaan
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select your role and sign in securely to start
            </p>
          </div>

          {/* Error Alert Box */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
              <span className="text-red-500 font-bold shrink-0 text-sm">⚠️</span>
              <div className="flex-1 font-medium leading-relaxed">{authError}</div>
              <button onClick={() => setAuthError('')} className="text-red-400 hover:text-red-600 font-bold ml-1">✕</button>
            </div>
          )}

          <div className="space-y-5">
            
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                    role === 'buyer'
                      ? 'bg-pink-50 border-[#d81b60] text-[#d81b60] shadow-sm ring-1 ring-[#d81b60]'
                      : 'bg-white border-warm-300 text-gray-600 hover:bg-warm-50'
                  }`}
                >
                  <span className="text-lg">🛍️</span>
                  <span>Buyer / Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('sister')}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                    role === 'sister'
                      ? 'bg-pink-50 border-[#d81b60] text-[#d81b60] shadow-sm ring-1 ring-[#d81b60]'
                      : 'bg-white border-warm-300 text-gray-600 hover:bg-warm-50'
                  }`}
                >
                  <span className="text-lg">👩‍🔧</span>
                  <span>Skilled Sister</span>
                </button>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleOpenGooglePrompt}
              className="w-full bg-white border-2 border-warm-300 hover:border-pink-400 hover:bg-pink-50/50 text-gray-800 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.78 2.93C6.18 7.37 8.87 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.42-4.94 3.42-8.61z"/>
                <path fill="#FBBC05" d="M5.26 10.51c-.24-.73-.38-1.5-.38-2.3 0-.8.14-1.57.38-2.3L1.48 3.51C.53 5.41 0 7.54 0 9.8s.53 4.39 1.48 6.29l3.78-2.93a7.87 7.87 0 010-4.65z"/>
                <path fill="#34A853" d="M12 18.96c-3.13 0-5.82-2.33-6.74-5.47l-3.78 2.93C3.37 20.32 7.35 23 12 23c3.24 0 6.06-1.07 8.08-2.91l-3.71-2.88c-1.1.74-2.5 1.18-4.37 1.18z"/>
              </svg>
              <span className="group-hover:text-pink-900">Continue with Google as {role === 'sister' ? 'Sister' : 'Buyer'}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-warm-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">or sign in with password</span>
              <div className="flex-grow border-t border-warm-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isRegisterMode && (
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Your Email (e.g. monika@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span>{isRegisterMode ? 'Create New Account' : 'Sign In with Email'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-[11px] text-pink-700 hover:text-pink-900 font-bold"
              >
                {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {isGooglePromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-warm-200 relative space-y-4">
            
            <button
              onClick={() => setIsGooglePromptOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 mb-1">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.78 2.93C6.18 7.37 8.87 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.42-4.94 3.42-8.61z"/>
                  <path fill="#FBBC05" d="M5.26 10.51c-.24-.73-.38-1.5-.38-2.3 0-.8.14-1.57.38-2.3L1.48 3.51C.53 5.41 0 7.54 0 9.8s.53 4.39 1.48 6.29l3.78-2.93a7.87 7.87 0 010-4.65z"/>
                  <path fill="#34A853" d="M12 18.96c-3.13 0-5.82-2.33-6.74-5.47l-3.78 2.93C3.37 20.32 7.35 23 12 23c3.24 0 6.06-1.07 8.08-2.91l-3.71-2.88c-1.1.74-2.5 1.18-4.37 1.18z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-serif">
                Sign in with Google
              </h3>
              <p className="text-xs text-gray-500">
                to continue to <strong className="text-[#d81b60]">Udaan ({role === 'sister' ? 'Skilled Sister' : 'Buyer'})</strong>
              </p>
            </div>

            {/* Google Input Form */}
            <form onSubmit={handleConfirmGoogleLogin} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name (e.g. Monika Sharma)"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#d81b60]/30 focus:border-[#d81b60]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Google / Gmail Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#d81b60]/30 focus:border-[#d81b60]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSigningIn || !googleEmail.trim()}
                  className="w-full bg-[#1a73e8] hover:bg-[#1558b0] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSigningIn ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  ) : (
                    <>
                      <span>Continue to Udaan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center pt-1 leading-relaxed">
                Your profile will be synchronized into the MongoDB Atlas <code className="text-gray-600 font-mono">doracoders</code> cluster.
              </p>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
