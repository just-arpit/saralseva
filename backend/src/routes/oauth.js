import express from 'express';
import passport from '../config/passport.js';
import User from '../models/User.js';
import axios from 'axios';

const router = express.Router();

// @desc    Google OAuth login
// @route   GET /auth/google
// @access  Public
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.CORS_ORIGIN}/login?error=oauth_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @desc    Google OAuth callback
// @route   GET /auth/google/callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = req.user.getSignedJwtToken();
      
      // Set cookie options
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };

      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }

      // Redirect to frontend with token
      res
        .cookie('token', token, options)
        .redirect(`${process.env.CORS_ORIGIN}/dashboard?auth=success`);
    } catch (error) {
      res.redirect(`${process.env.CORS_ORIGIN}/login?error=oauth_failed`);
    }
  }
);

// @desc    DigiLocker OAuth login
// @route   GET /auth/digilocker
// @access  Public
router.get('/digilocker', (req, res) => {
  const authURL = `https://api.digitallocker.gov.in/public/oauth2/1/authorize?` +
    `response_type=code` +
    `&client_id=${process.env.DIGILOCKER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.DIGILOCKER_REDIRECT_URI)}` +
    `&state=${req.sessionID}` +
    `&scope=BasicProfile`;
  
  res.redirect(authURL);
});

// @desc    DigiLocker OAuth callback
// @route   GET /auth/digilocker/callback
// @access  Public
router.get('/digilocker/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.digitallocker.gov.in/public/oauth2/1/token', {
      grant_type: 'authorization_code',
      client_id: process.env.DIGILOCKER_CLIENT_ID,
      client_secret: process.env.DIGILOCKER_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.DIGILOCKER_REDIRECT_URI
    });

    const { access_token } = tokenResponse.data;

    // Get user profile from DigiLocker
    const profileResponse = await axios.get('https://api.digitallocker.gov.in/public/oauth2/1/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const profile = profileResponse.data;

    // Check if user exists
    let user = await User.findOne({ digiLockerId: profile.id });

    if (!user) {
      // Check if user exists with same email/aadhaar
      user = await User.findOne({
        $or: [
          { email: profile.email },
          { aadhaar: profile.aadhaar }
        ]
      });

      if (user) {
        // Link DigiLocker to existing user
        user.digiLockerId = profile.id;
        if (!user.verificationStatus.aadhaar && profile.aadhaar) {
          user.verificationStatus.aadhaar = true;
        }
        await user.save();
      } else {
        // Create new user from DigiLocker data
        user = await User.create({
          digiLockerId: profile.id,
          firstName: profile.name.split(' ')[0],
          lastName: profile.name.split(' ').slice(1).join(' '),
          email: profile.email,
          phone: profile.mobile || '0000000000', // Placeholder
          aadhaar: profile.aadhaar,
          dateOfBirth: profile.dob,
          gender: profile.gender,
          verificationStatus: {
            email: true,
            aadhaar: true
          },
          role: 'citizen',
          // DigiLocker users don't need password
          password: Math.random().toString(36).slice(-8)
        });
      }
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();
    
    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    // Redirect to frontend with token
    res
      .cookie('token', token, options)
      .redirect(`${process.env.CORS_ORIGIN}/dashboard?auth=success&verified=true`);

  } catch (error) {
    console.error('DigiLocker OAuth Error:', error);
    res.redirect(`${process.env.CORS_ORIGIN}/login?error=digilocker_failed`);
  }
});

// @desc    Logout user
// @route   POST /auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

export default router;
