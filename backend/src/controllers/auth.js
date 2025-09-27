import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Update last login
  user.lastLogin = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  user.save({ validateBeforeSave: false });

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      }
    });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      occupation,
      annualIncome,
      category,
      education,
      maritalStatus,
      aadhaar,
      pan,
      language
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone },
        ...(aadhaar ? [{ aadhaar }] : []),
        ...(pan ? [{ pan }] : [])
      ]
    });

    if (existingUser) {
      let field = 'email';
      if (existingUser.phone === phone) field = 'phone';
      if (existingUser.aadhaar === aadhaar) field = 'aadhaar';
      if (existingUser.pan === pan) field = 'pan';
      
      return res.status(400).json({
        success: false,
        error: `User with this ${field} already exists`
      });
    }

    // Create user with only provided fields
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      loginMethods: ['email', 'phone']
    };

    // Only add optional fields if they are provided
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (gender) userData.gender = gender;
    if (address) userData.address = address;
    if (occupation) userData.occupation = occupation;
    if (annualIncome !== undefined) userData.annualIncome = annualIncome;
    if (category) userData.category = category;
    if (education) userData.education = education;
    if (maritalStatus) userData.maritalStatus = maritalStatus;
    if (aadhaar) userData.aadhaar = aadhaar;
    if (pan) userData.pan = pan;
    if (language) userData.language = language;

    const user = await User.create(userData);

    // TODO: Send verification email/SMS
    
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { identifier, password, loginMethod } = req.body;

    let query = {};
    
    switch (loginMethod) {
      case 'email':
        query = { email: identifier };
        break;
      case 'phone':
        query = { phone: identifier };
        break;
      case 'aadhaar':
        query = { aadhaar: identifier };
        break;
      case 'pan':
        query = { pan: identifier.toUpperCase() };
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid login method'
        });
    }

    // Find user and include password
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { identifier, method } = req.body; // email or phone

    let query = {};
    if (method === 'email') {
      query = { email: identifier };
    } else if (method === 'phone') {
      query = { phone: identifier };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid recovery method'
      });
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user found with that information'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send reset password email/SMS
    
    res.status(200).json({
      success: true,
      message: `Password reset instructions sent to your ${method}`,
      data: {
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // TODO: Implement email verification logic
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify phone
 * @route   POST /api/auth/verify-phone
 * @access  Private
 */
export const verifyPhone = async (req, res, next) => {
  try {
    const { otp } = req.body;

    // TODO: Implement phone OTP verification logic
    
    const user = await User.findById(req.user.id);
    user.verificationStatus.phone = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send phone OTP
 * @route   POST /api/auth/send-phone-otp
 * @access  Private
 */
export const sendPhoneOTP = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to user (in production, use Redis or similar)
    user.phoneVerificationToken = otp;
    user.phoneVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // TODO: Send OTP via SMS service
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
      data: {
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Social login (Google, DigiLocker)
 * @route   POST /api/auth/social
 * @access  Public
 */
export const socialLogin = async (req, res, next) => {
  try {
    const { provider, token, userData } = req.body;

    // TODO: Implement social login verification
    
    let user;
    
    if (provider === 'google') {
      // Verify Google token and get user data
      user = await User.findOne({ googleId: userData.id });
      
      if (!user) {
        // Create new user
        user = await User.create({
          firstName: userData.given_name,
          lastName: userData.family_name,
          email: userData.email,
          googleId: userData.id,
          isVerified: true,
          verificationStatus: {
            email: true
          },
          loginMethods: ['google']
        });
      }
    } else if (provider === 'digilocker') {
      // Verify DigiLocker token and get user data
      user = await User.findOne({ digiLockerId: userData.id });
      
      if (!user) {
        // Create new user with DigiLocker verified data
        user = await User.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          aadhaar: userData.aadhaar,
          digiLockerId: userData.id,
          isVerified: true,
          verificationStatus: {
            email: true,
            aadhaar: true
          },
          loginMethods: ['digilocker']
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported social login provider'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};