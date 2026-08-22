import React from 'react';
import { useOrders } from '../../context/OrdersContext';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Download, 
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function OrderTrackingModal() {
  const { selectedOrderForTracking, setSelectedOrderForTracking, isMyOrdersOpen, setIsMyOrdersOpen, orders } = useOrders();

  const activeOrder = selectedOrderForTracking || (isMyOrdersOpen && orders.length > 0 ? orders[0] : null);

  if (!selectedOrderForTracking && !isMyOrdersOpen) return null;

  const handleClose = () => {
    setSelectedOrderForTracking(null);
    setIsMyOrdersOpen(false);
  };

  const steps = [
    { label: "Order Confirmed", desc: "Payment received & sent to artisan", icon: CheckCircle2 },
    { label: "Packaged by Artisan", desc: "Crafted & packed at village SHG", icon: Package },
    { label: "In Transit", desc: "Dispatched via Speed Post / Courier", icon: Truck },
    { label: "Delivered", desc: "Arriving at your doorstep", icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-6 flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-pink-300">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">Order Details & Tracking</h2>
                {activeOrder && (
                  <span className="font-mono text-xs bg-white/20 text-white px-2 py-0.5 rounded-md font-bold">
                    {activeOrder.orderId}
                  </span>
                )}
              </div>
              <p className="text-xs text-pink-200">Track your handmade treasures from rural artisans</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        {activeOrder ? (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-[#faf7f5]">
            
            {/* Delivery Estimate Banner */}
            <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-pink-700 block">
                  Estimated Delivery
                </span>
                <span className="text-base font-extrabold text-gray-900">
                  {activeOrder.estimatedDelivery}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Courier Tracking ID</span>
                <span className="text-xs font-mono font-bold text-gray-700">
                  {activeOrder.trackingNumber}
                </span>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4">
                Shipment Status
              </h4>

              <div className="relative flex justify-between items-start">
                {/* Horizontal line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-warm-200 -z-0" />
                <div 
                  className="absolute top-4 left-6 h-0.5 bg-[#d81b60] transition-all -z-0"
                  style={{ width: `${(activeOrder.currentStep / (steps.length - 1)) * 90}%` }}
                />

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= activeOrder.currentStep;
                  const isCurrent = idx === activeOrder.currentStep;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center z-10 max-w-[80px]">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#d81b60] text-white ring-4 ring-pink-100 shadow-sm'
                            : 'bg-warm-100 text-gray-400 border border-warm-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-[#d81b60]' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-0.5 hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Items in this Package
              </h4>

              <div className="space-y-3 divide-y divide-warm-100">
                {activeOrder.items.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-warm-200"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                        <p className="text-[10px] text-pink-700 flex items-center gap-1 mt-0.5">
                          <HeartHandshake className="w-3 h-3" />
                          <span>{item.artisan}</span>
                        </p>
                        <span className="text-[11px] text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-warm-200 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d81b60]" />
                  <span>Delivery Address</span>
                </div>
                <p className="font-semibold text-gray-800">{activeOrder.customer?.name}</p>
                <p>{activeOrder.customer?.address}</p>
                <p>{activeOrder.customer?.city} - {activeOrder.customer?.pincode}</p>
                <p className="text-gray-500">Phone: {activeOrder.customer?.phone}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-warm-200 text-xs text-gray-600 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-gray-900 block mb-1">Payment Summary</span>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(activeOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Artisan Shipping</span>
                    <span className="text-emerald-600 font-bold">
                      {activeOrder.shipping === 0 ? 'FREE' : formatCurrency(activeOrder.shipping)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-warm-200 text-sm">
                  <span>Total Amount</span>
                  <span className="text-pink-700">{formatCurrency(activeOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/919876543210?text=Hello%20Udaan%20Support,%20I%20am%20inquiring%20about%20my%20order%20${activeOrder.orderId}.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order Helpdesk</span>
              </a>

              <button
                onClick={() => alert(`Receipt downloaded for Order ${activeOrder.orderId} (₹${activeOrder.total})`)}
                className="flex-1 bg-warm-200 hover:bg-warm-300 text-gray-800 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center space-y-3 bg-[#faf7f5]">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-700 font-serif">No Orders Found</h3>
            <p className="text-xs text-gray-500">Explore the handmade craft store and place your first order.</p>
          </div>
        )}

      </div>
    </div>
  );
}
