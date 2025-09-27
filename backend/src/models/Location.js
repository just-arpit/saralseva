import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Location Type
  type: {
    type: String,
    required: [true, 'Location type is required'],
    enum: [
      'government-office',
      'service-center',
      'bank',
      'post-office',
      'court',
      'police-station',
      'hospital',
      'school',
      'college',
      'training-center',
      'csc', // Common Service Center
      'jan-aushadhi',
      'ration-shop',
      'atm',
      'other'
    ]
  },
  category: {
    type: String,
    enum: ['central', 'state', 'district', 'local', 'private', 'ngo'],
    required: [true, 'Category is required']
  },
  
  // Address Information
  address: {
    building: String,
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    area: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    district: String,
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: String
  },
  
  // Geographic Coordinates
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    }
  },
  
  // Contact Information
  contact: {
    phone: [{
      number: String,
      type: {
        type: String,
        enum: ['primary', 'secondary', 'helpline', 'fax']
      },
      isWhatsApp: { type: Boolean, default: false }
    }],
    email: [{
      address: String,
      type: {
        type: String,
        enum: ['primary', 'secondary', 'complaints', 'info']
      }
    }],
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String
    }
  },
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: true } },
    holidays: [{
      date: Date,
      name: String,
      isClosed: { type: Boolean, default: true }
    }],
    lunchBreak: {
      start: String,
      end: String,
      hasLunchBreak: { type: Boolean, default: false }
    },
    specialHours: [{
      date: Date,
      open: String,
      close: String,
      reason: String
    }]
  },
  
  // Services Offered
  services: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    category: String,
    isDigital: { type: Boolean, default: false },
    processingTime: String,
    fee: {
      amount: Number,
      currency: { type: String, default: 'INR' },
      isFree: { type: Boolean, default: true }
    },
    requiredDocuments: [String],
    onlineAvailable: { type: Boolean, default: false },
    onlineUrl: String
  }],
  
  // Related Schemes
  relatedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  
  // Staff Information
  staff: [{
    name: String,
    designation: String,
    department: String,
    phone: String,
    email: String,
    isAvailable: { type: Boolean, default: true },
    languages: [String]
  }],
  
  // Accessibility Features
  accessibility: {
    wheelchairAccessible: { type: Boolean, default: false },
    hasRamp: { type: Boolean, default: false },
    hasElevator: { type: Boolean, default: false },
    hasBrailleSignage: { type: Boolean, default: false },
    hasSignLanguage: { type: Boolean, default: false },
    hasAudioAnnouncements: { type: Boolean, default: false },
    parkingAvailable: { type: Boolean, default: false },
    publicTransportNearby: { type: Boolean, default: false }
  },
  
  // Facilities
  facilities: {
    waitingArea: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    restrooms: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    photocopying: { type: Boolean, default: false },
    aadhaarServices: { type: Boolean, default: false },
    bankingServices: { type: Boolean, default: false }
  },
  
  // Transportation
  transportation: {
    nearestBusStop: {
      name: String,
      distance: Number // in meters
    },
    nearestMetroStation: {
      name: String,
      distance: Number // in meters
    },
    nearestRailwayStation: {
      name: String,
      distance: Number // in meters
    },
    directions: {
      fromBusStop: String,
      fromMetroStation: String,
      fromRailwayStation: String,
      byVehicle: String
    }
  },
  
  // Ratings and Reviews
  ratings: {
    overall: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 }
    },
    service: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 }
    },
    staff: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 }
    },
    facilities: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 }
    }
  },
  
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      overall: { type: Number, min: 1, max: 5 },
      service: { type: Number, min: 1, max: 5 },
      staff: { type: Number, min: 1, max: 5 },
      facilities: { type: Number, min: 1, max: 5 }
    },
    comment: String,
    visitDate: Date,
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Statistics
  stats: {
    views: { type: Number, default: 0 },
    checkIns: { type: Number, default: 0 },
    directionsRequested: { type: Number, default: 0 },
    phoneNumberClicks: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 }
  },
  
  // Status and Verification
  status: {
    type: String,
    enum: ['active', 'inactive', 'temporarily-closed', 'permanently-closed', 'relocated'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  lastUpdated: Date,
  
  // Images and Media
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'staff', 'services', 'facilities']
    },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Additional Information
  languages: [{
    type: String,
    enum: ['english', 'hindi', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada', 'odia', 'malayalam', 'punjabi']
  }],
  
  // Notification and Alert Settings
  alerts: [{
    type: {
      type: String,
      enum: ['closure', 'delay', 'special-hours', 'staff-unavailable']
    },
    message: String,
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  }],
  
  // Tags and Keywords
  tags: [String],
  keywords: [String],
  
  // Admin Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current operating status
locationSchema.virtual('currentOperatingStatus').get(function() {
  if (this.status !== 'active') return this.status;
  
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todayHours = this.operatingHours[currentDay];
  
  if (todayHours.isClosed) return 'closed';
  
  // Check if currently in lunch break
  if (this.operatingHours.lunchBreak.hasLunchBreak) {
    const lunchStart = this.operatingHours.lunchBreak.start;
    const lunchEnd = this.operatingHours.lunchBreak.end;
    if (currentTime >= lunchStart && currentTime <= lunchEnd) {
      return 'lunch-break';
    }
  }
  
  // Check if within operating hours
  if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
    return 'open';
  }
  
  return 'closed';
});

// Virtual for distance calculation (requires user location)
locationSchema.virtual('distance').get(function() {
  // This would be calculated dynamically with user's location
  return null;
});

// Indexes for geospatial queries
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ 'address.state': 1 });
locationSchema.index({ 'address.city': 1 });
locationSchema.index({ 'address.pincode': 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ category: 1 });
locationSchema.index({ status: 1 });
locationSchema.index({ name: 'text', description: 'text', 'services.name': 'text' });

// Compound indexes
locationSchema.index({ type: 1, 'address.state': 1 });
locationSchema.index({ status: 1, type: 1 });
locationSchema.index({ 'address.city': 1, type: 1 });

// Methods
locationSchema.methods.incrementViews = function() {
  this.stats.views = (this.stats.views || 0) + 1;
  return this.save();
};

locationSchema.methods.checkIn = function() {
  this.stats.checkIns = (this.stats.checkIns || 0) + 1;
  return this.save();
};

locationSchema.methods.addReview = function(userId, rating, comment, visitDate) {
  this.reviews.push({
    user: userId,
    rating,
    comment,
    visitDate: visitDate || new Date(),
    createdAt: new Date()
  });
  
  // Update average ratings
  this.calculateAverageRatings();
  return this.save();
};

locationSchema.methods.calculateAverageRatings = function() {
  const reviews = this.reviews.filter(review => review.isApproved);
  
  if (reviews.length === 0) return;
  
  const totals = {
    overall: 0,
    service: 0,
    staff: 0,
    facilities: 0
  };
  
  reviews.forEach(review => {
    totals.overall += review.rating.overall || 0;
    totals.service += review.rating.service || 0;
    totals.staff += review.rating.staff || 0;
    totals.facilities += review.rating.facilities || 0;
  });
  
  this.ratings.overall.average = (totals.overall / reviews.length).toFixed(1);
  this.ratings.overall.count = reviews.length;
  this.ratings.service.average = (totals.service / reviews.length).toFixed(1);
  this.ratings.service.count = reviews.length;
  this.ratings.staff.average = (totals.staff / reviews.length).toFixed(1);
  this.ratings.staff.count = reviews.length;
  this.ratings.facilities.average = (totals.facilities / reviews.length).toFixed(1);
  this.ratings.facilities.count = reviews.length;
};

locationSchema.methods.isOpenNow = function() {
  return this.currentOperatingStatus === 'open';
};

// Static methods for geospatial queries
locationSchema.statics.findNearby = function(latitude, longitude, maxDistance = 5000, type = null) {
  const query = {
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query);
};

locationSchema.statics.findByCity = function(city, type = null) {
  const query = {
    'address.city': new RegExp(city, 'i'),
    status: 'active'
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query);
};

locationSchema.statics.findByPincode = function(pincode) {
  return this.find({
    'address.pincode': pincode,
    status: 'active'
  });
};

locationSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'stats.views': -1, 'ratings.overall.average': -1 })
    .limit(limit);
};

export default mongoose.model('Location', locationSchema);