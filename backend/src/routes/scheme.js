import express from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateSchemeCreation } from '../middleware/validation.js';
import Scheme from '../models/Scheme.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * /api/schemes:
 *   get:
 *     summary: Get all schemes with optional filtering
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by scheme category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Filter by scheme status
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in scheme name and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of schemes per page
 *     responses:
 *       200:
 *         description: Schemes retrieved successfully
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, status, state, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { status: 'active' }; // Only show active schemes by default
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (state) filter.applicableStates = { $in: [state, 'all'] };
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const schemes = await Scheme.find(filter)
      .populate('department', 'name contact')
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-eligibilityCriteria.detailed -internalNotes');
    
    const total = await Scheme.countDocuments(filter);
    
    res.json({
      success: true,
      data: schemes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/recommend:
 *   get:
 *     summary: Get personalized scheme recommendations
 *     tags: [Schemes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized recommendations retrieved successfully
 */
router.get('/recommend', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const recommendations = await user.getSchemeRecommendations();
    
    res.json({
      success: true,
      data: recommendations,
      message: 'Personalized recommendations based on your profile'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/categories:
 *   get:
 *     summary: Get all scheme categories
 *     tags: [Schemes]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Scheme.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/search:
 *   get:
 *     summary: Search schemes by keyword
 *     tags: [Schemes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const schemes = await Scheme.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { beneficiaryType: { $regex: q, $options: 'i' } }
      ],
      status: 'active'
    }).limit(20);

    res.json({
      success: true,
      data: schemes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/{id}:
 *   get:
 *     summary: Get scheme details by ID
 *     tags: [Schemes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ID
 *     responses:
 *       200:
 *         description: Scheme details retrieved successfully
 *       404:
 *         description: Scheme not found
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate('department', 'name contact address website');
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    // Increment view count
    await Scheme.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    
    res.json({
      success: true,
      data: scheme
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/{id}/eligibility:
 *   post:
 *     summary: Check eligibility for a specific scheme
 *     tags: [Schemes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ID
 *     responses:
 *       200:
 *         description: Eligibility check completed
 */
router.post('/:id/eligibility', protect, async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const eligibilityResult = await scheme.checkEligibility(user);
    
    res.json({
      success: true,
      data: {
        eligible: eligibilityResult.eligible,
        reasons: eligibilityResult.reasons,
        score: eligibilityResult.score,
        missingDocuments: eligibilityResult.missingDocuments,
        nextSteps: eligibilityResult.eligible ? scheme.applicationProcess : null
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes:
 *   post:
 *     summary: Create a new scheme (Admin only)
 *     tags: [Schemes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - eligibilityCriteria
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               eligibilityCriteria:
 *                 type: object
 *     responses:
 *       201:
 *         description: Scheme created successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', protect, authorize('admin', 'department_head'), validateSchemeCreation, async (req, res, next) => {
  try {
    const schemeData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const scheme = await Scheme.create(schemeData);
    
    res.status(201).json({
      success: true,
      data: scheme,
      message: 'Scheme created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/{id}:
 *   put:
 *     summary: Update scheme (Admin only)
 *     tags: [Schemes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheme updated successfully
 *       404:
 *         description: Scheme not found
 */
router.put('/:id', protect, authorize('admin', 'department_head'), validateSchemeCreation, async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    res.json({
      success: true,
      data: scheme,
      message: 'Scheme updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/schemes/{id}:
 *   delete:
 *     summary: Delete scheme (Admin only)
 *     tags: [Schemes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheme deleted successfully
 *       404:
 *         description: Scheme not found
 */
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    // Soft delete by updating status
    scheme.status = 'inactive';
    scheme.deletedAt = new Date();
    scheme.deletedBy = req.user.id;
    await scheme.save();
    
    res.json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;