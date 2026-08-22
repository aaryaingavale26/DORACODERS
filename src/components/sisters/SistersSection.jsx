import React from 'react';
import { useSisters } from '../../context/SistersContext';
import SisterCard from './SisterCard';
import SisterFilters from './SisterFilters';
import SisterEnrollModal from './SisterEnrollModal';
import SisterBookingModal from './SisterBookingModal';
import SisterProfileModal from './SisterProfileModal';
import SisterChatModal from './SisterChatModal';
import { UserPlus, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

export default function SistersSection() {
  const { 
    filteredSisters, 
    sisters, 
    setIsEnrollModalOpen, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    resetToSeedData
  } = useSisters();

  return (
    <section id="sisters" className="py-16 sm:py-20 bg-[#faf7f5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching Screenshot Exactly) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#231b15] tracking-tight">
            Hire Skilled Sisters Near You
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2 font-normal">
            Verified women professionals ready to serve in your 3km zone
          </p>
        </div>

        {/* Urban Company Style Partner Onboarding Callout Card */}
        <div className="mb-10 bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-pink-500/30 text-pink-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Partner Enrollment Open</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Are you a skilled woman wanting to earn on your own terms?
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
              Enroll yourself as a Skilled Sister on Udaan. Put your specialty to work (Tailoring, Mehendi, Home Cooking, Beauty, Tutoring & more) and start receiving doorstep bookings in your neighborhood with zero commissions.
            </p>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="z-10 bg-white hover:bg-pink-50 text-pink-900 font-bold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 shrink-0 border-2 border-pink-200"
          >
            <UserPlus className="w-5 h-5 text-brand-pink" />
            <span>Enroll as a Sister</span>
          </button>

          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Filters and Controls */}
        <SisterFilters />

        {/* Sisters Cards Grid (Exact 3-column layout matching screenshot) */}
        {filteredSisters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSisters.map(sister => (
              <SisterCard key={sister.id} sister={sister} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 text-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-900">No Skilled Sisters Found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              No matching verified professionals found for "{searchQuery}". Try selecting a different category or broadening your search.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-brand-pink text-white rounded-xl text-xs font-semibold hover:bg-brand-darkPink transition-all"
              >
                Clear All Filters
              </button>
              <button
                onClick={resetToSeedData}
                className="px-4 py-2.5 border border-warm-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-warm-100 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sample Sisters
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Modals */}
      <SisterEnrollModal />
      <SisterBookingModal />
      <SisterProfileModal />
      <SisterChatModal />

    </section>
  );
}
