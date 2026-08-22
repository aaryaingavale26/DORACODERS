import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, TrendingUp, Users, Award } from 'lucide-react';

export default function ImpactSection() {
  const stats = [
    { number: "500+", label: "Rural Women Artisans", sub: "Earning regular self-sustained income across 18 states." },
    { number: "15,000+", label: "Handmade Products Sold", sub: "Shipped directly from village self-help groups." },
    { number: "4,200+", label: "Skilled Sister Home Visits", sub: "Completed with 4.9/5 average customer satisfaction." },
    { number: "100%", label: "Direct Income Retention", sub: "Zero commission charged to artisans or skilled sisters." }
  ];

  return (
    <section id="impact" className="py-16 sm:py-20 bg-gradient-to-b from-warm-100 to-pink-50/50 border-t border-warm-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-pink-100/90 text-pink-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-brand-pink" />
            <span>The Udaan Empowerment Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#231b15] tracking-tight">
            Transforming Village Economy, One Sister at a Time
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 leading-relaxed">
            By connecting rural crafts and neighborhood home services directly with consumers, we bridge the gap between traditional skills and modern livelihoods.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-warm-200 shadow-card hover:shadow-elevated transition-all text-center flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-pink-700 font-serif block">
                  {stat.number}
                </span>
                <h4 className="text-sm font-bold text-gray-900 mt-2">{stat.label}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Story Card */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-warm-200 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
              alt="Sunita Kumari story"
              className="w-full h-64 rounded-2xl object-cover shadow-md"
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">Sister Spotlight</span>
            <h3 className="text-2xl font-bold font-serif text-gray-900">
              "Udaan gave me financial independence right from my kitchen."
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              — Sunita Kumari, Home Chef & Tiffin Specialist: <em>"Earlier, finding clients for home meals was difficult and dependent on brokers. Today, families in my 3km neighborhood book weekly meal visits directly with me. I earn over ₹28,000 monthly to fund my daughter's college education."</em>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
