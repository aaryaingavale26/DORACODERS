import React from 'react';
import { useSisters } from '../context/SistersContext';
import { ShieldCheck, HeartHandshake, Sparkles, ArrowRight, UserPlus, Star } from 'lucide-react';

export default function Hero() {
  const { setIsEnrollModalOpen, sisters } = useSisters();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-warm-100/90 via-pink-50/40 to-[#faf7f5]">
      {/* Background soft glow shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-pink-200/30 via-rose-100/20 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-pink-800 tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>India's 1st Rural Women Artisan & Skilled Service Collective</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#231b15] leading-[1.15]">
              Handcrafted with Love. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-brand-pink to-rose-600">
                Delivered by Skilled Sisters.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover authentic handmade crafts from rural women artisans, or hire verified skilled sisters in your local 3km zone for tailoring, mehendi, home cooking, and beauty care.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#sisters"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#d81b60] hover:bg-[#c2185b] text-white font-semibold rounded-full shadow-lg shadow-pink-600/25 hover:shadow-xl hover:shadow-pink-600/35 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Hire a Sister Near You</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-pink-50/80 text-pink-900 font-semibold rounded-full border-2 border-pink-300/80 shadow-sm hover:border-pink-500 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 text-brand-pink" />
                <span>Join as a Skilled Partner</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-warm-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-gray-900 font-serif">{sisters.length}+</span>
                <span className="text-xs text-gray-600 font-medium">Verified Sisters</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-gray-900 font-serif">₹0</span>
                <span className="text-xs text-gray-600 font-medium">Platform Fee for Sisters</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-pink-700 font-serif">4.9 ★</span>
                <span className="text-xs text-gray-600 font-medium">Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80"
                  alt="Rural artisan working on traditional textiles"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-pink-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Urban Company Model for Rural Empowerment</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif">Direct Dignified Livelihoods</h3>
                  <p className="text-xs text-gray-200 mt-1">100% of your booking fee goes directly into the hands of your local skilled sister.</p>
                </div>
              </div>

              {/* Floating Mini Badge 1 */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-pink-100 flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-brand-pink">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Doorstep Verification</p>
                  <p className="text-[11px] text-gray-500">ID & Skill Certified</p>
                </div>
              </div>

              {/* Floating Mini Badge 2 */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-pink-100 flex items-center gap-3 animate-fade-in">
                <div className="flex -space-x-2">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Anjali" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Priya" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" alt="Rekha" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Near You (3km)</p>
                  <div className="flex items-center text-[10px] text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="ml-0.5 text-gray-700">4.9 (450+ Visits)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
