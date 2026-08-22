import React from 'react';
import { useSisters } from '../../context/SistersContext';
import { 
  X, 
  Star, 
  Heart, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Award,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SisterProfileModal() {
  const { 
    selectedSisterForProfile, 
    setSelectedSisterForProfile, 
    setSelectedSisterForBooking,
    setSelectedSisterForChat,
    userLikes,
    toggleLike
  } = useSisters();

  if (!selectedSisterForProfile) return null;

  const sister = selectedSisterForProfile;
  const isLiked = !!userLikes[sister.id];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6 animate-fade-in">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 relative">
          <button
            onClick={() => setSelectedSisterForProfile(null)}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative -mt-16">
          
          {/* Avatar + Top Badges */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-white">
                <img src={sister.avatar} alt={sister.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#d81b60] border-2 border-white flex items-center justify-center text-white shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLike(sister.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                  isLiked ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-warm-300 text-gray-700 hover:bg-pink-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                <span>{sister.likes} Likes</span>
              </button>

              <div className="flex items-center gap-1 bg-[#831843] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{Number(sister.rating).toFixed(1)} ({sister.reviewsCount || 24} reviews)</span>
              </div>
            </div>
          </div>

          {/* Sister Title & Location */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-serif text-gray-900">{sister.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Partner
              </span>
            </div>
            <p className="text-sm font-semibold text-brand-pink mt-0.5">{sister.specialty}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{sister.location || 'Local 3km Community Zone'} • {sister.distance || 'Available near you'}</span>
            </p>
          </div>

          {/* Bio / Experience */}
          <div className="mt-5 p-4 bg-warm-50 rounded-2xl border border-warm-200 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-pink" />
              Background & Experience
            </h4>
            <p>{sister.experience}</p>
          </div>

          {/* Services Menu & Pricing */}
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Service Packages & Rates
            </h4>
            <div className="space-y-2">
              {(sister.services || []).map(svc => (
                <div key={svc.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-warm-200 hover:border-pink-300 transition-colors">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{svc.name}</p>
                    <span className="text-[11px] text-gray-500">{svc.duration || '60 mins'}</span>
                  </div>
                  <span className="text-sm font-extrabold text-pink-700">{formatCurrency(svc.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          {sister.badges && sister.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {sister.badges.map((b, i) => (
                <span key={i} className="text-xs font-semibold bg-pink-100 text-pink-800 px-3 py-1 rounded-lg">
                  ✓ {b}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-warm-200 flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedSisterForProfile(null);
                setSelectedSisterForChat(sister);
              }}
              className="px-5 py-3 rounded-xl border border-gray-300 hover:border-pink-400 hover:bg-pink-50 text-gray-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-brand-pink" />
              <span>Inquire / Chat</span>
            </button>

            <button
              onClick={() => {
                setSelectedSisterForProfile(null);
                setSelectedSisterForBooking(sister);
              }}
              className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md shadow-pink-600/30 active:scale-95 transition-all text-center"
            >
              Hire Her ({formatCurrency(sister.rate)}{sister.rateUnit || '/visit'})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
