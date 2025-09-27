import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  // Make these fields optional for basic registration
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      if (value) {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 13 || age > 120) {
          throw new Error('Age must be between 13 and 120 years');
        }
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Please select a valid gender'),
  
  body('address.city')
    .optional()
    .trim(),
  
  body('address.state')
    .optional()
    .trim(),
  
  body('address.pincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  
  body('occupation')
    .optional()
    .trim(),
  
  body('annualIncome')
    .optional()
    .isNumeric()
    .withMessage('Annual income must be a number')
    .isFloat({ min: 0 })
    .withMessage('Annual income cannot be negative'),
  
  body('category')
    .optional()
    .isIn(['general', 'obc', 'sc', 'st', 'other'])
    .withMessage('Please select a valid category'),
  
  handleValidationErrors
];

// Complete user registration validation (for profile completion)
export const validateCompleteUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 13 || age > 120) {
        throw new Error('Age must be between 13 and 120 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Please select a valid gender'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  
  body('occupation')
    .trim()
    .notEmpty()
    .withMessage('Occupation is required'),
  
  body('annualIncome')
    .isNumeric()
    .withMessage('Annual income must be a number')
    .isFloat({ min: 0 })
    .withMessage('Annual income cannot be negative'),
  
  body('category')
    .isIn(['general', 'obc', 'sc', 'st', 'other'])
    .withMessage('Please select a valid category'),
  
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email, phone, Aadhaar, or PAN is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('loginMethod')
    .isIn(['email', 'phone', 'aadhaar', 'pan'])
    .withMessage('Invalid login method'),
  
  handleValidationErrors
];

// Scheme creation validation
export const validateSchemeCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Scheme name is required')
    .isLength({ max: 200 })
    .withMessage('Scheme name cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Scheme description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 500 })
    .withMessage('Short description cannot exceed 500 characters'),
  
  body('category')
    .isIn([
      'employment', 'education', 'healthcare', 'housing', 'agriculture',
      'business', 'social-security', 'tax-benefits', 'disability',
      'women-empowerment', 'senior-citizen', 'skill-development',
      'startup', 'rural-development', 'urban-development', 'environment',
      'technology', 'financial-inclusion', 'other'
    ])
    .withMessage('Please select a valid category'),
  
  body('level')
    .isIn(['central', 'state', 'district', 'local'])
    .withMessage('Please select a valid level'),
  
  body('department.name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required'),
  
  body('benefits.type')
    .isIn(['financial', 'subsidy', 'loan', 'insurance', 'training', 'certificate', 'service', 'other'])
    .withMessage('Please select a valid benefit type'),
  
  body('benefits.description')
    .trim()
    .notEmpty()
    .withMessage('Benefit description is required'),
  
  handleValidationErrors
];

// Event creation validation
export const validateEventCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('type')
    .isIn([
      'workshop', 'seminar', 'training', 'webinar', 'conference',
      'awareness-camp', 'health-camp', 'skill-development', 'job-fair',
      'exhibition', 'consultation', 'registration-drive',
      'document-verification', 'other'
    ])
    .withMessage('Please select a valid event type'),
  
  body('category')
    .isIn([
      'education', 'healthcare', 'employment', 'skill-development',
      'awareness', 'government-schemes', 'digital-literacy',
      'financial-literacy', 'agriculture', 'business',
      'women-empowerment', 'youth-development', 'senior-citizen',
      'disability', 'other'
    ])
    .withMessage('Please select a valid category'),
  
  body('dateTime.start')
    .isISO8601()
    .withMessage('Please provide a valid start date and time'),
  
  body('dateTime.end')
    .isISO8601()
    .withMessage('Please provide a valid end date and time')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dateTime.start)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  body('location.type')
    .isIn(['online', 'offline', 'hybrid'])
    .withMessage('Please select a valid location type'),
  
  body('organizer.name')
    .trim()
    .notEmpty()
    .withMessage('Organizer name is required'),
  
  handleValidationErrors
];

// Complaint creation validation
export const validateComplaintCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Complaint title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Complaint description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .isIn([
      'scheme-related', 'service-delivery', 'corruption', 'document-issues',
      'website-technical', 'offline-service', 'staff-behavior',
      'delay-in-processing', 'wrong-information', 'accessibility',
      'payment-issues', 'other'
    ])
    .withMessage('Please select a valid category'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('incidentDate')
    .isISO8601()
    .withMessage('Please provide a valid incident date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Incident date cannot be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Document upload validation
export const validateDocumentUpload = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Document title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('type')
    .isIn([
      'aadhaar', 'pan', 'passport', 'driving-license', 'voter-id',
      'ration-card', 'income-certificate', 'caste-certificate',
      'birth-certificate', 'death-certificate', 'marriage-certificate',
      'educational-certificate', 'bank-statement', 'salary-slip',
      'property-document', 'medical-certificate', 'disability-certificate',
      'business-registration', 'other'
    ])
    .withMessage('Please select a valid document type'),
  
  body('category')
    .isIn(['identity', 'address', 'income', 'educational', 'medical', 'legal', 'financial', 'other'])
    .withMessage('Please select a valid category'),
  
  handleValidationErrors
];

// Location creation validation
export const validateLocationCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required')
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  
  body('type')
    .isIn([
      'government-office', 'service-center', 'bank', 'post-office',
      'court', 'police-station', 'hospital', 'school', 'college',
      'training-center', 'csc', 'jan-aushadhi', 'ration-shop', 'atm', 'other'
    ])
    .withMessage('Please select a valid location type'),
  
  body('category')
    .isIn(['central', 'state', 'district', 'local', 'private', 'ngo'])
    .withMessage('Please select a valid category'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Please provide a valid latitude'),
  
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Please provide a valid longitude'),
  
  handleValidationErrors
];

// Password change validation
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  
  body('address.pincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  
  body('annualIncome')
    .optional()
    .isNumeric()
    .withMessage('Annual income must be a number')
    .isFloat({ min: 0 })
    .withMessage('Annual income cannot be negative'),
  
  handleValidationErrors
];