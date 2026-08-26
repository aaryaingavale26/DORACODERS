import React, { useState } from 'react';
import { useSisters } from '../../context/SistersContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Star,
  Heart,
  Camera,
  MessageSquare
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const avatarPresets = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', label: 'Anjali style' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', label: 'Sunita style' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', label: 'Rekha style' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', label: 'Priya style' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', label: 'Meena style' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80', label: 'Kavita style' },
];

export default function SisterEnrollModal() {
  const { isEnrollModalOpen, setIsEnrollModalOpen, enrollSister } = useSisters();
  const { currentUser, enrollCurrentAsSister } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'tailoring',
    specialty: '',
    rate: '400',
    rateUnit: '/visit',
    location: '',
    distance: '1.0',
    experience: '',
    avatar: avatarPresets[0].url,
    customAvatarUrl: '',
    services: [
      { id: 's-1', name: 'Primary Doorstep Service Consultation', price: 400, duration: '60 mins' },
      { id: 's-2', name: 'Customized Project / Work', price: 650, duration: '90 mins' }
    ]
  });

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  if (!isEnrollModalOpen) return null;

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) return;
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: `s-${Date.now()}`,
          name: newServiceName.trim(),
          price: Number(newServicePrice) || 300,
          duration: '60 mins'
        }
      ]
    }));
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialty.trim()) {
      alert("Please fill in your Name and Specialty.");
      return;
    }

    const finalAvatar = formData.customAvatarUrl.trim() || formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`;
    const fullData = {
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim() || currentUser?.phone || '+91 98765 43210',
      email: currentUser?.email || 'sister@gmail.com',
      avatar: finalAvatar,
      rate: Number(formData.rate) || 400
    };

    const sisterId = enrollSister(fullData);
    enrollCurrentAsSister(sisterId, fullData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-8 animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-6 relative">
          <button
            onClick={() => setIsEnrollModalOpen(false)}
            className="absolute right-5 top-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-300 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Urban Company Model Partner Registration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Enroll as a Skilled Sister Partner
          </h2>
          <p className="text-sm text-pink-100 mt-1">
            Earn dignified direct income in your 3km local zone. Set your own visiting fees, choose your working hours, and get verified bookings.
          </p>
        </div>

        {/* Modal Content Grid (Form + Live Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* Left Form (8 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            
            {/* 1. Name & Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-warm-200 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-extrabold">1</span>
                Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radha Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Neighborhood / City Zone *</label>
                <input
                  type="text"
                  placeholder="e.g. Green Park / Sector 22, 3km Zone"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink"
                />
              </div>
            </div>

            {/* 2. Photo / Avatar Selection */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-pink" />
                Select Profile Photo
              </h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {avatarPresets.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: preset.url, customAvatarUrl: '' })}
                    className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                      formData.avatar === preset.url && !formData.customAvatarUrl
                        ? 'border-brand-pink ring-2 ring-pink-300 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {formData.avatar === preset.url && !formData.customAvatarUrl && (
                      <div className="absolute inset-0 bg-pink-600/30 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                <span>Or paste custom image link: </span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.customAvatarUrl}
                  onChange={(e) => setFormData({ ...formData, customAvatarUrl: e.target.value })}
                  className="mt-1 w-full text-xs px-3 py-1.5 rounded-lg border border-warm-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* 3. Specialty & Experience */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-warm-200 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-extrabold">2</span>
                Skill & Specialty
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Skill Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let defaultTitle = 'Custom Service';
                      if (cat === 'tailoring') defaultTitle = 'Boutique Tailoring & Stitching';
                      if (cat === 'mehendi') defaultTitle = 'Mehendi & Henna Artist';
                      if (cat === 'cooking') defaultTitle = 'Home Cook & Tiffin Service';
                      if (cat === 'beauty') defaultTitle = 'Beauty & Herbal Skincare';
                      if (cat === 'yoga') defaultTitle = 'Yoga & Wellness Instructor';
                      if (cat === 'tutoring') defaultTitle = 'Handicraft & Art Tutor';
                      if (cat === 'cleaning') defaultTitle = 'Home Organization & Cleaning';
                      setFormData({ ...formData, category: cat, specialty: defaultTitle });
                    }}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink font-medium"
                  >
                    <option value="tailoring">Boutique Tailoring</option>
                    <option value="mehendi">Mehendi Artist</option>
                    <option value="cooking">Home Cook & Tiffin</option>
                    <option value="beauty">Beauty & Skincare</option>
                    <option value="yoga">Yoga Instructor</option>
                    <option value="tutoring">Handicraft Tutor</option>
                    <option value="cleaning">Housekeeping & Organization</option>
                    <option value="eldercare">Elder & Child Companion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Display Specialty Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boutique Tailoring & Blouse Design"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Experience / Bio</label>
                <textarea
                  rows={2}
                  placeholder="Share your years of work, specialties, techniques, and why clients love your service..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink resize-none"
                />
              </div>
            </div>

            {/* 4. Pricing & Rates */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-warm-200 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-brand-pink text-xs flex items-center justify-center font-extrabold">3</span>
                Visiting Rates & Services
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Base Visiting Rate (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      className="w-full text-sm pl-8 pr-3 py-2.5 rounded-xl border border-warm-300 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Billing Unit</label>
                  <select
                    value={formData.rateUnit}
                    onChange={(e) => setFormData({ ...formData, rateUnit: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-warm-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  >
                    <option value="/visit">/visit</option>
                    <option value="/hour">/hour</option>
                    <option value="/session">/session</option>
                  </select>
                </div>
              </div>

              {/* Service Menu Items */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Services Offered (Package Menu)</label>
                <div className="space-y-2 mb-2">
                  {formData.services.map(svc => (
                    <div key={svc.id} className="flex items-center justify-between bg-warm-50 px-3 py-1.5 rounded-lg border border-warm-200 text-xs">
                      <span className="font-medium text-gray-800">{svc.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pink-700">{formatCurrency(svc.price)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(svc.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Service Row */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom service (e.g. Bridal Henna)"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-warm-300"
                  />
                  <input
                    type="number"
                    placeholder="₹ Price"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-24 text-xs px-3 py-1.5 rounded-lg border border-warm-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-brand-pink rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="bg-pink-50/80 border border-pink-200/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-pink-900">
              <ShieldCheck className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Instant Verification & Zero Platform Commission</p>
                <p className="text-pink-700/90 mt-0.5">
                  Your profile will receive the official verified sister badge immediately. Customers book directly with you.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold text-sm shadow-md shadow-pink-600/30 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Complete Enrollment</span>
              </button>
            </div>

          </form>

          {/* Right Live Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-warm-50 p-5 rounded-2xl border border-warm-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Profile Preview</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Real-Time Card
                </span>
              </div>

              {/* Sister Card Exact Preview */}
              <div className="bg-white rounded-2xl p-5 shadow-card border border-warm-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-warm-200">
                      <img
                        src={formData.customAvatarUrl || formData.avatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d81b60] border-2 border-white flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {formData.name.trim() || 'Your Name'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                      {formData.specialty.trim() || 'Your Specialty'}
                    </p>
                    <p className="text-[11px] text-pink-700 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {formData.location.trim() || '3km Zone'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#831843] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm shrink-0">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>5.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 mb-4 pt-3 border-t border-warm-100">
                  <div>
                    <span className="text-base font-extrabold text-gray-900">
                      {formatCurrency(formData.rate || 400)}
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      {formData.rateUnit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <span>1+</span>
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 bg-[#d81b60] text-white py-2.5 px-4 rounded-xl text-sm font-bold opacity-90 cursor-default"
                  >
                    Hire Her
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl border border-gray-300 text-gray-700 flex items-center justify-center opacity-90 cursor-default"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-warm-200 text-center">
              <p className="text-xs text-gray-500">
                Once enrolled, clients can book your service, send direct inquiries, and rate your visits.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
