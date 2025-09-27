import express from 'express';
import { body, validationResult } from 'express-validator';
import aiService from '../services/aiService.js';
import geminiService from '../services/geminiService.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * /api/qa/ask:
 *   post:
 *     summary: Ask a question about government schemes
 *     tags: [Q&A]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question to ask about government schemes
 *                 example: "Am I eligible for PM-KISAN scheme?"
 *               language:
 *                 type: string
 *                 enum: [en, hi, hinglish]
 *                 default: en
 *                 description: Preferred language for response
 *               includeUserProfile:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to use user profile for personalized eligibility check
 *     responses:
 *       200:
 *         description: AI response with scheme information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     answer:
 *                       type: string
 *                       description: AI-generated answer
 *                     relevantSchemes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           similarity:
 *                             type: number
 *                           eligibility:
 *                             type: object
 *                           benefits:
 *                             type: object
 *                           applicationProcess:
 *                             type: object
 *                     confidence:
 *                       type: number
 *                       description: Confidence score (0-100)
 *                     sources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           schemeName:
 *                             type: string
 *                           department:
 *                             type: string
 *                           similarity:
 *                             type: number
 *                     language:
 *                       type: string
 *                       description: Language of the response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/ask', [
  optionalAuth,
  body('question')
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Question must be between 3 and 500 characters'),
  body('language')
    .optional()
    .isIn(['en', 'hi', 'hinglish'])
    .withMessage('Language must be en, hi, or hinglish'),
  body('includeUserProfile')
    .optional()
    .isBoolean()
    .withMessage('includeUserProfile must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { question, language = 'en', includeUserProfile = true } = req.body;
    const userId = req.user?.id;

    // Get user profile if requested
    let userProfile = null;
    if (includeUserProfile && userId) {
      try {
        const user = await User.findById(userId).select(
          'age gender income category address education occupation maritalStatus isDisabled'
        );
        
        if (user) {
          userProfile = {
            age: user.age,
            gender: user.gender,
            income: user.income,
            category: user.category,
            state: user.address?.state,
            education: user.education,
            occupation: user.occupation,
            maritalStatus: user.maritalStatus,
            isDisabled: user.isDisabled
          };
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Continue without user profile
      }
    } else if (includeUserProfile && !userId) {
      // Mock user profile for demonstration purposes
      userProfile = {
        age: 35,
        gender: 'male',
        income: 150000,
        category: 'general',
        state: 'Delhi',
        education: 'graduate',
        occupation: 'farmer',
        maritalStatus: 'married',
        isDisabled: false
      };
    }

    // Process the question using Gemini AI service
    const result = await geminiService.processQuery(question, userProfile, language);

    // Translate response if Hindi is requested and not already in Hindi
    let finalAnswer = result.answer;
    if (language === 'hi' && !result.answer.includes('योजना') && !result.answer.includes('सरकार')) {
      try {
        finalAnswer = await geminiService.translateToHindi(result.answer);
      } catch (error) {
        console.error('Error translating response:', error);
        // Continue with original response
      }
    }

    res.json({
      success: true,
      data: {
        ...result,
        answer: finalAnswer,
        language: language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing Q&A request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/qa/suggestions:
 *   get:
 *     summary: Get suggested questions
 *     tags: [Q&A]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [employment, education, healthcare, housing, agriculture, business, social-security, tax-benefits, disability, women-empowerment, senior-citizen, skill-development, startup, rural-development, urban-development, environment, technology, financial-inclusion]
 *         description: Filter suggestions by scheme category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Number of suggestions to return
 *     responses:
 *       200:
 *         description: List of suggested questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                       category:
 *                         type: string
 *                       language:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const suggestions = [
      {
        question: "Am I eligible for PM-KISAN scheme?",
        category: "agriculture",
        language: "en"
      },
      {
        question: "What are the benefits of Ayushman Bharat?",
        category: "healthcare",
        language: "en"
      },
      {
        question: "How to apply for Pradhan Mantri Awas Yojana?",
        category: "housing",
        language: "en"
      },
      {
        question: "What education schemes are available for students?",
        category: "education",
        language: "en"
      },
      {
        question: "क्या मैं PM-KISAN योजना के लिए पात्र हूं?",
        category: "agriculture",
        language: "hi"
      },
      {
        question: "महिलाओं के लिए कौन सी योजनाएं हैं?",
        category: "women-empowerment",
        language: "hi"
      },
      {
        question: "Startup India scheme ke benefits kya hain?",
        category: "startup",
        language: "hinglish"
      },
      {
        question: "Senior citizens ke liye koi scheme hai?",
        category: "senior-citizen",
        language: "hinglish"
      },
      {
        question: "What financial assistance is available for disabled persons?",
        category: "disability",
        language: "en"
      },
      {
        question: "How to get skill development training?",
        category: "skill-development",
        language: "en"
      },
      {
        question: "Tax benefits for small businesses?",
        category: "tax-benefits",
        language: "en"
      },
      {
        question: "Rural development schemes kya hain?",
        category: "rural-development",
        language: "hinglish"
      }
    ];

    let filteredSuggestions = suggestions;
    
    if (category) {
      filteredSuggestions = suggestions.filter(s => s.category === category);
    }

    // Limit results
    filteredSuggestions = filteredSuggestions.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: filteredSuggestions
    });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/qa/feedback:
 *   post:
 *     summary: Submit feedback for Q&A response
 *     tags: [Q&A]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           type: object
 *           required:
 *             - questionId
 *             - rating
 *           properties:
 *             questionId:
 *               type: string
 *               description: ID of the question/response
 *             rating:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: Rating from 1 to 5
 *             feedback:
 *               type: string
 *               description: Optional feedback text
 *             helpful:
 *               type: boolean
 *               description: Whether the response was helpful
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/feedback', [
  optionalAuth,
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Feedback must not exceed 500 characters'),
  body('helpful')
    .optional()
    .isBoolean()
    .withMessage('Helpful must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { questionId, rating, feedback, helpful } = req.body;
    const userId = req.user?.id;

    // Store feedback in database (you can create a Feedback model for this)
    // For now, we'll just log it
    console.log('Q&A Feedback:', {
      userId,
      questionId,
      rating,
      feedback,
      helpful,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/qa/health:
 *   get:
 *     summary: Check AI service health
 *     tags: [Q&A]
 *     responses:
 *       200:
 *         description: AI service health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     initialized:
 *                       type: boolean
 *                     schemesLoaded:
 *                       type: number
 *                     uptime:
 *                       type: number
 *       500:
 *         description: AI service not available
 */
router.get('/health', async (req, res) => {
  try {
    const geminiHealth = await geminiService.getHealthStatus();
    const aiInitialized = aiService.initialized;
    
    res.json({
      success: true,
      data: {
        status: geminiHealth.status === 'healthy' ? 'healthy' : 'degraded',
        gemini: geminiHealth,
        aiService: {
          initialized: aiInitialized,
          schemesLoaded: aiService.schemes?.length || 0
        },
        uptime: process.uptime()
      }
    });

  } catch (error) {
    console.error('Error checking AI service health:', error);
    res.status(500).json({
      success: false,
      message: 'AI service not available',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
