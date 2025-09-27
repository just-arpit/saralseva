import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validateDocumentUpload } from '../middleware/validation.js';
import Document from '../models/Document.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const router = express.Router();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX files are allowed.'));
    }
  }
});

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get user's documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by document type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected, expired]
 *         description: Filter by verification status
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
 *         description: Number of documents per page
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { owner: req.user.id };
    if (type) filter.type = type;
    if (status) filter.verificationStatus = status;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const documents = await Document.find(filter)
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-filePath'); // Don't expose file paths
    
    const total = await Document.countDocuments(filter);
    
    res.json({
      success: true,
      data: documents,
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
 * /api/documents/{id}:
 *   get:
 *     summary: Get document details by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document details retrieved successfully
 *       404:
 *         description: Document not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'firstName lastName email')
      .populate('verifiedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check if user can access this document
    if (req.user.role !== 'admin' && 
        req.user.role !== 'verifier' && 
        document.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a new document for verification
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - file
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [aadhaar, pan, voter_id, passport, driving_license, income_certificate, caste_certificate, domicile_certificate, birth_certificate, other]
 *               documentNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               file:
 *                 type: string
 *                 format: binary
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post('/upload', protect, upload.single('file'), validateDocumentUpload, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Generate document hash for duplicate detection
    const fileHash = crypto.createHash('md5').update(req.file.buffer || req.file.filename).digest('hex');
    
    const documentData = {
      owner: req.user.id,
      title: req.body.title,
      type: req.body.type,
      category: req.body.category,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hash: fileHash
      },
      documentNumber: req.body.documentNumber,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
    };
    
    // Check for duplicate documents
    const existingDoc = await Document.findOne({
      owner: req.user.id,
      type: req.body.type,
      documentNumber: req.body.documentNumber
    });
    
    if (existingDoc && existingDoc.verificationStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'A verified document of this type with the same number already exists'
      });
    }
    
    const document = await Document.create(documentData);
    
    // Populate user info for response
    await document.populate('owner', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully. It will be verified within 24-48 hours.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/documents/{id}/verify:
 *   put:
 *     summary: Verify a document (Verifier/Admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationStatus
 *             properties:
 *               verificationStatus:
 *                 type: string
 *                 enum: [verified, rejected]
 *               verificationNotes:
 *                 type: string
 *               extractedData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Document verification updated successfully
 */
router.put('/:id/verify', protect, authorize('admin', 'verifier'), async (req, res, next) => {
  try {
    const { verificationStatus, verificationNotes, extractedData } = req.body;
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Update verification fields
    document.verificationStatus = verificationStatus;
    document.verificationNotes = verificationNotes;
    document.verifiedBy = req.user.id;
    document.verifiedAt = new Date();
    
    if (extractedData) {
      document.extractedData = extractedData;
    }
    
    // Add to verification history
    document.verificationHistory.push({
      status: verificationStatus,
      verifiedBy: req.user.id,
      timestamp: new Date(),
      notes: verificationNotes
    });
    
    await document.save();
    
    // Populate for response
    await document.populate('owner', 'firstName lastName email phone');
    await document.populate('verifiedBy', 'name email');
    
    res.json({
      success: true,
      data: document,
      message: `Document ${verificationStatus} successfully`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/documents/pending:
 *   get:
 *     summary: Get pending documents for verification (Verifier/Admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by document type
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
 *         description: Number of documents per page
 *     responses:
 *       200:
 *         description: Pending documents retrieved successfully
 */
router.get('/pending', protect, authorize('admin', 'verifier'), async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { verificationStatus: 'pending' };
    if (type) filter.type = type;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const documents = await Document.find(filter)
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: 1 }) // Oldest first
      .skip(skip)
      .limit(parseInt(limit))
      .select('-filePath -fileHash'); // Don't expose sensitive paths
    
    const total = await Document.countDocuments(filter);
    
    res.json({
      success: true,
      data: documents,
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
 * /api/documents/stats:
 *   get:
 *     summary: Get document verification statistics (Admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Document statistics retrieved successfully
 */
router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const stats = await Document.aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const typeStats = await Document.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Documents uploaded in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUploads = await Document.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      success: true,
      data: {
        statusStats: stats,
        typeStats,
        totalDocuments: await Document.countDocuments(),
        recentUploads,
        pendingVerifications: await Document.countDocuments({ verificationStatus: 'pending' })
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check if user can delete this document
    if (req.user.role !== 'admin' && document.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Don't allow deletion of verified documents
    if (document.verificationStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete verified documents'
      });
    }
    
    await Document.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;