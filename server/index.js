import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './lib/db.js';
import User from './models/User.js';
import Sister from './models/Sister.js';
import Booking from './models/Booking.js';
import Account from './models/Account.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if running on HTTPS/production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Session Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    if (user) {
      const sisterProfile = await Sister.findOne({ userId: user._id }).lean();
      user.sisterProfile = sisterProfile;
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const profileImage = profile.photos?.[0]?.value;
    const selectedRole = req.session.oauthRole || 'buyer';

    if (!email) {
      return done(new Error("No email returned from Google"), null);
    }

    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          profileImage,
          role: selectedRole
        });

        if (selectedRole === 'sister') {
          await Sister.create({
            userId: user._id,
            name: user.name,
            specialty: "Boutique Tailoring",
            category: "tailoring",
            rate: 450,
            rateUnit: "/visit",
            avatar: user.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
            distance: "1.2 km away",
            distanceKm: 1.2,
            location: "Sector 14, Urban Enclave",
            experience: "8+ years experience in designer blouses, kurti alteration & custom bridal fits.",
            phone: "+91 98765 43210",
            availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            timeSlots: ["Morning (9 AM - 12 PM)", "Afternoon (1 PM - 4 PM)", "Evening (5 PM - 8 PM)"],
            services: [
              { id: "s1-1", name: "Designer Blouse Stitching", price: 450, duration: "60 mins" },
              { id: "s1-2", name: "Kurti & Suit Tailoring", price: 550, duration: "75 mins" }
            ],
            badges: ["Top Rated", "Skill Certified"]
          });
        }
      } else {
        user = await User.findByIdAndUpdate(user._id, { name, profileImage }, { new: true });
      }

      const providerAccountId = profile.id;
      let account = await Account.findOne({ provider: 'google', providerAccountId });
      if (!account) {
        await Account.create({
          userId: user._id,
          type: 'oauth',
          provider: 'google',
          providerAccountId
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// OAuth Authorization Route
app.get('/auth/google', (req, res, next) => {
  req.session.oauthRole = req.query.role || 'buyer';

  const hasRealGoogleKeys = process.env.GOOGLE_CLIENT_ID && 
    !process.env.GOOGLE_CLIENT_ID.includes('dummy') && 
    !process.env.GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');

  if (!hasRealGoogleKeys) {
    const selectedRole = req.session.oauthRole || 'buyer';
    const mockName = selectedRole === 'sister' ? 'Anjali Sharma' : 'Aarya Ingavale';
    const mockEmail = selectedRole === 'sister' ? 'anjali.sharma@gmail.com' : 'aaryaingavale2006@gmail.com';
    const mockAvatar = selectedRole === 'sister'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

    User.findOne({ email: mockEmail }).then(async (user) => {
      if (!user) {
        user = await User.create({ name: mockName, email: mockEmail, profileImage: mockAvatar, role: selectedRole });
      }
      req.login(user, (err) => {
        return res.redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
      });
    }).catch(() => {
      return res.redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
    });
    return;
  }

  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// OAuth Callback Route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  }
);

// Get Session User Route
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
        role: req.user.role,
        sisters: req.user.sisterProfile ? [req.user.sisterProfile] : []
      } 
    });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

// --- DIRECT MONGODB ATLAS USER SYNC & AUTH API ---

// Direct Google / Frontend Auth Sync to MongoDB Atlas
app.post('/api/auth/google-sync', async (req, res) => {
  const { name, email, profileImage, phone, role = 'buyer' } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required to sync with MongoDB" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: phone || '',
        profileImage: profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        role: role || 'buyer'
      });
      console.log(`[MongoDB Atlas] New user created: ${user.email} (${user.role})`);
    } else {
      user = await User.findByIdAndUpdate(
        user._id, 
        { 
          name: name || user.name, 
          profileImage: profileImage || user.profileImage, 
          phone: phone || user.phone,
          role: role || user.role 
        }, 
        { new: true }
      );
      console.log(`[MongoDB Atlas] User updated: ${user.email}`);
    }

    // Account record in MongoDB
    let account = await Account.findOne({ userId: user._id, provider: 'google' });
    if (!account) {
      await Account.create({
        userId: user._id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: `g-${Date.now()}`
      });
    }

    // Associated Sister Profile if role is sister
    let sisterProfile = null;
    if (user.role === 'sister') {
      sisterProfile = await Sister.findOne({ userId: user._id });
      if (!sisterProfile) {
        sisterProfile = await Sister.create({
          userId: user._id,
          name: user.name,
          specialty: "Boutique Tailoring & Crafts",
          category: "tailoring",
          rate: 450,
          rateUnit: "/visit",
          avatar: user.profileImage,
          distance: "1.2 km away",
          distanceKm: 1.2,
          location: "Urban Enclave Zone",
          experience: "Skilled artisan partner with verified qualifications.",
          phone: phone || user.phone || "+91 98765 43210",
          availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          timeSlots: ["Morning (9 AM - 12 PM)", "Afternoon (1 PM - 4 PM)", "Evening (5 PM - 8 PM)"],
          services: [
            { id: `s-${Date.now()}-1`, name: "Standard Doorstep Service", price: 450, duration: "60 mins" },
            { id: `s-${Date.now()}-2`, name: "Custom Consultation & Fitting", price: 550, duration: "75 mins" }
          ],
          badges: ["Top Rated", "Skill Certified"]
        });
      } else if (phone && (!sisterProfile.phone || sisterProfile.phone.includes('43210'))) {
        sisterProfile.phone = phone;
        await sisterProfile.save();
      }
    }

    res.json({
      success: true,
      message: "Successfully synchronized user to MongoDB Atlas",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        sisterProfile
      }
    });
  } catch (err) {
    console.error("[MongoDB Atlas] Sync error:", err);
    res.status(500).json({ error: "Failed to sync user with MongoDB Atlas", details: err.message });
  }
});

// Direct Email Register API with Database Cross-Check
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, role = 'buyer' } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: "An account with this email already exists. Please sign in instead." 
      });
    }

    const userName = name || email.split('@')[0];
    const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

    const user = await User.create({
      name: userName,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      profileImage: userAvatar,
      role
    });

    let sisterProfile = null;
    if (role === 'sister') {
      sisterProfile = await Sister.create({
        userId: user._id,
        name: user.name,
        specialty: "Boutique Tailoring & Crafts",
        category: "tailoring",
        rate: 400,
        rateUnit: "/visit",
        avatar: user.profileImage,
        distance: "1.0 km away",
        distanceKm: 1.0,
        location: "Local Community Zone",
        experience: "Skilled artisan partner with verified qualifications.",
        phone: phone || "+91 98765 43210",
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        timeSlots: ["Morning (9 AM - 12 PM)", "Afternoon (1 PM - 4 PM)", "Evening (5 PM - 8 PM)"],
        services: [
          { id: `s-${Date.now()}-1`, name: "Standard Doorstep Service", price: 400, duration: "60 mins" },
          { id: `s-${Date.now()}-2`, name: "Custom Consultation & Fitting", price: 500, duration: "75 mins" }
        ],
        badges: ["Newly Enrolled", "Skill Certified", "Self-Empowered"]
      });
    }

    console.log(`[MongoDB Atlas] New user registered: ${user.email} (${user.role}) - Phone: ${user.phone}`);
    res.status(201).json({ success: true, user, sisterProfile });
  } catch (err) {
    console.error("[MongoDB Atlas] Register error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Direct Email Login API with Database Cross-Check
app.post('/api/auth/login', async (req, res) => {
  const { email, role = 'buyer' } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "No account found with this email in database. Please register first." 
      });
    }

    let sisterProfile = null;
    if (user.role === 'sister') {
      sisterProfile = await Sister.findOne({ userId: user._id });
    }

    console.log(`[MongoDB Atlas] User verified and logged in: ${user.email}`);
    res.json({ success: true, user, sisterProfile });
  } catch (err) {
    console.error("[MongoDB Atlas] Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset Password API with Database Cross-Check
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword, role = 'buyer' } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No account found with this email in MongoDB Atlas. Please register first."
      });
    }

    user.password = newPassword;
    await user.save();

    let sisterProfile = null;
    if (user.role === 'sister') {
      sisterProfile = await Sister.findOne({ userId: user._id });
    }

    console.log(`[MongoDB Atlas] Password updated successfully for: ${user.email}`);
    res.json({
      success: true,
      message: "Password reset successful! You are now logged in.",
      user,
      sisterProfile
    });
  } catch (err) {
    console.error("[MongoDB Atlas] Reset password error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// List all registered users from MongoDB Atlas
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Sister Partner Enrollment API to MongoDB Atlas
app.post('/api/sisters/enroll', async (req, res) => {
  const sisterData = req.body;
  try {
    let user = null;
    if (sisterData.email) {
      user = await User.findOne({ email: sisterData.email });
      if (!user) {
        user = await User.create({
          name: sisterData.name,
          email: sisterData.email,
          profileImage: sisterData.avatar,
          role: 'sister'
        });
      }
    }

    const newSister = await Sister.create({
      userId: user ? user._id : undefined,
      name: sisterData.name,
      specialty: sisterData.specialty,
      category: sisterData.category || 'tailoring',
      rate: Number(sisterData.rate) || 400,
      rateUnit: sisterData.rateUnit || '/visit',
      avatar: sisterData.avatar,
      distance: sisterData.distance || '1.1 km away',
      distanceKm: Number(sisterData.distanceKm) || 1.1,
      location: sisterData.location || 'Neighborhood Zone',
      experience: sisterData.experience || '',
      phone: sisterData.phone || '',
      availableDays: sisterData.availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      timeSlots: sisterData.timeSlots || ["Morning (9 AM - 1 PM)", "Afternoon (2 PM - 6 PM)"],
      services: sisterData.services || [],
      badges: ["Newly Enrolled", "Skill Verified", "Self-Empowered"]
    });

    console.log(`[MongoDB Atlas] New Sister Shop enrolled: ${newSister.name}`);
    res.status(201).json({ success: true, sister: newSister });
  } catch (err) {
    console.error("[MongoDB Atlas] Sister enrollment error:", err);
    res.status(500).json({ error: "Failed to save sister in MongoDB Atlas", details: err.message });
  }
});

// Logout Route
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

// --- BOOKINGS & ORDERS API ENDPOINTS (MONGODB ATLAS) ---

// Create a booking / hire a sister
app.post('/api/bookings', async (req, res) => {
  const {
    sisterId,
    sisterName,
    sisterAvatar,
    specialty,
    serviceName,
    hiringPurpose,
    amount,
    visitFee,
    totalAmount,
    date,
    timeSlot,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    specialNotes
  } = req.body;

  try {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const purposeText = hiringPurpose || `Hired ${sisterName} for ${serviceName || specialty}`;

    const booking = await Booking.create({
      userId: req.user?._id,
      orderType: 'doorstep_service_booking',
      bookingRef: `UD-${randomCode}`,
      sisterId,
      sisterName,
      sisterAvatar,
      specialty,
      serviceName,
      hiringPurpose: purposeText,
      amount: Number(amount) || 0,
      visitFee: Number(visitFee) || 0,
      totalAmount: Number(totalAmount) || 0,
      date,
      timeSlot,
      customerName,
      customerEmail: customerEmail || req.user?.email || 'customer@gmail.com',
      customerPhone,
      customerAddress,
      specialNotes: specialNotes || `Doorstep appointment for ${serviceName}`,
      status: 'Pending'
    });

    console.log(`[MongoDB Atlas] New Hiring Recorded: ${customerName} (${booking.customerEmail}) hired ${sisterName} for "${purposeText}" - Total: ₹${totalAmount}`);
    res.status(201).json(booking);
  } catch (err) {
    console.error("Failed to create booking in MongoDB:", err);
    res.status(500).json({ error: "Failed to create booking in database." });
  }
});

// Create a craft product order
app.post('/api/orders', async (req, res) => {
  const {
    orderId,
    customer,
    items,
    subtotal,
    shipping,
    total,
    estimatedDelivery,
    trackingNumber,
    courierPartner
  } = req.body;

  try {
    const itemsSummary = items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Handmade crafts';

    const orderDoc = await Booking.create({
      userId: req.user?._id,
      orderType: 'handmade_product_order',
      bookingRef: orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      hiringPurpose: `Purchased Handmade Crafts: ${itemsSummary}`,
      items: items || [],
      amount: subtotal || total,
      visitFee: shipping || 0,
      totalAmount: total,
      customerName: customer?.name || 'Customer',
      customerEmail: customer?.email || req.user?.email || 'customer@gmail.com',
      customerPhone: customer?.phone || '',
      customerAddress: customer?.address || '',
      customerCity: customer?.city || '',
      customerPincode: customer?.pincode || '',
      paymentMethod: customer?.paymentMethod || 'Cash on Delivery',
      estimatedDelivery,
      trackingNumber,
      courierPartner,
      status: 'Order Confirmed'
    });

    console.log(`[MongoDB Atlas] New Craft Order Recorded: ${customer?.name} purchased "${itemsSummary}" for ₹${total}`);
    res.status(201).json(orderDoc);
  } catch (err) {
    console.error("Failed to record order in MongoDB Atlas:", err);
    res.status(500).json({ error: "Failed to save order in MongoDB" });
  }
});

// Get Bookings & Orders
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

// Update Booking Status (Accept / Reject)
app.patch('/api/bookings/:id', async (req, res) => {
  const { status } = req.body;
  
  if (!['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid booking status" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    console.log(`[MongoDB Atlas] Booking ${booking.bookingRef} updated to ${status}`);
    res.json(booking);
  } catch (err) {
    console.error("Failed to update booking status:", err);
    res.status(500).json({ error: "Failed to update status in database." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
