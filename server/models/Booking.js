import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderType: { 
    type: String, 
    enum: ['doorstep_service_booking', 'handmade_product_order'], 
    default: 'doorstep_service_booking' 
  },
  bookingRef: String, // e.g. UD-10492 or ORD-94820
  
  // Who was hired / Artisan details
  sisterId: String,
  sisterName: String,
  sisterAvatar: String,
  specialty: String,
  
  // What purpose they were hired for / Service details
  serviceName: String,
  hiringPurpose: String, // e.g. "Hired for Boutique Tailoring: Designer Blouse Stitching"
  
  // Pricing
  amount: Number,
  visitFee: Number,
  totalAmount: Number,
  
  // Schedule / Delivery
  date: String,
  timeSlot: String,
  estimatedDelivery: String,
  trackingNumber: String,
  courierPartner: String,
  
  // Customer details (Who ordered / hired)
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  customerCity: String,
  customerState: String,
  customerPincode: String,
  paymentMethod: String,
  specialNotes: String, // Purpose note or custom requests from buyer
  
  // Ordered Items (for craft product purchases)
  items: [{
    id: String,
    name: String,
    artisan: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected', 'In Transit', 'Order Confirmed', 'Delivered'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
