import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Government IDs
  aadhaar: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{12}$/, 'Aadhaar must be 12 digits']
  },
  pan: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  
  // Personal Details
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    default: 'single'
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Eligibility Criteria Fields
  occupation: String,
  annualIncome: {
    type: Number,
    min: [0, 'Income cannot be negative']
  },
  education: {
    type: String,
    enum: ['below-10th', '10th', '12th', 'graduate', 'post-graduate', 'doctorate', 'other']
  },
  category: {
    type: String,
    enum: ['general', 'obc', 'sc', 'st', 'other'],
    default: 'general'
  },
  religion: {
    type: String,
    enum: ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'other']
  },
  isMinority: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  disabilityType: {
    type: String,
    enum: ['physical', 'visual', 'hearing', 'intellectual', 'multiple', 'other']
  },
  
  // Family Details
  familySize: {
    type: Number,
    min: 1,
    default: 1
  },
  dependents: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Preferences
  language: {
    type: String,
    enum: ['english', 'hindi', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada', 'odia', 'malayalam', 'punjabi'],
    default: 'english'
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'moderator', 'officer'],
    default: 'citizen'
  },
  
  // Bookmarks and Preferences
  bookmarkedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  
  // Verification Status
  verificationStatus: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    aadhaar: { type: Boolean, default: false },
    pan: { type: Boolean, default: false }
  },
  
  // Login Methods
  loginMethods: [{
    type: String,
    enum: ['email', 'phone', 'aadhaar', 'pan', 'google', 'digilocker']
  }],
  
  // Social Login IDs
  googleId: String,
  digiLockerId: String,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Email Verification
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Phone Verification
  phoneVerificationToken: String,
  phoneVerificationExpire: Date,
  
  // Last Login
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for search optimization
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ aadhaar: 1 });
userSchema.index({ pan: 1 });
userSchema.index({ 'address.state': 1 });
userSchema.index({ occupation: 1 });
userSchema.index({ category: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to check eligibility for schemes
userSchema.methods.checkEligibility = function(schemeEligibility) {
  const user = this;
  let score = 0;
  let totalCriteria = 0;
  
  // Age check
  if (schemeEligibility.ageRange) {
    totalCriteria++;
    const age = user.age;
    if (age >= schemeEligibility.ageRange.min && age <= schemeEligibility.ageRange.max) {
      score++;
    }
  }
  
  // Income check
  if (schemeEligibility.incomeRange) {
    totalCriteria++;
    if (user.annualIncome >= schemeEligibility.incomeRange.min && 
        user.annualIncome <= schemeEligibility.incomeRange.max) {
      score++;
    }
  }
  
  // Gender check
  if (schemeEligibility.gender && schemeEligibility.gender.length > 0) {
    totalCriteria++;
    if (schemeEligibility.gender.includes(user.gender)) {
      score++;
    }
  }
  
  // Category check
  if (schemeEligibility.category && schemeEligibility.category.length > 0) {
    totalCriteria++;
    if (schemeEligibility.category.includes(user.category)) {
      score++;
    }
  }
  
  // State check
  if (schemeEligibility.states && schemeEligibility.states.length > 0) {
    totalCriteria++;
    if (schemeEligibility.states.includes(user.address.state)) {
      score++;
    }
  }
  
  // Occupation check
  if (schemeEligibility.occupations && schemeEligibility.occupations.length > 0) {
    totalCriteria++;
    if (schemeEligibility.occupations.includes(user.occupation)) {
      score++;
    }
  }
  
  // Education check
  if (schemeEligibility.education && schemeEligibility.education.length > 0) {
    totalCriteria++;
    if (schemeEligibility.education.includes(user.education)) {
      score++;
    }
  }
  
  // Disability check
  if (schemeEligibility.isForDisabled !== undefined) {
    totalCriteria++;
    if (schemeEligibility.isForDisabled === user.isDisabled) {
      score++;
    }
  }
  
  // Minority check
  if (schemeEligibility.isForMinority !== undefined) {
    totalCriteria++;
    if (schemeEligibility.isForMinority === user.isMinority) {
      score++;
    }
  }
  
  return totalCriteria > 0 ? Math.round((score / totalCriteria) * 100) : 0;
};

// Get scheme recommendations for the user
userSchema.methods.getSchemeRecommendations = async function() {
  const Scheme = mongoose.model('Scheme');
  
  // Basic recommendation logic based on user profile
  const filter = {};
  
  // Filter by category if user belongs to specific category
  if (this.category && this.category !== 'general') {
    filter['eligibility.categories'] = this.category;
  }
  
  // Filter by income range
  if (this.annualIncome) {
    filter['eligibility.income.max'] = { $gte: this.annualIncome };
  }
  
  // Filter by age
  if (this.age) {
    filter['eligibility.age.min'] = { $lte: this.age };
    filter['eligibility.age.max'] = { $gte: this.age };
  }
  
  // Get recommended schemes
  const schemes = await Scheme.find(filter)
    .sort({ priority: -1, createdAt: -1 })
    .limit(5)
    .select('title description type benefits eligibility');
  
  return schemes;
};

export default mongoose.model('User', userSchema);