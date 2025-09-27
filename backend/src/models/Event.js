import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Event Details
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      'workshop',
      'seminar',
      'training',
      'webinar',
      'conference',
      'awareness-camp',
      'health-camp',
      'skill-development',
      'job-fair',
      'exhibition',
      'consultation',
      'registration-drive',
      'document-verification',
      'other'
    ]
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'education',
      'healthcare',
      'employment',
      'skill-development',
      'awareness',
      'government-schemes',
      'digital-literacy',
      'financial-literacy',
      'agriculture',
      'business',
      'women-empowerment',
      'youth-development',
      'senior-citizen',
      'disability',
      'other'
    ]
  },
  
  // Date and Time
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Start date and time is required']
    },
    end: {
      type: Date,
      required: [true, 'End date and time is required']
    }
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      required: [true, 'Event type (online/offline/hybrid) is required']
    },
    venue: {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    onlineDetails: {
      platform: String, // Zoom, Google Meet, etc.
      meetingId: String,
      password: String,
      joinUrl: String,
      dialInNumbers: [String]
    }
  },
  
  // Organizer Information
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizer name is required']
    },
    department: String,
    ministry: String,
    contactPerson: {
      name: String,
      designation: String,
      phone: String,
      email: String
    },
    website: String
  },
  
  // Registration Details
  registration: {
    isRequired: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    startDate: Date,
    endDate: Date,
    maxParticipants: Number,
    currentParticipants: {
      type: Number,
      default: 0
    },
    fee: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'INR'
      },
      isFree: {
        type: Boolean,
        default: true
      }
    },
    requirements: [String],
    instructions: String
  },
  
  // Eligibility
  eligibility: {
    ageRange: {
      min: Number,
      max: Number
    },
    gender: [{
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    }],
    education: [{
      type: String,
      enum: ['below-10th', '10th', '12th', 'graduate', 'post-graduate', 'doctorate', 'other']
    }],
    occupation: [String],
    states: [String],
    districts: [String],
    category: [{
      type: String,
      enum: ['general', 'obc', 'sc', 'st', 'other']
    }],
    isForDisabled: Boolean,
    isForWomen: Boolean,
    isForMinority: Boolean,
    additionalCriteria: String
  },
  
  // Content and Resources
  agenda: [{
    time: String,
    topic: String,
    speaker: {
      name: String,
      designation: String,
      organization: String,
      bio: String
    },
    duration: String
  }],
  speakers: [{
    name: {
      type: String,
      required: true
    },
    designation: String,
    organization: String,
    bio: String,
    photo: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['document', 'presentation', 'video', 'audio', 'link']
    },
    url: String,
    description: String
  }],
  
  // Related Information
  relatedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  relatedServices: [String],
  tags: [String],
  keywords: [String],
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  
  // Notifications
  notifications: {
    reminder1: {
      sent: { type: Boolean, default: false },
      scheduledFor: Date
    },
    reminder2: {
      sent: { type: Boolean, default: false },
      scheduledFor: Date
    },
    followUp: {
      sent: { type: Boolean, default: false },
      scheduledFor: Date
    }
  },
  
  // Media
  images: [String],
  banner: String,
  
  // Statistics
  stats: {
    views: { type: Number, default: 0 },
    registrations: { type: Number, default: 0 },
    attendees: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },
  
  // Feedback
  feedback: {
    isEnabled: { type: Boolean, default: true },
    questions: [{
      question: String,
      type: { type: String, enum: ['rating', 'text', 'multiple-choice'] },
      options: [String]
    }],
    responses: [{
      participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      answers: [{
        questionIndex: Number,
        answer: mongoose.Schema.Types.Mixed
      }],
      submittedAt: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 }
  },
  
  // Certificates
  certificate: {
    isEnabled: { type: Boolean, default: false },
    template: String,
    criteria: {
      attendancePercentage: { type: Number, default: 75 },
      completionRequired: { type: Boolean, default: true }
    }
  },
  
  // Admin Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for event status based on current time
eventSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  const startTime = this.dateTime.start;
  const endTime = this.dateTime.end;
  
  if (this.status === 'cancelled' || this.status === 'postponed') {
    return this.status;
  }
  
  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  
  if (!this.registration.isOpen) return 'closed';
  if (this.registration.endDate && now > this.registration.endDate) return 'closed';
  if (this.registration.maxParticipants && 
      this.registration.currentParticipants >= this.registration.maxParticipants) return 'full';
  
  return 'open';
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const startTime = this.dateTime.start;
  
  if (now > startTime) return 0;
  
  const diffTime = Math.abs(startTime - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Indexes
eventSchema.index({ 'dateTime.start': 1 });
eventSchema.index({ 'dateTime.end': 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'location.venue.address.state': 1 });
eventSchema.index({ 'location.venue.address.city': 1 });
eventSchema.index({ 'eligibility.states': 1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ title: 'text', description: 'text', keywords: 'text' });

// Compound indexes
eventSchema.index({ status: 1, 'dateTime.start': 1 });
eventSchema.index({ category: 1, 'dateTime.start': 1 });
eventSchema.index({ 'location.venue.address.state': 1, 'dateTime.start': 1 });

// Methods
eventSchema.methods.canUserRegister = function(user) {
  // Check if registration is open
  if (this.registrationStatus !== 'open') return false;
  
  // Check eligibility
  const eligibility = this.eligibility;
  
  // Age check
  if (eligibility.ageRange) {
    const age = user.age;
    if (age < eligibility.ageRange.min || age > eligibility.ageRange.max) {
      return false;
    }
  }
  
  // Gender check
  if (eligibility.gender && eligibility.gender.length > 0) {
    if (!eligibility.gender.includes(user.gender)) return false;
  }
  
  // State check
  if (eligibility.states && eligibility.states.length > 0) {
    if (!eligibility.states.includes(user.address.state)) return false;
  }
  
  // Education check
  if (eligibility.education && eligibility.education.length > 0) {
    if (!eligibility.education.includes(user.education)) return false;
  }
  
  // Occupation check
  if (eligibility.occupation && eligibility.occupation.length > 0) {
    if (!eligibility.occupation.includes(user.occupation)) return false;
  }
  
  // Category check
  if (eligibility.category && eligibility.category.length > 0) {
    if (!eligibility.category.includes(user.category)) return false;
  }
  
  // Special eligibility checks
  if (eligibility.isForDisabled && !user.isDisabled) return false;
  if (eligibility.isForWomen && user.gender !== 'female') return false;
  if (eligibility.isForMinority && !user.isMinority) return false;
  
  return true;
};

eventSchema.methods.incrementViews = function() {
  this.stats.views = (this.stats.views || 0) + 1;
  return this.save();
};

eventSchema.methods.incrementRegistrations = function() {
  this.stats.registrations = (this.stats.registrations || 0) + 1;
  this.registration.currentParticipants = (this.registration.currentParticipants || 0) + 1;
  return this.save();
};

// Static methods
eventSchema.statics.getUpcoming = function(limit = 10) {
  const now = new Date();
  return this.find({
    status: 'published',
    'dateTime.start': { $gt: now }
  })
    .sort({ 'dateTime.start': 1 })
    .limit(limit);
};

eventSchema.statics.getOngoing = function() {
  const now = new Date();
  return this.find({
    status: 'published',
    'dateTime.start': { $lte: now },
    'dateTime.end': { $gte: now }
  });
};

eventSchema.statics.findForUser = function(user, options = {}) {
  const query = { status: 'published' };
  
  // Filter by user's state
  if (user.address && user.address.state) {
    query.$or = [
      { 'eligibility.states': { $in: [user.address.state] } },
      { 'eligibility.states': { $size: 0 } }
    ];
  }
  
  // Additional filters
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  if (options.upcoming) {
    query['dateTime.start'] = { $gt: new Date() };
  }
  
  return this.find(query);
};

export default mongoose.model('Event', eventSchema);