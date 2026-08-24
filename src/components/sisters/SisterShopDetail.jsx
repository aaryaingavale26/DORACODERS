import React, { useState } from 'react';
import { useSisters } from '../../context/SistersContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Check, 
  MapPin, 
  Award, 
  MessageSquare, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  MessageCircle 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SisterShopDetail() {
  const { navigateTo, activeSisterId } = useAuth();
  const { 
    sisters, 
    products, 
    userLikes, 
    toggleLike, 
    setSelectedSisterForBooking, 
    setSelectedSisterForChat 
  } = useSisters();
  const { addToCart } = useCart();
  
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'products'

  const sister = sisters.find(s => s.id === activeSisterId);
  
  if (!sister) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-800">Sister Shop Not Found</h3>
        <button 
          onClick={() => navigateTo('home')}
          className="mt-4 px-4 py-2 bg-brand-pink text-white rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isLiked = !!userLikes[sister.id];
  const isPro = sister.subscription === 'pro';
  
  // Filter products owned by this sister
  const sisterProducts = products.filter(p => p.sisterId === sister.id);

  return (
    <div className="bg-[#faf7f5] min-h-screen pb-16">
      
      {/* Top Banner and Back Action */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-pink-900 via-[#831843] to-pink-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-black/25 hover:bg-black/40 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Shops</span>
          </button>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Profile Showcase container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Sister Profile Bio Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-warm-200/80">
              
              {/* Profile Photo */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-white">
                    <img 
                      src={sister.avatar} 
                      alt={sister.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#d81b60] border-2 border-white flex items-center justify-center text-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">{sister.name}</h2>
                    {isPro && (
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm shrink-0">
                        <Zap className="w-3 h-3 fill-white text-white" /> PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-brand-pink">{sister.specialty}</p>
                </div>

                {/* Rating Badge */}
                <div className="mt-3 flex items-center gap-1.5 bg-pink-50 border border-pink-100 text-[#831843] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#831843] text-[#831843]" />
                  <span>{Number(sister.rating).toFixed(1)} ({sister.reviewsCount || 35} Verified Reviews)</span>
                </div>

                {/* Location Badge */}
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{sister.location || 'Local Community Zone'} • {sister.distance}</span>
                </p>
              </div>

              {/* Likes counter & chat buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-warm-100">
                <button
                  onClick={() => toggleLike(sister.id)}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                    isLiked ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-warm-300 text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  <span>{sister.likes} Likes</span>
                </button>

                <button
                  onClick={() => setSelectedSisterForChat(sister)}
                  className="py-2 px-3 rounded-xl border border-warm-300 hover:border-pink-400 hover:bg-pink-50/50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-brand-pink" />
                  <span>Inquire / Chat</span>
                </button>
              </div>

              {/* Direct WhatsApp Callout for Pro sisters */}
              {isPro && (
                <div className="mt-3.5">
                  <a
                    href={`https://wa.me/${(sister.phone || '919876543210').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(sister.name)},%20I%20saw%2520your%2520shop%2520on%2520Udaan%2520and%2520wanted%2520to%2520connect!`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Me Direct</span>
                  </a>
                </div>
              )}
            </div>

            {/* Experience / Bio Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-warm-200/80 space-y-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 border-b border-warm-100 pb-2">
                <Award className="w-4 h-4 text-brand-pink" />
                Artisan Story & Experience
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {sister.experience}
              </p>

              {/* Verification Info */}
              <div className="bg-pink-50/80 p-3 rounded-xl flex items-start gap-2 border border-pink-200/50">
                <ShieldCheck className="w-5 h-5 text-[#d81b60] shrink-0 mt-0.5" />
                <div className="text-[11px] text-pink-900 leading-normal">
                  <span className="font-bold block">Verified Skilled Sister</span>
                  Udaan has verified this artisan's skills, credentials, and local banking codes.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Menu (Services vs Handmade Crafts Shop) (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex bg-white rounded-2xl p-1.5 shadow-md border border-warm-200">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'services'
                    ? 'bg-[#d81b60] text-white shadow-md shadow-pink-600/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-warm-50'
                }`}
              >
                💼 Services Offered ({sister.services?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'products'
                    ? 'bg-[#d81b60] text-white shadow-md shadow-pink-600/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-warm-50'
                }`}
              >
                🎨 Handmade Products ({sisterProducts.length})
              </button>
            </div>

            {/* Tab 1: Services Offered View */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-warm-200/80">
                  <div className="flex items-center justify-between border-b border-warm-100 pb-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Visiting Base Rate</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-gray-900">{formatCurrency(sister.rate)}</span>
                        <span className="text-xs text-gray-500">{sister.rateUnit || '/visit'}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedSisterForBooking(sister)}
                      className="px-6 py-3 bg-[#d81b60] hover:bg-[#c2185b] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      Instant Book Consultation
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-4 font-serif">Service & Custom Design Packages</h3>
                  
                  <div className="space-y-3">
                    {(sister.services || []).map(svc => (
                      <div 
                        key={svc.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-warm-50 hover:bg-pink-50/20 rounded-2xl border border-warm-200 transition-all gap-4"
                      >
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{svc.name}</p>
                          <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-warm-200 mt-1 inline-block">
                            Duration: {svc.duration || '60 mins'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-2 sm:pt-0">
                          <span className="text-base font-extrabold text-pink-700">{formatCurrency(svc.price)}</span>
                          <button
                            onClick={() => setSelectedSisterForBooking({
                              ...sister,
                              preselectedService: svc
                            })}
                            className="px-4 py-2 bg-pink-100 hover:bg-[#d81b60] text-brand-pink hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            Book Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* Tab 2: Handmade Products Showcase View */}
            {activeTab === 'products' && (
              <div>
                {sisterProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-warm-200/80 shadow-md">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="font-bold text-gray-800 font-serif">No Products in Shop</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      This sister hasn't uploaded any physical craft products for direct shipping yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sisterProducts.map(product => (
                      <div 
                        key={product.id}
                        className="bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-warm-100">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{Number(product.rating).toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between">
                            <div>
                              <span className="text-base font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.originalPrice)}</span>
                              )}
                            </div>

                            <button
                              onClick={() => addToCart(product)}
                              className="px-3.5 py-2 bg-pink-50 hover:bg-[#d81b60] text-brand-pink hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
