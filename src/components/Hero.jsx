import React from 'react';
import { useSisters } from '../context/SistersContext';
import { ShoppingBag, Sparkles, UserPlus, ShieldCheck, MapPin, Star, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { setIsEnrollModalOpen, sisters } = useSisters();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:py-24 bg-gradient-to-b from-warm-100/90 via-pink-50/30 to-[#faf7f5]">
      
      {/* Soft Ambient Background Glow Shapes (Clean & Modern) */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-gradient-to-bl from-pink-200/40 via-rose-100/20 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-100/40 via-warm-200/20 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle & Action CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-pink-100/90 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold text-pink-900 tracking-wide shadow-sm">
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
            <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Empowering rural women artisans to showcase handmade products, connect with local buyers, and grow their income.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              
              {/* Primary Shop Local Button */}
              <a
                href="#products"
                className="px-7 py-3.5 bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold rounded-2xl shadow-lg shadow-pink-600/25 hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Local</span>
              </a>

              {/* Sell Your Craft / Enroll Sister Button */}
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="px-6 py-3.5 bg-white hover:bg-pink-50 text-gray-900 font-bold rounded-2xl shadow-sm border border-warm-300 hover:border-pink-300 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 text-[#d81b60]" />
                <span>Sell Your Craft / Join as Sister</span>
              </button>

              {/* Quick Link to Map */}
              <a
                href="#sisters"
                className="px-5 py-3.5 bg-pink-50/90 hover:bg-pink-100 text-pink-900 font-semibold rounded-2xl text-xs sm:text-sm border border-pink-200 flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#d81b60]" />
                <span>Hire Sisters (3km Radar)</span>
              </a>

            </div>

            {/* Highlights Tag */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-gray-600 border-t border-warm-200/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Direct Artisan Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{sisters.length}+ Verified Sisters in Your Local Zone</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Modern Feature Cards Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md space-y-4">
              
              {/* Primary Showcase Card: Handmade Crafts & Women Artisans */}
              <div className="bg-white rounded-3xl p-5 shadow-card border border-warm-200 hover:shadow-elevated transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#d81b60] flex items-center justify-center font-bold">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Direct From Village Self-Help Groups</h3>
                    <p className="text-xs text-gray-500">Over 500+ Rural Women Empowered</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300&auto=format&fit=crop&q=80"
                    alt="Blue pottery"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80"
                    alt="Handloom silk"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80"
                    alt="Tribal art"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Secondary Card: Skilled Sister Neighborhood Radar Badge */}
              <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-pink-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Urban Company Model for Rural Sisters</span>
                  </div>
                  <h4 className="font-bold text-sm font-serif">Doorstep Service in 3km Zone</h4>
                  <p className="text-[11px] text-pink-200">Tailoring • Mehendi • Home Cooking • Beauty Care</p>
                </div>

                <a
                  href="#sisters"
                  className="px-4 py-2 bg-white text-pink-900 font-bold text-xs rounded-xl shadow shrink-0 hover:bg-pink-50 transition-all flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d81b60]" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
