import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true,
    maxlength: [200, 'Scheme name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Scheme description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Scheme Details
  category: {
    type: String,
    required: [true, 'Scheme category is required'],
    enum: [
      'employment',
      'education',
      'healthcare',
      'housing',
      'agriculture',
      'business',
      'social-security',
      'tax-benefits',
      'disability',
      'women-empowerment',
      'senior-citizen',
      'skill-development',
      'startup',
      'rural-development',
      'urban-development',
      'environment',
      'technology',
      'financial-inclusion',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Government Level
  level: {
    type: String,
    required: [true, 'Scheme level is required'],
    enum: ['central', 'state', 'district', 'local']
  },
  
  // Implementing Department/Ministry
  department: {
    name: {
      type: String,
      required: [true, 'Department name is required']
    },
    ministry: String,
    website: String,
    contactEmail: String,
    contactPhone: String
  },
  
  // Eligibility Criteria
  eligibility: {
    ageRange: {
      min: {
        type: Number,
        min: 0,
        max: 100
      },
      max: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    gender: [{
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    }],
    incomeRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    category: [{
      type: String,
      enum: ['general', 'obc', 'sc', 'st', 'other']
    }],
    states: [{
      type: String
    }],
    districts: [{
      type: String
    }],
    occupations: [{
      type: String
    }],
    education: [{
      type: String,
      enum: ['below-10th', '10th', '12th', 'graduate', 'post-graduate', 'doctorate', 'other']
    }],
    maritalStatus: [{
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    }],
    isForDisabled: Boolean,
    isForMinority: Boolean,
    isForWomen: Boolean,
    isForSeniorCitizen: Boolean,
    familySizeRange: {
      min: Number,
      max: Number
    },
    additionalCriteria: [{
      field: String,
      operator: {
        type: String,
        enum: ['equals', 'not-equals', 'greater-than', 'less-than', 'contains', 'in']
      },
      value: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Benefits
  benefits: {
    type: {
      type: String,
      required: [true, 'Benefit type is required'],
      enum: ['financial', 'subsidy', 'loan', 'insurance', 'training', 'certificate', 'service', 'other']
    },
    amount: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    description: {
      type: String,
      required: [true, 'Benefit description is required']
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'half-yearly', 'yearly']
    }
  },
  
  // Application Process
  applicationProcess: {
    isOnline: {
      type: Boolean,
      default: true
    },
    isOffline: {
      type: Boolean,
      default: false
    },
    onlineUrl: String,
    steps: [{
      stepNumber: Number,
      title: String,
      description: String,
      estimatedTime: String
    }],
    processingTime: String,
    applicationFee: {
      amount: Number,
      waived: Boolean,
      waiverConditions: String
    }
  },
  
  // Required Documents
  requiredDocuments: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    isMandatory: {
      type: Boolean,
      default: true
    },
    acceptedFormats: [{
      type: String,
      enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
    }],
    maxSize: Number // in MB
  }],
  
  // Important Dates
  dates: {
    launchDate: Date,
    startDate: Date,
    endDate: Date,
    lastApplicationDate: Date,
    isAlwaysOpen: {
      type: Boolean,
      default: false
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming-soon', 'expired', 'suspended'],
    default: 'active'
  },
  
  // Multi-language Support
  translations: {
    hindi: {
      name: String,
      description: String,
      shortDescription: String
    },
    // Add other regional languages as needed
  },
  
  // SEO and Search
  keywords: [{
    type: String,
    lowercase: true
  }],
  tags: [{
    type: String,
    lowercase: true
  }],
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Trending and AI Scores
  trendingScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // External Links
  externalLinks: {
    official: String,
    guidelines: String,
    faq: String,
    helpline: String
  },
  
  // Contact Information
  helpline: {
    phone: String,
    email: String,
    hours: String
  },
  
  // Related Schemes
  relatedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  
  // Reviews and Ratings
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Admin Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for scheme URL
schemeSchema.virtual('url').get(function() {
  return `/schemes/${this.slug}`;
});

// Virtual to check if scheme is active
schemeSchema.virtual('isActive').get(function() {
  if (this.status !== 'active') return false;
  
  const now = new Date();
  
  if (this.dates.isAlwaysOpen) return true;
  
  if (this.dates.endDate && now > this.dates.endDate) return false;
  if (this.dates.lastApplicationDate && now > this.dates.lastApplicationDate) return false;
  
  return true;
});

// Virtual for days remaining
schemeSchema.virtual('daysRemaining').get(function() {
  if (this.dates.isAlwaysOpen) return null;
  
  const now = new Date();
  const endDate = this.dates.lastApplicationDate || this.dates.endDate;
  
  if (!endDate || now > endDate) return 0;
  
  const diffTime = Math.abs(endDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Indexes for search optimization
schemeSchema.index({ name: 'text', description: 'text', keywords: 'text' });
schemeSchema.index({ category: 1 });
schemeSchema.index({ level: 1 });
schemeSchema.index({ 'eligibility.states': 1 });
schemeSchema.index({ status: 1 });
schemeSchema.index({ 'dates.endDate': 1 });
schemeSchema.index({ 'dates.lastApplicationDate': 1 });
schemeSchema.index({ popularityScore: -1 });
schemeSchema.index({ trendingScore: -1 });
schemeSchema.index({ 'ratings.average': -1 });
schemeSchema.index({ createdAt: -1 });

// Compound indexes for common queries
schemeSchema.index({ status: 1, 'eligibility.states': 1, category: 1 });
schemeSchema.index({ level: 1, category: 1, status: 1 });

// Pre-save middleware to generate slug
schemeSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Pre-save middleware to update popularity score
schemeSchema.pre('save', function(next) {
  if (this.isModified('stats')) {
    // Calculate popularity based on views, applications, and bookmarks
    const views = this.stats.views || 0;
    const applications = this.stats.applications || 0;
    const bookmarks = this.stats.bookmarks || 0;
    
    // Weighted score calculation
    const viewScore = Math.min(views / 1000, 1) * 30;
    const applicationScore = Math.min(applications / 100, 1) * 40;
    const bookmarkScore = Math.min(bookmarks / 50, 1) * 30;
    
    this.popularityScore = Math.round(viewScore + applicationScore + bookmarkScore);
  }
  next();
});

// Method to check user eligibility
schemeSchema.methods.checkUserEligibility = function(user) {
  return user.checkEligibility(this.eligibility);
};

// Method to increment view count
schemeSchema.methods.incrementViews = function() {
  this.stats.views = (this.stats.views || 0) + 1;
  return this.save();
};

// Method to increment application count
schemeSchema.methods.incrementApplications = function() {
  this.stats.applications = (this.stats.applications || 0) + 1;
  return this.save();
};

// Method to increment bookmark count
schemeSchema.methods.incrementBookmarks = function() {
  this.stats.bookmarks = (this.stats.bookmarks || 0) + 1;
  return this.save();
};

// Static method to find schemes for user
schemeSchema.statics.findForUser = function(user, options = {}) {
  const query = { status: 'active' };
  
  // Filter by state if user has state information
  if (user.address && user.address.state) {
    query.$or = [
      { 'eligibility.states': { $in: [user.address.state] } },
      { 'eligibility.states': { $size: 0 } }, // No state restriction
      { level: 'central' } // Central schemes available to all
    ];
  }
  
  // Additional filters from options
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.level) {
    query.level = options.level;
  }
  
  return this.find(query);
};

// Static method to get trending schemes
schemeSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ trendingScore: -1, popularityScore: -1 })
    .limit(limit);
};

// Static method to get popular schemes
schemeSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ popularityScore: -1, 'ratings.average': -1 })
    .limit(limit);
};

export default mongoose.model('Scheme', schemeSchema);