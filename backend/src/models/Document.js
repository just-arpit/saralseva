import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Document Type and Category
  type: {
    type: String,
    required: [true, 'Document type is required'],
    enum: [
      'aadhaar',
      'pan',
      'passport',
      'driving-license',
      'voter-id',
      'ration-card',
      'income-certificate',
      'caste-certificate',
      'birth-certificate',
      'death-certificate',
      'marriage-certificate',
      'educational-certificate',
      'bank-statement',
      'salary-slip',
      'property-document',
      'medical-certificate',
      'disability-certificate',
      'business-registration',
      'other'
    ]
  },
  category: {
    type: String,
    enum: ['identity', 'address', 'income', 'educational', 'medical', 'legal', 'financial', 'other'],
    required: [true, 'Document category is required']
  },
  
  // File Information
  file: {
    filename: {
      type: String,
      required: [true, 'Filename is required']
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required']
    },
    path: {
      type: String,
      required: [true, 'File path is required']
    },
    url: String, // Public URL if using cloud storage
    mimetype: {
      type: String,
      required: [true, 'MIME type is required']
    },
    size: {
      type: Number,
      required: [true, 'File size is required']
    },
    hash: String, // File hash for integrity check
    encoding: String
  },
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Document owner is required']
  },
  
  // Verification Status
  verification: {
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'verified', 'rejected', 'expired'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['manual', 'ai', 'api', 'hybrid'],
      default: 'hybrid'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    aiAnalysis: {
      ocrText: String,
      extractedData: mongoose.Schema.Types.Mixed,
      qualityScore: Number,
      fraudDetection: {
        isFraud: Boolean,
        confidence: Number,
        reasons: [String]
      },
      matchScore: Number // Similarity with other documents
    },
    manualReview: {
      required: { type: Boolean, default: false },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reviewedAt: Date,
      comments: String,
      approved: Boolean
    }
  },
  
  // Document Details
  details: {
    documentNumber: String,
    issueDate: Date,
    expiryDate: Date,
    issuingAuthority: String,
    placeOfIssue: String,
    holderName: String,
    fatherName: String,
    motherName: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    additionalData: mongoose.Schema.Types.Mixed
  },
  
  // Cross-References
  crossReferences: [{
    platform: {
      type: String,
      enum: ['digilocker', 'aadhaar-api', 'pan-api', 'passport-api', 'driving-license-api']
    },
    referenceId: String,
    status: {
      type: String,
      enum: ['matched', 'not-matched', 'pending', 'error']
    },
    lastChecked: Date,
    confidence: Number
  }],
  
  // Related Schemes and Applications
  relatedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  applications: [{
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme'
    },
    applicationId: String,
    submittedAt: Date,
    status: String
  }],
  
  // Privacy and Security
  privacy: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      purpose: String,
      sharedAt: Date,
      expiresAt: Date,
      permissions: [{
        type: String,
        enum: ['view', 'download', 'verify']
      }]
    }],
    accessHistory: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      action: {
        type: String,
        enum: ['view', 'download', 'verify', 'share', 'update']
      },
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String
    }]
  },
  
  // Compliance and Audit
  compliance: {
    gdprCompliant: { type: Boolean, default: true },
    retentionPeriod: Number, // in days
    autoDeleteDate: Date,
    auditTrail: [{
      action: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: { type: Date, default: Date.now },
      details: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Version Control
  version: {
    current: { type: Number, default: 1 },
    history: [{
      version: Number,
      filename: String,
      path: String,
      uploadedAt: Date,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      changeReason: String
    }]
  },
  
  // Quality and Processing
  quality: {
    resolution: {
      width: Number,
      height: Number,
      dpi: Number
    },
    clarity: {
      score: Number,
      isBlurry: Boolean,
      isRotated: Boolean,
      needsEnhancement: Boolean
    },
    completeness: {
      score: Number,
      missingCorners: Boolean,
      hasWatermark: Boolean,
      isComplete: Boolean
    }
  },
  
  // DigiLocker Integration
  digilocker: {
    isFromDigilocker: { type: Boolean, default: false },
    uri: String,
    docType: String,
    issuer: String,
    timestamp: Date,
    signature: String,
    isVerified: Boolean
  },
  
  // Thumbnails and Previews
  thumbnails: [{
    size: String, // 'small', 'medium', 'large'
    path: String,
    url: String
  }],
  
  // Metadata
  metadata: {
    exifData: mongoose.Schema.Types.Mixed,
    creationTime: Date,
    modificationTime: Date,
    deviceInfo: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Status and Flags
  status: {
    type: String,
    enum: ['draft', 'submitted', 'processing', 'verified', 'rejected', 'expired', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  
  // Notification Settings
  notifications: {
    expiryReminder: {
      enabled: { type: Boolean, default: true },
      daysBefore: { type: Number, default: 30 },
      sent: { type: Boolean, default: false }
    },
    verificationUpdate: {
      enabled: { type: Boolean, default: true }
    }
  },
  
  // Tags and Keywords
  tags: [String],
  keywords: [String],
  
  // Notes and Comments
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for document age
documentSchema.virtual('age').get(function() {
  if (!this.details.issueDate) return null;
  const now = new Date();
  const issueDate = new Date(this.details.issueDate);
  const diffTime = Math.abs(now - issueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for expiry status
documentSchema.virtual('expiryStatus').get(function() {
  if (!this.details.expiryDate) return 'no-expiry';
  
  const now = new Date();
  const expiryDate = new Date(this.details.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring-soon';
  if (daysUntilExpiry <= 90) return 'expiring-in-3-months';
  
  return 'valid';
});

// Virtual for file size in human readable format
documentSchema.virtual('fileSizeHuman').get(function() {
  const bytes = this.file.size;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Indexes
documentSchema.index({ owner: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ 'verification.status': 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ 'details.documentNumber': 1 });
documentSchema.index({ 'details.expiryDate': 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ title: 'text', description: 'text' });

// Compound indexes
documentSchema.index({ owner: 1, type: 1 });
documentSchema.index({ owner: 1, status: 1 });
documentSchema.index({ type: 1, 'verification.status': 1 });

// Pre-save middleware
documentSchema.pre('save', function(next) {
  // Set auto-delete date based on retention policy
  if (this.isNew && this.compliance.retentionPeriod) {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + this.compliance.retentionPeriod);
    this.compliance.autoDeleteDate = deleteDate;
  }
  
  // Update version history
  if (this.isModified('file') && !this.isNew) {
    this.version.history.push({
      version: this.version.current,
      filename: this.file.filename,
      path: this.file.path,
      uploadedAt: new Date(),
      uploadedBy: this.owner // Should be set by the controller
    });
    this.version.current += 1;
  }
  
  next();
});

// Methods
documentSchema.methods.addAccessLog = function(userId, action, ipAddress, userAgent) {
  this.privacy.accessHistory.push({
    user: userId,
    action,
    timestamp: new Date(),
    ipAddress,
    userAgent
  });
  return this.save();
};

documentSchema.methods.shareWith = function(userId, purpose, permissions, expiresAt) {
  // Remove existing share if any
  this.privacy.sharedWith = this.privacy.sharedWith.filter(
    share => !share.user.equals(userId)
  );
  
  // Add new share
  this.privacy.sharedWith.push({
    user: userId,
    purpose,
    sharedAt: new Date(),
    expiresAt,
    permissions
  });
  
  return this.save();
};

documentSchema.methods.updateVerificationStatus = function(status, verifiedBy, confidence, aiAnalysis) {
  this.verification.status = status;
  this.verification.verifiedBy = verifiedBy;
  this.verification.verifiedAt = new Date();
  this.verification.confidence = confidence;
  
  if (aiAnalysis) {
    this.verification.aiAnalysis = aiAnalysis;
  }
  
  // Add audit entry
  this.compliance.auditTrail.push({
    action: 'verification_updated',
    performedBy: verifiedBy,
    timestamp: new Date(),
    details: { status, confidence }
  });
  
  return this.save();
};

documentSchema.methods.addNote = function(content, addedBy, isPrivate = false) {
  this.notes.push({
    content,
    addedBy,
    addedAt: new Date(),
    isPrivate
  });
  return this.save();
};

// Static methods
documentSchema.statics.getExpiringDocuments = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    'details.expiryDate': {
      $lte: futureDate,
      $gte: new Date()
    },
    status: { $ne: 'archived' }
  }).populate('owner', 'firstName lastName email phone');
};

documentSchema.statics.getPendingVerifications = function() {
  return this.find({
    'verification.status': 'pending'
  }).populate('owner', 'firstName lastName email');
};

documentSchema.statics.getByOwnerAndType = function(ownerId, type) {
  return this.find({
    owner: ownerId,
    type: type,
    status: { $ne: 'archived' }
  }).sort({ createdAt: -1 });
};

documentSchema.statics.getVerificationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$verification.status',
        count: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('Document', documentSchema);