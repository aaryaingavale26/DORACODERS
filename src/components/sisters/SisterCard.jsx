import React from 'react';
import { useSisters } from '../../context/SistersContext';
import { useAuth } from '../../context/AuthContext';
import { Star, MapPin, Check, ArrowRight } from 'lucide-react';

export default function SisterCard({ sister }) {
  const { navigateTo } = useAuth();

  const getShopName = (s) => {
    const firstName = s.name.split(' ')[0];
    if (s.category === 'tailoring') return `${firstName}'s Boutique Shop`;
    if (s.category === 'mehendi') return `${firstName}'s Mehendi Studio`;
    if (s.category === 'cooking') return `${firstName}'s Tiffin & Kitchen`;
    if (s.category === 'beauty') return `${firstName}'s Beauty Salon`;
    if (s.category === 'yoga') return `${firstName}'s Yoga Center`;
    if (s.category === 'tutoring') return `${firstName}'s Craft Academy`;
    if (s.category === 'cleaning') return `${firstName}'s Deep Clean & Home Care`;
    if (s.category === 'eldercare') return `${firstName}'s Care & Companion Services`;
    return `${firstName}'s Shop`;
  };

  return (
    <div 
      onClick={() => navigateTo('shop-detail', sister.id)}
      className="bg-white rounded-3xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-warm-200/90 flex flex-col justify-between group cursor-pointer"
    >
      
      {/* Top Banner Cover Placeholder */}
      <div className="h-28 rounded-2xl bg-gradient-to-r from-pink-900/10 to-brand-500/10 mb-4 overflow-hidden relative flex items-center justify-center">
        <span className="font-serif text-pink-900/30 text-3xl font-black italic tracking-wider select-none uppercase opacity-15">
          {sister.category}
        </span>
      </div>

      {/* Top Avatar Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative -mt-12 ml-2">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-white">
            <img
              src={sister.avatar}
              alt={sister.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-[#d81b60] border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 bg-[#831843] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm shrink-0">
          <Star className="w-3.5 h-3.5 fill-white text-white" />
          <span>{Number(sister.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 text-left flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Name */}
          <h3 className="text-lg font-bold text-gray-900 font-serif group-hover:text-brand-pink transition-colors">
            {getShopName(sister)}
          </h3>

          {/* Skill Badge */}
          <div className="mt-1.5">
            <span className="inline-block bg-pink-50 border border-pink-100 text-brand-pink text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {sister.specialty}
            </span>
          </div>

          {/* Locality badge */}
          <p className="text-[11px] text-gray-500 font-semibold mt-2.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-pink-600" />
            <span>{sister.location} • {sister.distance}</span>
          </p>
        </div>

        {/* Visit Shop Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('shop-detail', sister.id);
          }}
          className="w-full bg-[#d81b60] group-hover:bg-[#c2185b] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1.5 mt-5"
        >
          <span>Visit Shop</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
