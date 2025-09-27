import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
  verifyPhone,
  sendPhoneOTP,
  socialLogin
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange
} from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - dateOfBirth
 *               - gender
 *               - address
 *               - occupation
 *               - annualIncome
 *               - category
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Rahul"
 *               lastName:
 *                 type: string
 *                 example: "Kumar"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "rahul.kumar@example.com"
 *               phone:
 *                 type: string
 *                 pattern: "^[6-9]\\d{9}$"
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "Password123"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1995-01-15"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other, prefer-not-to-say]
 *                 example: "male"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main Street"
 *                   city:
 *                     type: string
 *                     example: "Delhi"
 *                   state:
 *                     type: string
 *                     example: "Delhi"
 *                   pincode:
 *                     type: string
 *                     pattern: "^\\d{6}$"
 *                     example: "110001"
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *               annualIncome:
 *                 type: number
 *                 example: 800000
 *               category:
 *                 type: string
 *                 enum: [general, obc, sc, st, other]
 *                 example: "general"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validateUserRegistration, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *               - loginMethod
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email, phone, Aadhaar, or PAN
 *                 example: "rahul.kumar@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               loginMethod:
 *                 type: string
 *                 enum: [email, phone, aadhaar, pan]
 *                 example: "email"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validateUserLogin, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/forgotpassword:
 *   post:
 *     summary: Send password reset instructions
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - method
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email or phone number
 *                 example: "rahul.kumar@example.com"
 *               method:
 *                 type: string
 *                 enum: [email, phone]
 *                 example: "email"
 *     responses:
 *       200:
 *         description: Reset instructions sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /api/auth/resetpassword/{resettoken}:
 *   put:
 *     summary: Reset password using reset token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/resetpassword/:resettoken', resetPassword);

/**
 * @swagger
 * /api/auth/updatepassword:
 *   put:
 *     summary: Update password (authenticated user)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "OldPassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/updatepassword', protect, validatePasswordChange, updatePassword);

router.get('/verify-email/:token', verifyEmail);
router.post('/verify-phone', protect, verifyPhone);
router.post('/send-phone-otp', protect, sendPhoneOTP);
router.post('/social', socialLogin);

export default router;