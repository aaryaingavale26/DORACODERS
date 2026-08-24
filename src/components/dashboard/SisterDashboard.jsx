import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSisters } from '../../context/SistersContext';
import { useBookings } from '../../context/BookingContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Plus, 
  Trash2, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Edit3, 
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SisterDashboard() {
  const { currentUser, switchPlan, toggleDemoRole } = useAuth();
  const { 
    sisters, 
    products, 
    updateSisterShop, 
    addSisterService, 
    deleteSisterService, 
    addSisterProduct, 
    deleteSisterProduct,
    switchSisterPlan
  } = useSisters();
  const { bookings, updateBookingStatus } = useBookings();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'shop' | 'subscription'
  
  // Find current sister profile
  const sister = sisters.find(s => s.id === currentUser?.sisterId);

  // Shop Management State
  const [specialty, setSpecialty] = useState(sister?.specialty || '');
  const [rate, setRate] = useState(sister?.rate || '');
  const [experience, setExperience] = useState(sister?.experience || '');
  const [location, setLocation] = useState(sister?.location || '');
  const [category, setCategory] = useState(sister?.category || 'tailoring');

  // Add Service Form
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('60 mins');

  // Add Product Form
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // AI Pricing Assistant State
  const [aiServiceName, setAiServiceName] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);

  if (!sister) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold font-serif text-gray-800">No Enrolled Sister Profile Linked</h3>
        <p className="text-xs text-gray-500 mt-1">Please log out and enroll as a Skilled Sister or toggle your role.</p>
        <button 
          onClick={toggleDemoRole}
          className="mt-4 px-6 py-2.5 bg-brand-pink text-white rounded-xl text-xs font-bold"
        >
          Toggle to Sister Role
        </button>
      </div>
    );
  }

  const isPro = currentUser?.subscription === 'pro' || sister.subscription === 'pro';

  // Filter bookings for this sister
  const sisterBookings = bookings.filter(b => b.sisterId === sister.id);
  const activeBookings = sisterBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress');
  
  // Filter products for this sister
  const sisterProducts = products.filter(p => p.sisterId === sister.id);

  // Listing Limit Checks
  const totalListings = (sister.services?.length || 0) + sisterProducts.length;
  const listingLimitReached = !isPro && totalListings >= 3;

  // Earnings calculations (Only from Completed bookings)
  const completedBookings = sisterBookings.filter(b => b.status === 'Completed');
  const grossEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || b.amount), 0);
  const platformFeeRate = isPro ? 0 : 0.05;
  const platformFee = grossEarnings * platformFeeRate;
  const netEarnings = grossEarnings - platformFee;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateSisterShop(sister.id, {
      specialty,
      rate: Number(rate),
      experience,
      location,
      category
    });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (listingLimitReached) {
      alert("⚠️ Free Tier Limit Reached! You can only list up to 3 services/products in total. Upgrade to Udaan Pro for unlimited listings.");
      return;
    }
    if (!svcName.trim() || !svcPrice) return;
    addSisterService(sister.id, {
      name: svcName.trim(),
      price: Number(svcPrice),
      duration: svcDuration
    });
    setSvcName('');
    setSvcPrice('');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (listingLimitReached) {
      alert("⚠️ Free Tier Limit Reached! You can only list up to 3 services/products in total. Upgrade to Udaan Pro for unlimited listings.");
      return;
    }
    if (!prodName.trim() || !prodPrice || !prodImage.trim()) {
      alert("Please fill in Product Name, Price, and Image URL.");
      return;
    }
    addSisterProduct(sister.id, {
      name: prodName.trim(),
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : null,
      image: prodImage.trim(),
      description: prodDesc.trim() || "Handmade with love by rural skilled artisans.",
      artisan: sister.name,
      state: sister.location
    });
    setProdName('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdImage('');
    setProdDesc('');
  };

  const handleUpgrade = (tier) => {
    switchPlan(tier);
    switchSisterPlan(sister.id, tier);
  };

  const handleGetAiSuggestion = (e) => {
    e.preventDefault();
    if (!aiServiceName.trim()) return;

    let range = "₹350 - ₹600";
    let text = "Based on local market trends for similar services in Jaipur & Delhi NCR, clients are 3x more likely to book services in this range. Pricing at ₹450 is recommended for maximum booking conversions.";

    const query = aiServiceName.toLowerCase();
    if (query.includes('bridal') || query.includes('lehenga') || query.includes('heavy') || query.includes('wedding')) {
      range = "₹1,500 - ₹3,000";
      text = "Premium wedding packages are highly sought after. Direct WhatsApp integration badge enables custom high-ticket client chats. We recommend setting a premium rate with raw material inclusions.";
    } else if (query.includes('blouse') || query.includes('kurti') || query.includes('stitch')) {
      range = "₹400 - ₹750";
      text = "Stitching services face regular demand. Customers prefer home pick-and-drop fitting. Adding a minor visit charge is recommended.";
    } else if (query.includes('henna') || query.includes('mehendi') || query.includes('hand')) {
      range = "₹350 - ₹1,200";
      text = "Mehendi pricing scales with design complexity. We suggest listing Arabic minimalist packages at ₹350 and bridal packages at ₹2,100.";
    } else if (query.includes('cook') || query.includes('tiffin') || query.includes('meal')) {
      range = "₹200 - ₹500";
      text = "Food services benefit from recurring daily contracts. Propose a weekly trial package to acquire recurring customers.";
    }

    setAiSuggestion({ range, text });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* SaaS Upgrade Promo Banner for Free tier */}
      {!isPro && (
        <div className="mb-8 bg-gradient-to-r from-amber-500 via-[#d81b60] to-pink-900 text-white rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Zap className="w-8 h-8 text-yellow-300 shrink-0 fill-yellow-300 hidden md:block" />
            <div>
              <h4 className="font-bold text-sm sm:text-base">Upgrade to Udaan Pro today!</h4>
              <p className="text-xs text-pink-100">Get 3x more client bookings, priority search/map listing, and zero platform commission on completed visits.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('subscription')}
            className="bg-white hover:bg-pink-50 text-pink-900 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow transition-all active:scale-95 whitespace-nowrap"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Dashboard Top Header Block */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img 
            src={sister.avatar} 
            alt={sister.name} 
            className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-pink"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">{sister.name}'s Dashboard</h1>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm ${
                isPro ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' : 'bg-warm-100 text-gray-600'
              }`}>
                {isPro ? '★ PRO PARTNER' : 'STARTER TIER'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{sister.specialty} • {sister.location}</p>
          </div>
        </div>

        {/* Demo Roles Toggle button */}
        <button
          onClick={toggleDemoRole}
          className="px-5 py-2.5 border border-warm-300 hover:border-pink-300 hover:bg-pink-50 text-gray-700 hover:text-brand-pink rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          🔄 Switch to Buyer View
        </button>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Tab Navigation Column */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-warm-200 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'bookings'
                  ? 'bg-pink-50 text-brand-pink border-l-4 border-brand-pink'
                  : 'text-gray-600 hover:bg-warm-50'
              }`}
            >
              <span>📅 Service Requests</span>
              {activeBookings.length > 0 && (
                <span className="w-5 h-5 bg-[#d81b60] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'shop'
                  ? 'bg-pink-50 text-brand-pink border-l-4 border-brand-pink'
                  : 'text-gray-600 hover:bg-warm-50'
              }`}
            >
              <span>🛍️ My Shopfront Manager</span>
              <span className="text-[10px] text-gray-400 font-semibold bg-warm-100 px-2 py-0.5 rounded-full">
                {totalListings} listings
              </span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'subscription'
                  ? 'bg-pink-50 text-brand-pink border-l-4 border-brand-pink'
                  : 'text-gray-600 hover:bg-warm-50'
              }`}
            >
              <span>💎 Earnings & Plan Tiers</span>
              {isPro && <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            </button>
          </div>
        </div>

        {/* Right Side Content Body (9 cols) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: Service Requests (incoming bookings) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <h3 className="text-lg font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-pink" />
                  Client Doorstep Service Bookings
                </h3>

                {sisterBookings.length === 0 ? (
                  <div className="text-center py-12 bg-warm-50 rounded-2xl p-6 border border-warm-200">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No booking requests received yet. Enhance your shop listings to attract clients!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sisterBookings.map(booking => {
                      const isCompleted = booking.status === 'Completed';
                      const isCancelled = booking.status === 'Cancelled';
                      const isConfirm = booking.status === 'Confirmed';
                      const isInProgress = booking.status === 'In Progress';

                      return (
                        <div 
                          key={booking.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isCompleted ? 'bg-emerald-50/20 border-emerald-250' : 
                            isCancelled ? 'bg-gray-50 border-gray-200 opacity-60' : 
                            'bg-white border-warm-200 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap mb-3 border-b border-warm-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                                  {booking.bookingRef}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800' :
                                  isCancelled ? 'bg-gray-100 text-gray-600' :
                                  isInProgress ? 'bg-blue-150 text-blue-800' : 'bg-pink-100 text-pink-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-gray-900 mt-2">{booking.serviceName}</h4>
                              <p className="text-[11px] text-gray-500">Booked by client: <strong className="text-gray-800">{booking.customerName}</strong></p>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-extrabold text-pink-700 block">
                                {formatCurrency(booking.totalAmount || booking.amount)}
                              </span>
                              <span className="text-[10px] text-gray-400">COD (Pay after service)</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 bg-warm-50/70 p-3 rounded-xl mb-4">
                            <div>📅 Date: <strong className="text-gray-850">{booking.date}</strong></div>
                            <div>🕒 Slot: <strong className="text-gray-850">{booking.timeSlot}</strong></div>
                            <div>📞 Phone: <strong className="text-gray-850">{booking.customerPhone}</strong></div>
                            <div className="sm:col-span-2">📍 Address: <strong className="text-gray-850">{booking.customerAddress}</strong></div>
                          </div>

                          {/* Action Controls */}
                          {(isConfirm || isInProgress) && (
                            <div className="flex items-center justify-end gap-3 pt-1">
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                className="text-xs text-gray-500 hover:text-red-600 font-bold py-1.5 px-3 hover:bg-red-50 rounded-xl"
                              >
                                Decline Visit
                              </button>
                              
                              {isConfirm && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'In Progress')}
                                  className="bg-brand-pink hover:bg-brand-darkPink text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all"
                                >
                                  Accept & Confirm Visit
                                </button>
                              )}

                              {isInProgress && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'Completed')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Mark as Completed</span>
                                </button>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: My Shopfront Manager */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              
              {/* Profile Details Edit Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <h3 className="text-base font-bold font-serif text-gray-900 mb-4 flex items-center gap-2 border-b border-warm-150 pb-2">
                  <Edit3 className="w-4.5 h-4.5 text-brand-pink" />
                  Edit Shop Profile Details
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Specialty Title</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="e.g. Boutique Tailoring & Alteration"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Base Visit Fee (₹)</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="e.g. 400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Location Zone</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="e.g. Sector 14, Urban Enclave"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Skill Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 bg-white"
                      >
                        <option value="tailoring">Boutique Tailoring</option>
                        <option value="mehendi">Mehendi Artist</option>
                        <option value="cooking">Home Cook & Tiffin</option>
                        <option value="beauty">Beauty & Skincare</option>
                        <option value="yoga">Yoga Instructor</option>
                        <option value="tutoring">Handicraft Tutor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Experience Story</label>
                    <textarea
                      rows={3}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                      placeholder="Tell customers about your skills..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-pink hover:bg-brand-darkPink text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95"
                  >
                    Save Shop Details
                  </button>
                </form>
              </div>

              {/* Service packages list & Add service */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <div className="flex items-center justify-between border-b border-warm-150 pb-2 mb-4">
                  <h3 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-brand-pink" />
                    Manage Offered Service Packages
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${listingLimitReached ? 'bg-red-150 text-red-700' : 'bg-pink-100 text-pink-700'}`}>
                    Total Listings: {totalListings} {!isPro && '/ 3 Limit'}
                  </span>
                </div>

                {/* Services list */}
                <div className="space-y-2 mb-6">
                  {(sister.services || []).map(svc => (
                    <div key={svc.id} className="flex items-center justify-between bg-warm-50 px-4 py-2.5 rounded-xl border border-warm-200 text-xs sm:text-sm">
                      <div>
                        <strong className="text-gray-800">{svc.name}</strong>
                        <span className="text-[10px] text-gray-400 ml-2">({svc.duration || '60 mins'})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-pink-700">{formatCurrency(svc.price)}</span>
                        <button
                          onClick={() => deleteSisterService(sister.id, svc.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Service form */}
                <form onSubmit={handleAddService} className="bg-warm-50/50 p-4 rounded-2xl border border-warm-200/80 space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Add Custom Service Package</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Service Name (e.g. Designer Kurti)"
                      value={svcName}
                      onChange={(e) => setSvcName(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Price (₹)"
                      value={svcPrice}
                      onChange={(e) => setSvcPrice(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300 font-bold"
                    />
                    <select
                      value={svcDuration}
                      onChange={(e) => setSvcDuration(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300 bg-white"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                      <option value="120 mins">120 mins</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-pink-100 hover:bg-[#d81b60] text-brand-pink hover:text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Package
                  </button>
                </form>
              </div>

              {/* Products list & Add product */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <h3 className="text-base font-bold font-serif text-gray-900 border-b border-warm-150 pb-2 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-brand-pink" />
                  List Handmade Craft Products
                </h3>

                {/* Products list */}
                <div className="space-y-2 mb-6">
                  {sisterProducts.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4 bg-warm-50 rounded-xl">No physical craft products listed in your shop.</p>
                  ) : (
                    sisterProducts.map(prod => (
                      <div key={prod.id} className="flex items-center justify-between bg-warm-50 px-4 py-2.5 rounded-xl border border-warm-200 text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded object-cover" />
                          <strong className="text-gray-800 truncate max-w-[200px]">{prod.name}</strong>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-pink-700">{formatCurrency(prod.price)}</span>
                          <button
                            onClick={() => deleteSisterProduct(sister.id, prod.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add product form */}
                <form onSubmit={handleAddProduct} className="bg-warm-50/50 p-4 rounded-2xl border border-warm-200/80 space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wide">List New Handmade Craft Product</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300"
                    />
                    <input
                      type="url"
                      placeholder="Image Link (e.g. Unsplash URL)"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300 font-bold"
                    />
                    <input
                      type="number"
                      placeholder="Original Price (₹ - Optional)"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-warm-300"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short Product Description (materials, dimensions...)"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-warm-300 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-pink-100 hover:bg-[#d81b60] text-brand-pink hover:text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> List Product
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 3: Earnings & Plan Tiers */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              
              {/* Dynamic Income Stats */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <h3 className="text-base font-bold font-serif text-gray-900 mb-6 flex items-center gap-2 border-b border-warm-150 pb-2">
                  <TrendingUp className="w-4.5 h-4.5 text-brand-pink" />
                  My Business Revenue & Payouts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center">
                    <span className="text-xs text-gray-500">Completed Visits</span>
                    <strong className="block text-2xl font-serif text-gray-900 mt-1">{completedBookings.length}</strong>
                  </div>
                  <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center">
                    <span className="text-xs text-gray-500">Gross Revenue</span>
                    <strong className="block text-2xl font-serif text-gray-900 mt-1 text-pink-700">{formatCurrency(grossEarnings)}</strong>
                  </div>
                  <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-center">
                    <span className="text-xs text-gray-500">Platform Fee ({isPro ? '0%' : '5%'})</span>
                    <strong className="block text-2xl font-serif text-gray-900 mt-1 text-red-600">-{formatCurrency(platformFee)}</strong>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-xs text-emerald-800 font-semibold">Net Payout</span>
                    <strong className="block text-2xl font-serif text-emerald-900 mt-1 font-extrabold">{formatCurrency(netEarnings)}</strong>
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                  *Earnings are calculated dynamically from completed visits. Invoiced directly to clients as Cash on Delivery.
                </p>
              </div>

              {/* SaaS Subscription Modal Tiers (ChatGPT Style Plan Selection) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200/80">
                <h3 className="text-base font-bold font-serif text-gray-900 mb-6 flex items-center gap-2 border-b border-warm-150 pb-2">
                  <Zap className="w-4.5 h-4.5 text-brand-pink" />
                  SaaS Partner Subscription Tiers
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Plan 1: Free Starter */}
                  <div className={`p-6 rounded-3xl border-2 flex flex-col justify-between ${
                    !isPro ? 'border-brand-pink bg-pink-50/10' : 'border-warm-200 bg-white'
                  }`}>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 font-serif">Starter Tier</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Perfect for newly enrolled sisters</p>
                      
                      <div className="flex items-baseline gap-1 mt-4 mb-5">
                        <span className="text-3xl font-serif font-extrabold text-gray-950">₹0</span>
                        <span className="text-xs text-gray-400">/free forever</span>
                      </div>

                      <ul className="space-y-2 text-xs text-gray-655 mb-6">
                        <li className="flex items-center gap-2">✓ Standard listing on interactive map</li>
                        <li className="flex items-center gap-2">✓ Limit: Up to 3 services/products listings</li>
                        <li className="flex items-center gap-2">✓ 5% commission platform fee</li>
                      </ul>
                    </div>

                    {!isPro ? (
                      <span className="w-full text-center py-2.5 bg-warm-250 text-gray-600 font-bold rounded-xl text-xs block cursor-default">
                        Current Active Plan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpgrade('free')}
                        className="w-full py-2.5 border border-warm-300 hover:bg-warm-50 text-gray-700 font-bold rounded-xl text-xs transition-all active:scale-95"
                      >
                        Downgrade to Starter
                      </button>
                    )}
                  </div>

                  {/* Plan 2: Udaan Pro */}
                  <div className={`p-6 rounded-3xl border-2 flex flex-col justify-between relative overflow-hidden ${
                    isPro ? 'border-brand-pink bg-pink-50/10 shadow-lg' : 'border-warm-250 bg-white hover:border-pink-300'
                  }`}>
                    {/* Corner Tag */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      POPULAR
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-gray-950 font-serif">Udaan Pro</h4>
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Maximize your neighborhood bookings</p>
                      
                      <div className="flex items-baseline gap-1 mt-4 mb-5">
                        <span className="text-3xl font-serif font-extrabold text-pink-700">₹299</span>
                        <span className="text-xs text-gray-400">/monthly</span>
                      </div>

                      <ul className="space-y-2 text-xs text-gray-655 mb-6">
                        <li className="flex items-center gap-2">🚀 <strong>Priority Listing</strong> on Search & Map</li>
                        <li className="flex items-center gap-2">✓ <strong>Unlimited</strong> service & product listings</li>
                        <li className="flex items-center gap-2">✓ <strong>Zero commission</strong> on bookings (100% pay)</li>
                        <li className="flex items-center gap-2">✓ Direct **WhatsApp chat badge**</li>
                        <li className="flex items-center gap-2">✓ **AI Pricing Assistant** access</li>
                      </ul>
                    </div>

                    {isPro ? (
                      <span className="w-full text-center py-2.5 bg-gradient-to-r from-pink-700 to-[#d81b60] text-white font-extrabold rounded-xl text-xs block cursor-default shadow-sm shadow-pink-600/20">
                        Current Active Plan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpgrade('pro')}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-700 to-[#d81b60] hover:from-pink-850 hover:to-pink-900 text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-pink-600/25"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* AI Pricing Assistant (Unlocked on Pro Plan) */}
              {isPro ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-200">
                  <div className="flex items-center gap-2 mb-1.5 border-b border-pink-100 pb-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                    <h3 className="text-base font-bold font-serif text-gray-950">AI Pricing Assistant (Pro Feature)</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Instantly research fair rates for services in your category to stay competitive and attract more local orders.
                  </p>

                  <form onSubmit={handleGetAiSuggestion} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter service title (e.g. Bridal Mehendi, Blouse Stitching)"
                      value={aiServiceName}
                      onChange={(e) => setAiServiceName(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-warm-300"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#d81b60] to-pink-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all"
                    >
                      Get Suggestions
                    </button>
                  </form>

                  {aiSuggestion && (
                    <div className="mt-4 p-4 bg-pink-50/50 border border-pink-200 rounded-2xl animate-fade-in space-y-1.5 text-xs text-pink-900">
                      <p>💡 Recommended Range: <strong className="text-pink-800 text-sm font-extrabold">{aiSuggestion.range}</strong></p>
                      <p className="text-pink-700/90 leading-relaxed font-light">{aiSuggestion.text}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Locked AI Pricing Assistant Promo */
                <div className="bg-warm-100 rounded-3xl p-6 border border-warm-250 text-center opacity-75">
                  <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-800 font-serif text-sm">Unlock AI Pricing Assistant</h4>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-1">
                    Upgrade to Udaan Pro to access pricing advice powered by platform transaction histories in your local zone.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
