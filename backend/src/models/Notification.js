import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  
  // Notification Type and Category
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'scheme-update',
      'application-status',
      'document-verification',
      'event-reminder',
      'deadline-alert',
      'new-scheme',
      'complaint-update',
      'system-announcement',
      'security-alert',
      'profile-update',
      'payment-status',
      'verification-required',
      'expiry-reminder',
      'welcome',
      'promotion',
      'maintenance',
      'other'
    ]
  },
  category: {
    type: String,
    enum: ['information', 'action-required', 'reminder', 'alert', 'update', 'promotion'],
    required: [true, 'Notification category is required']
  },
  
  // Priority and Urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Content and Media
  content: {
    shortText: String, // For SMS/short notifications
    richText: String, // HTML content for rich notifications
    actionText: String, // Text for action button
    actionUrl: String, // URL for action button
    imageUrl: String,
    iconUrl: String
  },
  
  // Related Entities
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['scheme', 'event', 'complaint', 'document', 'application', 'user', 'system']
    },
    entityId: mongoose.Schema.Types.ObjectId,
    entityData: mongoose.Schema.Types.Mixed // Store relevant data snapshot
  },
  
  // Delivery Channels
  channels: {
    inApp: {
      enabled: { type: Boolean, default: true },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      read: { type: Boolean, default: false },
      readAt: Date
    },
    email: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date,
      emailId: String // Message ID from email service
    },
    sms: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      smsId: String // Message ID from SMS service
    },
    push: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date,
      pushId: String // Message ID from push service
    },
    whatsapp: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      read: { type: Boolean, default: false },
      readAt: Date,
      messageId: String
    }
  },
  
  // Scheduling
  scheduling: {
    isScheduled: { type: Boolean, default: false },
    scheduledFor: Date,
    timezone: { type: String, default: 'Asia/Kolkata' },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      },
      interval: Number, // Every N days/weeks/months
      daysOfWeek: [Number], // 0-6, Sunday is 0
      dayOfMonth: Number,
      endDate: Date,
      maxOccurrences: Number
    }
  },
  
  // Status and Lifecycle
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'delivered', 'failed', 'cancelled'],
    default: 'draft'
  },
  
  // Targeting and Personalization
  personalization: {
    variables: mongoose.Schema.Types.Mixed, // Dynamic content variables
    template: String, // Template identifier
    language: {
      type: String,
      enum: ['english', 'hindi', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada', 'odia', 'malayalam', 'punjabi'],
      default: 'english'
    }
  },
  
  // Interaction Tracking
  interactions: {
    viewed: { type: Boolean, default: false },
    viewedAt: Date,
    dismissed: { type: Boolean, default: false },
    dismissedAt: Date,
    starred: { type: Boolean, default: false },
    starredAt: Date,
    archived: { type: Boolean, default: false },
    archivedAt: Date,
    actionTaken: { type: Boolean, default: false },
    actionTakenAt: Date,
    clickCount: { type: Number, default: 0 },
    lastClickedAt: Date
  },
  
  // Campaign Information (for bulk notifications)
  campaign: {
    id: String,
    name: String,
    type: String,
    batchId: String
  },
  
  // Delivery Metadata
  delivery: {
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastAttemptAt: Date,
    failureReason: String,
    retryAt: Date,
    deliveryTime: Number, // Milliseconds taken to deliver
    ipAddress: String,
    userAgent: String,
    deviceInfo: {
      type: String,
      platform: String,
      browser: String
    }
  },
  
  // A/B Testing
  experiment: {
    testId: String,
    variant: String,
    controlGroup: Boolean
  },
  
  // Compliance and Privacy
  compliance: {
    gdprCompliant: { type: Boolean, default: true },
    canOptOut: { type: Boolean, default: true },
    retentionDays: { type: Number, default: 365 },
    autoDeleteAt: Date
  },
  
  // Tags and Categorization
  tags: [String],
  keywords: [String],
  
  // Sender Information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderInfo: {
    name: String,
    email: String,
    department: String
  },
  
  // Analytics Data
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    bounces: { type: Number, default: 0 },
    unsubscribes: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for delivery status
notificationSchema.virtual('deliveryStatus').get(function() {
  let totalChannels = 0;
  let deliveredChannels = 0;
  
  Object.keys(this.channels).forEach(channel => {
    if (this.channels[channel].enabled) {
      totalChannels++;
      if (this.channels[channel].delivered) {
        deliveredChannels++;
      }
    }
  });
  
  if (totalChannels === 0) return 'no-channels';
  if (deliveredChannels === 0) return 'pending';
  if (deliveredChannels === totalChannels) return 'delivered';
  return 'partial';
});

// Virtual for engagement status
notificationSchema.virtual('engagementStatus').get(function() {
  if (this.interactions.actionTaken) return 'action-taken';
  if (this.interactions.starred) return 'starred';
  if (this.interactions.viewed) return 'viewed';
  if (this.interactions.dismissed) return 'dismissed';
  return 'unread';
});

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
});

// Indexes
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ 'scheduling.scheduledFor': 1 });
notificationSchema.index({ 'interactions.viewed': 1 });
notificationSchema.index({ 'interactions.dismissed': 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });

// Compound indexes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, 'interactions.viewed': 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });

// Text index for search
notificationSchema.index({ title: 'text', message: 'text' });

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  // Set auto-delete date based on retention period
  if (this.isNew && this.compliance.retentionDays) {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + this.compliance.retentionDays);
    this.compliance.autoDeleteAt = deleteDate;
  }
  
  // Update delivery attempts
  if (this.isModified('status') && this.status === 'sending') {
    this.delivery.attempts = (this.delivery.attempts || 0) + 1;
    this.delivery.lastAttemptAt = new Date();
  }
  
  next();
});

// Methods
notificationSchema.methods.markAsRead = function() {
  this.channels.inApp.read = true;
  this.channels.inApp.readAt = new Date();
  this.interactions.viewed = true;
  this.interactions.viewedAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsDismissed = function() {
  this.interactions.dismissed = true;
  this.interactions.dismissedAt = new Date();
  return this.save();
};

notificationSchema.methods.star = function() {
  this.interactions.starred = !this.interactions.starred;
  this.interactions.starredAt = this.interactions.starred ? new Date() : null;
  return this.save();
};

notificationSchema.methods.archive = function() {
  this.interactions.archived = true;
  this.interactions.archivedAt = new Date();
  return this.save();
};

notificationSchema.methods.trackClick = function() {
  this.interactions.clickCount = (this.interactions.clickCount || 0) + 1;
  this.interactions.lastClickedAt = new Date();
  this.analytics.clicks = (this.analytics.clicks || 0) + 1;
  return this.save();
};

notificationSchema.methods.trackAction = function() {
  this.interactions.actionTaken = true;
  this.interactions.actionTakenAt = new Date();
  this.analytics.conversions = (this.analytics.conversions || 0) + 1;
  return this.save();
};

notificationSchema.methods.updateDeliveryStatus = function(channel, status, metadata = {}) {
  if (this.channels[channel]) {
    this.channels[channel].delivered = status === 'delivered';
    this.channels[channel].deliveredAt = status === 'delivered' ? new Date() : null;
    
    // Update channel-specific metadata
    if (metadata.messageId) {
      this.channels[channel][`${channel}Id`] = metadata.messageId;
    }
    
    // Update overall status
    if (status === 'delivered') {
      this.status = 'delivered';
    } else if (status === 'failed') {
      this.status = 'failed';
      this.delivery.failureReason = metadata.reason;
    }
  }
  
  return this.save();
};

// Static methods
notificationSchema.statics.getUnreadForUser = function(userId) {
  return this.find({
    recipient: userId,
    'channels.inApp.read': false,
    'interactions.dismissed': false,
    status: 'delivered'
  }).sort({ createdAt: -1 });
};

notificationSchema.statics.getByTypeForUser = function(userId, type) {
  return this.find({
    recipient: userId,
    type: type
  }).sort({ createdAt: -1 });
};

notificationSchema.statics.getScheduledNotifications = function() {
  const now = new Date();
  return this.find({
    status: 'scheduled',
    'scheduling.scheduledFor': { $lte: now }
  });
};

notificationSchema.statics.getFailedNotifications = function() {
  return this.find({
    status: 'failed',
    'delivery.attempts': { $lt: this.delivery.maxAttempts }
  });
};

notificationSchema.statics.getEngagementStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        delivered: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        viewed: {
          $sum: { $cond: ['$interactions.viewed', 1, 0] }
        },
        clicked: {
          $sum: { $cond: [{ $gt: ['$interactions.clickCount', 0] }, 1, 0] }
        },
        actionTaken: {
          $sum: { $cond: ['$interactions.actionTaken', 1, 0] }
        }
      }
    }
  ]);
};

notificationSchema.statics.createBulkNotifications = function(recipients, notificationData) {
  const notifications = recipients.map(recipientId => ({
    ...notificationData,
    recipient: recipientId,
    status: 'scheduled'
  }));
  
  return this.insertMany(notifications);
};

export default mongoose.model('Notification', notificationSchema);