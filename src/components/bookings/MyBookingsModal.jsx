import React from 'react';
import { useBookings } from '../../context/BookingContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function MyBookingsModal() {
  const { bookings, isMyBookingsOpen, setIsMyBookingsOpen, cancelBooking } = useBookings();

  if (!isMyBookingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6 flex flex-col max-h-[85vh] animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-pink-300" />
            <div>
              <h2 className="text-xl font-bold font-serif">My Service Bookings</h2>
              <p className="text-xs text-pink-200">Track and manage your upcoming doorstep visits</p>
            </div>
          </div>

          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#faf7f5]">
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-warm-200 p-6">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800 font-serif">No Bookings Yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                Browse our verified Skilled Sisters and schedule your first home visit!
              </p>
            </div>
          ) : (
            bookings.map(booking => {
              const isCancelled = booking.status === 'Cancelled';

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-sm ${
                    isCancelled ? 'border-gray-200 opacity-60' : 'border-warm-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-warm-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                          {booking.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isCancelled
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 font-serif mt-1.5">
                        {booking.serviceName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Provided by <strong className="text-gray-800">{booking.sisterName}</strong> ({booking.specialty})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-pink-700">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                      <span className="text-[10px] text-gray-400 block">Pay after service</span>
                    </div>
                  </div>

                  {/* Visit Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-3 bg-warm-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-pink" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-pink" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-start gap-1.5 sm:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-pink shrink-0 mt-0.5" />
                      <span className="truncate">{booking.customerAddress}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isCancelled && (
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs text-gray-500 hover:text-red-600 font-semibold"
                      >
                        Cancel Booking
                      </button>

                      <a
                        href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(booking.sisterName)},%20inquiring%20about%20my%20booking%20${booking.bookingRef}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Her</span>
                      </a>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-warm-200 text-center">
          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="px-6 py-2 bg-warm-200 hover:bg-warm-300 text-gray-800 font-semibold rounded-xl text-xs sm:text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
