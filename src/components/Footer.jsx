import React from 'react';
import { useSisters } from '../context/SistersContext';
import { Sparkles, Heart, ShieldCheck, UserPlus } from 'lucide-react';

export default function Footer() {
  const { setIsEnrollModalOpen } = useSisters();

  return (
    <footer className="bg-[#231b15] text-white pt-16 pb-12 border-t border-warm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center text-white shadow-md">
                <span className="font-serif text-xl font-bold italic">u</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">udaan</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              India's grassroots platform connecting rural women artisans with global conscious buyers, and local skilled sisters with neighborhood households.
            </p>
            <div className="flex items-center gap-2 text-xs text-pink-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Community & Fair Trade Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-3">
              Skilled Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Boutique Tailoring</a></li>
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Bridal Mehendi</a></li>
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Home Cook & Tiffin</a></li>
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Beauty & Skincare</a></li>
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Yoga & Fitness</a></li>
              <li><a href="#sisters" className="hover:text-pink-400 transition-colors">Handicraft Workshops</a></li>
            </ul>
          </div>

          {/* Handmade Store */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-3">
              Craft Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#products" className="hover:text-pink-400 transition-colors">Jaipur Blue Pottery</a></li>
              <li><a href="#products" className="hover:text-pink-400 transition-colors">Chanderi Silk Sarees</a></li>
              <li><a href="#products" className="hover:text-pink-400 transition-colors">Dokra Brass Art</a></li>
              <li><a href="#products" className="hover:text-pink-400 transition-colors">Lambani Mirror Jewelry</a></li>
              <li><a href="#products" className="hover:text-pink-400 transition-colors">Terracotta Chai Sets</a></li>
            </ul>
          </div>

          {/* Partner Portal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-3">
              For Sisters
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Join thousands of skilled women earning on their own terms.
            </p>
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="w-full bg-[#d81b60] hover:bg-[#c2185b] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll as a Sister</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} udaan. Built with pride for rural women empowerment.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Skilled Women Artisans of India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
