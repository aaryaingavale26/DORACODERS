import React, { useState } from 'react';
import { useSisters } from '../../context/SistersContext';
import { useBookings } from '../../context/BookingContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Navigation,
  MessageCircle
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SisterBookingModal() {
  const { selectedSisterForBooking, setSelectedSisterForBooking, userLocation } = useSisters();
  const { createBooking, setIsMyBookingsOpen } = useBookings();

  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState("Morning (9 AM - 12 PM)");
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState(userLocation?.address || '');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!selectedSisterForBooking) return null;

  const sister = selectedSisterForBooking;
  const activeService = selectedService || (sister.services && sister.services[0]) || {
    name: `${sister.specialty} Doorstep Visit`,
    price: sister.rate
  };

  const servicePrice = activeService.price || sister.rate;
  const visitFee = 50;
  const totalAmount = servicePrice + visitFee;

  const handleClose = () => {
    setSelectedSisterForBooking(null);
    setConfirmedBooking(null);
  };

  // Auto-detect current GPS location and fill address
  const handleUseCurrentLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              setIsDetectingLocation(false);
              if (data && data.display_name) {
                setCustomerAddress(data.display_name);
              } else {
                setCustomerAddress(`GPS: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)} (${userLocation.city || 'Local Area'})`);
              }
            })
            .catch(() => {
              setIsDetectingLocation(false);
              setCustomerAddress(`GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            });
        },
        () => {
          setIsDetectingLocation(false);
          if (userLocation?.address) {
            setCustomerAddress(userLocation.address);
          } else {
            alert("Could not access GPS. Please type your address manually.");
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetectingLocation(false);
      if (userLocation?.address) {
        setCustomerAddress(userLocation.address);
      }
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please provide your name, contact phone number, and doorstep address.");
      return;
    }

    const newBooking = await createBooking({
      sisterId: sister.id,
      sisterName: sister.name,
      sisterAvatar: sister.avatar,
      specialty: sister.specialty,
      serviceName: activeService.name,
      amount: servicePrice,
      visitFee,
      totalAmount,
      date,
      timeSlot,
      customerName,
      customerPhone,
      customerAddress,
      specialNotes
    });

    setConfirmedBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6 animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-5 top-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/60 shrink-0">
              <img src={sister.avatar} alt={sister.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif">{sister.name}</h3>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {Number(sister.rating).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-pink-200">{sister.specialty} • {sister.distance || '3km zone'}</p>
            </div>
          </div>
        </div>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Booking Confirmed</span>
              <h2 className="text-2xl font-bold text-gray-900 font-serif mt-1">
                Appointment Scheduled!
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Booking Reference: <span className="font-mono font-bold text-pink-700">{confirmedBooking.bookingRef}</span>
              </p>
            </div>

            <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-warm-200">
                <span className="text-gray-500">Service:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-warm-200">
                <span className="text-gray-500">Date & Slot:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-warm-200">
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-warm-200">
                <span className="text-gray-500">Doorstep Address:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[250px]">{confirmedBooking.customerAddress}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-gray-900 pt-1">
                <span>Total Amount to Pay on Visit:</span>
                <span className="text-pink-700 text-base">{formatCurrency(confirmedBooking.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(sister.name)},%20I%20have%20booked%20your%20service%20(${confirmedBooking.bookingRef})%20on%20${confirmedBooking.date}.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Her on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  handleClose();
                  setIsMyBookingsOpen(true);
                }}
                className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>View in My Bookings</span>
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
            
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                1. Select Desired Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(sister.services || []).map(svc => {
                  const isSelected = activeService.id === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-pink bg-pink-50/60 ring-2 ring-pink-300'
                          : 'border-warm-200 hover:border-pink-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-900">{svc.name}</span>
                        <span className="text-xs font-bold text-pink-700">{formatCurrency(svc.price)}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 mt-1">{svc.duration || '60 mins'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Time Slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                2. Preferred Date & Time
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Select Date</span>
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-warm-300 bg-warm-50 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                    <Clock className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Select Time Slot</span>
                  </div>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-warm-300 bg-warm-50 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                    <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Contact Phone & Doorstep Address with GPS Option */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  3. Contact Phone & Doorstep Location
                </label>
                
                {/* Use Current GPS Location Auto-Fill Button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isDetectingLocation}
                  className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-brand-pink border border-pink-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Auto-fill address with your live device GPS"
                >
                  <Navigation className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Locating...' : '📍 Use Current Location (GPS)'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Megha Agarwal"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Doorstep Service Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Complete Address, House/Flat No, Landmark, Area..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Special instructions or specific requests for the sister..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 resize-none"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-warm-100 p-4 rounded-2xl border border-warm-200 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{activeService.name}</span>
                <span className="font-semibold">{formatCurrency(servicePrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Doorstep Travel & Safety Hygiene</span>
                <span className="font-semibold">{formatCurrency(visitFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-warm-300 text-sm sm:text-base">
                <span>Total Payable (Pay After Service)</span>
                <span className="text-pink-700">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-600/30 active:scale-95 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Schedule Visit</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
