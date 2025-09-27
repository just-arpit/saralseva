import express from 'express';
import {
  getProfile,
  updateProfile,
  getBookmarks,
  addBookmark,
  removeBookmark
} from '../controllers/user.js';
import { protect } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
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
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Rahul"
 *               lastName:
 *                 type: string
 *                 example: "Kumar"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *               annualIncome:
 *                 type: number
 *                 example: 900000
 *               education:
 *                 type: string
 *                 enum: [below-10th, 10th, 12th, graduate, post-graduate, doctorate, other]
 *               language:
 *                 type: string
 *                 enum: [english, hindi, bengali, telugu, marathi, tamil, gujarati, urdu, kannada, odia, malayalam, punjabi]
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 */
router.put('/profile', validateProfileUpdate, updateProfile);

/**
 * @swagger
 * /api/users/bookmarks:
 *   get:
 *     summary: Get user bookmarked schemes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Scheme'
 */
router.get('/bookmarks', getBookmarks);

/**
 * @swagger
 * /api/users/bookmarks/{schemeId}:
 *   post:
 *     summary: Add scheme to bookmarks
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ID to bookmark
 *     responses:
 *       200:
 *         description: Scheme bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.post('/bookmarks/:schemeId', addBookmark);

/**
 * @swagger
 * /api/users/bookmarks/{schemeId}:
 *   delete:
 *     summary: Remove scheme from bookmarks
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ID to remove from bookmarks
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.delete('/bookmarks/:schemeId', removeBookmark);

export default router;