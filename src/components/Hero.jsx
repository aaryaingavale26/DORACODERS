import React from 'react';
import { useSisters } from '../context/SistersContext';
import { ShoppingBag, Sparkles, UserPlus, ShieldCheck, MapPin } from 'lucide-react';

export default function Hero() {
  const { setIsEnrollModalOpen, sisters } = useSisters();

  return (
    <section className="relative overflow-hidden min-h-[580px] lg:min-h-[620px] flex items-center bg-[#faf7f5]">
      
      {/* Clean Artisan Artwork Backdrop on the Right */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/artisan-backdrop.jpg"
          alt="Rural Indian women artisans creating pottery, diya, and weaving"
          className="w-full h-full object-cover object-center lg:object-right select-none opacity-90"
        />
        {/* Elegant left-to-right fade overlay for pristine text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f5] via-[#faf7f5]/95 sm:via-[#faf7f5]/85 md:via-[#faf7f5]/70 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-100/90 backdrop-blur-md border border-pink-200/90 px-4 py-1.5 rounded-full text-xs font-bold text-pink-900 tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d81b60]" />
            <span>✦ udaan collective</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-[#231b15] leading-[1.12]">
            Your Skills, Your <br />
            Income <br />
            <span className="text-[#d81b60]">
              — Connect Locally!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed max-w-lg">
            Empowering rural women artisans to showcase handmade products, connect with local buyers, and grow their income.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Primary Shop Local Button */}
            <a
              href="#products"
              className="px-7 py-3.5 bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold rounded-2xl shadow-lg shadow-pink-600/30 hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Local</span>
            </a>

            {/* Sell Your Craft / Enroll Sister Button */}
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-6 py-3.5 bg-white/95 hover:bg-white text-gray-900 font-bold rounded-2xl shadow-md border border-warm-300 hover:border-pink-300 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 text-[#d81b60]" />
              <span>Sell Your Craft / Join as Sister</span>
            </button>

            {/* Quick Link to Map */}
            <a
              href="#sisters"
              className="px-5 py-3.5 bg-pink-50/90 hover:bg-pink-100 text-pink-900 font-semibold rounded-2xl text-xs sm:text-sm border border-pink-200/80 flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#d81b60]" />
              <span>Hire Sisters (3km Radar)</span>
            </a>

          </div>

          {/* Highlights Tag */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-warm-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Direct Artisan Income</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-warm-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{sisters.length}+ Verified Sisters Available Near You</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
