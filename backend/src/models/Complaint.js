import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Complaint Details
  category: {
    type: String,
    required: [true, 'Complaint category is required'],
    enum: [
      'scheme-related',
      'service-delivery',
      'corruption',
      'document-issues',
      'website-technical',
      'offline-service',
      'staff-behavior',
      'delay-in-processing',
      'wrong-information',
      'accessibility',
      'payment-issues',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Complainant Information
  complainant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Complainant is required']
  },
  contactPreference: {
    type: String,
    enum: ['email', 'phone', 'both'],
    default: 'email'
  },
  
  // Department/Service Information
  relatedDepartment: {
    name: String,
    ministry: String,
    level: {
      type: String,
      enum: ['central', 'state', 'district', 'local']
    }
  },
  relatedScheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  },
  relatedService: String,
  applicationId: String, // Related application/reference ID
  
  // Location Information
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    district: String,
    city: String,
    office: String,
    pincode: String
  },
  
  // Incident Details
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required']
  },
  incidentLocation: String,
  witnessDetails: String,
  
  // Supporting Documents
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Status and Processing
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'investigating', 'action-taken', 'resolved', 'closed', 'rejected'],
    default: 'submitted'
  },
  complaintId: {
    type: String,
    unique: true
  },
  
  // Tracking and Updates
  timeline: [{
    status: String,
    description: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: { type: Date, default: Date.now },
    isVisibleToComplainant: { type: Boolean, default: true }
  }],
  
  // Assignment
  assignedTo: {
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    department: String,
    assignedAt: Date,
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Resolution
  resolution: {
    description: String,
    actionTaken: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  
  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'in-person', 'system']
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound']
    },
    content: String,
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  
  // Social Media Integration
  socialMedia: {
    twitter: {
      posted: { type: Boolean, default: false },
      tweetId: String,
      postedAt: Date,
      autoPost: { type: Boolean, default: false }
    },
    facebook: {
      posted: { type: Boolean, default: false },
      postId: String,
      postedAt: Date
    }
  },
  
  // Analytics and Metrics
  metrics: {
    responseTime: Number, // in hours
    resolutionTime: Number, // in hours
    escalationCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    lastViewed: Date
  },
  
  // Escalation
  escalation: {
    isEscalated: { type: Boolean, default: false },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalatedAt: Date,
    escalationReason: String,
    escalationLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  
  // Moderation
  moderation: {
    isApproved: { type: Boolean, default: false },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    moderationNotes: String,
    requiresModeration: { type: Boolean, default: true },
    flagged: { type: Boolean, default: false },
    flagReason: String
  },
  
  // Related Complaints
  relatedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  parentComplaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  },
  
  // Privacy Settings
  isAnonymous: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'department-only'],
    default: 'private'
  },
  
  // Reminders and Notifications
  reminders: [{
    type: {
      type: String,
      enum: ['follow-up', 'deadline', 'escalation']
    },
    scheduledFor: Date,
    sent: { type: Boolean, default: false },
    description: String
  }],
  
  // External References
  externalReferences: [{
    type: String, // RTI, Court Case, Police FIR, etc.
    referenceId: String,
    description: String,
    url: String
  }],
  
  // Tags and Keywords
  tags: [String],
  keywords: [String],
  
  // Language
  language: {
    type: String,
    enum: ['english', 'hindi', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada', 'odia', 'malayalam', 'punjabi'],
    default: 'english'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time elapsed since submission
complaintSchema.virtual('timeElapsed').get(function() {
  const now = new Date();
  const submitted = this.createdAt;
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
});

// Virtual for current SLA status
complaintSchema.virtual('slaStatus').get(function() {
  const hoursElapsed = (new Date() - this.createdAt) / (1000 * 60 * 60);
  
  // Define SLA based on priority
  const slaHours = {
    'urgent': 4,
    'high': 24,
    'medium': 72,
    'low': 168
  };
  
  const sla = slaHours[this.priority] || 72;
  
  if (this.status === 'resolved' || this.status === 'closed') {
    return 'completed';
  }
  
  if (hoursElapsed > sla) {
    return 'overdue';
  } else if (hoursElapsed > sla * 0.8) {
    return 'due-soon';
  }
  
  return 'on-time';
});

// Indexes
complaintSchema.index({ complainant: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ 'location.state': 1 });
complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ 'assignedTo.officer': 1 });
complaintSchema.index({ incidentDate: 1 });
complaintSchema.index({ title: 'text', description: 'text' });

// Compound indexes
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ category: 1, 'location.state': 1 });
complaintSchema.index({ 'assignedTo.officer': 1, status: 1 });

// Pre-save middleware to generate complaint ID
complaintSchema.pre('save', function(next) {
  if (this.isNew && !this.complaintId) {
    const prefix = 'COMP';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.complaintId = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Pre-save middleware to calculate metrics
complaintSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    // Calculate response time (time to first status update)
    if (this.status !== 'submitted' && !this.metrics.responseTime) {
      this.metrics.responseTime = Math.round((now - this.createdAt) / (1000 * 60 * 60)); // hours
    }
    
    // Calculate resolution time
    if ((this.status === 'resolved' || this.status === 'closed') && !this.metrics.resolutionTime) {
      this.metrics.resolutionTime = Math.round((now - this.createdAt) / (1000 * 60 * 60)); // hours
    }
  }
  next();
});

// Methods
complaintSchema.methods.addTimelineEntry = function(status, description, updatedBy, isVisible = true) {
  this.timeline.push({
    status,
    description,
    updatedBy,
    isVisibleToComplainant: isVisible,
    timestamp: new Date()
  });
  return this.save();
};

complaintSchema.methods.assignToOfficer = function(officerId, assignedBy) {
  this.assignedTo = {
    officer: officerId,
    assignedAt: new Date(),
    assignedBy: assignedBy
  };
  return this.addTimelineEntry('assigned', `Complaint assigned to officer`, assignedBy);
};

complaintSchema.methods.escalate = function(escalatedTo, reason, escalatedBy) {
  this.escalation.isEscalated = true;
  this.escalation.escalatedTo = escalatedTo;
  this.escalation.escalatedAt = new Date();
  this.escalation.escalationReason = reason;
  this.escalation.escalationLevel += 1;
  this.metrics.escalationCount += 1;
  
  return this.addTimelineEntry('escalated', `Complaint escalated: ${reason}`, escalatedBy);
};

complaintSchema.methods.resolve = function(resolution, resolvedBy) {
  this.status = 'resolved';
  this.resolution = {
    description: resolution.description,
    actionTaken: resolution.actionTaken,
    resolvedBy: resolvedBy,
    resolvedAt: new Date()
  };
  
  return this.addTimelineEntry('resolved', resolution.description, resolvedBy);
};

complaintSchema.methods.addCommunication = function(type, direction, content, from, to) {
  this.communications.push({
    type,
    direction,
    content,
    from,
    to,
    timestamp: new Date()
  });
  return this.save();
};

// Static methods
complaintSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('complainant', 'firstName lastName email phone');
};

complaintSchema.statics.getOverdue = function() {
  const now = new Date();
  const overdueThreshold = new Date(now.getTime() - (72 * 60 * 60 * 1000)); // 72 hours ago
  
  return this.find({
    status: { $nin: ['resolved', 'closed'] },
    createdAt: { $lt: overdueThreshold }
  });
};

complaintSchema.statics.getStatsByDepartment = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$relatedDepartment.name',
        total: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
          }
        },
        averageResolutionTime: {
          $avg: '$metrics.resolutionTime'
        }
      }
    }
  ]);
};

complaintSchema.statics.getTrendingIssues = function() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);
};

export default mongoose.model('Complaint', complaintSchema);