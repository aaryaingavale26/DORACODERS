import React from 'react';
import { useSisters } from '../../context/SistersContext';
import { Star, Heart, MessageSquare, Check, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SisterCard({ sister }) {
  const { 
    setSelectedSisterForBooking, 
    setSelectedSisterForProfile, 
    setSelectedSisterForChat,
    userLikes,
    toggleLike 
  } = useSisters();

  const isLiked = !!userLikes[sister.id];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-warm-200/90 flex flex-col justify-between group">
      
      {/* Top Row: Avatar + Info + Rating Badge */}
      <div className="flex items-start justify-between gap-3">
        
        {/* Left: Avatar with Checkmark Badge */}
        <div className="relative cursor-pointer" onClick={() => setSelectedSisterForProfile(sister)}>
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-warm-200 group-hover:ring-pink-400 transition-all">
            <img
              src={sister.avatar}
              alt={sister.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* Verified Pink Checkmark Badge (matching screenshot) */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d81b60] border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Center: Sister Name & Specialty */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedSisterForProfile(sister)}>
          <h3 className="text-base font-bold text-gray-900 truncate hover:text-brand-pink transition-colors">
            {sister.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
            {sister.specialty}
          </p>
          {sister.distance && (
            <p className="text-[11px] text-pink-700 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {sister.distance}
            </p>
          )}
        </div>

        {/* Right: Star Rating Pill (matching screenshot deep berry pill with white text) */}
        <div className="flex items-center gap-1 bg-[#831843] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm shrink-0">
          <Star className="w-3 h-3 fill-white text-white" />
          <span>{Number(sister.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Middle Row: Price and Likes (matching screenshot) */}
      <div className="flex items-center justify-between mt-5 mb-4 pt-3 border-t border-warm-100">
        <div className="text-left">
          <span className="text-base font-extrabold text-gray-900">
            {formatCurrency(sister.rate)}
          </span>
          <span className="text-xs text-gray-500 font-normal">
            {sister.rateUnit || "/visit"}
          </span>
        </div>

        {/* Likes Count with Heart (Interactive!) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(sister.id);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-pink-600 transition-colors py-1 px-1.5 rounded-lg hover:bg-pink-50"
          title={isLiked ? "Unlike profile" : "Like profile"}
        >
          <span>{sister.likes}+</span>
          <Heart 
            className={`w-3.5 h-3.5 transition-all ${
              isLiked 
                ? 'fill-rose-500 text-rose-500 scale-110' 
                : 'text-rose-400 fill-rose-100 group-hover:text-rose-500'
            }`} 
          />
        </button>
      </div>

      {/* Bottom Action Row: "Hire Her" button & Chat bubble button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedSisterForBooking(sister)}
          className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] active:bg-[#ad1457] text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:shadow-pink-600/20 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>Hire Her</span>
        </button>

        <button
          onClick={() => setSelectedSisterForChat(sister)}
          className="w-10 h-10 rounded-xl border border-gray-300 hover:border-pink-400 hover:bg-pink-50/80 text-gray-700 hover:text-brand-pink flex items-center justify-center transition-all active:scale-95 shrink-0"
          title="Direct chat or WhatsApp inquiry"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
