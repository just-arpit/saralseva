import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validateComplaintCreation } from '../middleware/validation.js';
import Complaint from '../models/Complaint.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/complaints/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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
 * /api/complaints:
 *   get:
 *     summary: Get user's complaints or all complaints (admin)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, resolved, closed]
 *         description: Filter by complaint status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by complaint category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filter by priority
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
 *         description: Number of complaints per page
 *     responses:
 *       200:
 *         description: Complaints retrieved successfully
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Non-admin users can only see their own complaints
    if (req.user.role !== 'admin' && req.user.role !== 'department_head') {
      filter.complainant = req.user.id;
    }
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const complaints = await Complaint.find(filter)
      .populate('complainant', 'firstName lastName email phone')
      .populate('assignedTo', 'name email')
      .populate('relatedDepartment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Complaint.countDocuments(filter);
    
    res.json({
      success: true,
      data: complaints,
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
 * /api/complaints/{id}:
 *   get:
 *     summary: Get complaint details by ID
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint details retrieved successfully
 *       404:
 *         description: Complaint not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('complainant', 'firstName lastName email phone')
      .populate('assignedTo', 'name email')
      .populate('relatedDepartment');
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Check if user can access this complaint
    if (req.user.role !== 'admin' && 
        req.user.role !== 'department_head' && 
        complaint.complainant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               location:
 *                 type: object
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Complaint created successfully
 */
router.post('/', protect, upload.array('attachments', 5), validateComplaintCreation, async (req, res, next) => {
  try {
    const complaintData = {
      ...req.body,
      complainant: req.user.id,
      attachments: req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })) : []
    };
    
    // Parse location if provided as string
    if (typeof complaintData.location === 'string') {
      try {
        complaintData.location = JSON.parse(complaintData.location);
      } catch (e) {
        // If parsing fails, remove location
        delete complaintData.location;
      }
    }
    
    const complaint = await Complaint.create(complaintData);
    
    // Populate user info for response
    await complaint.populate('complainant', 'firstName lastName email phone');
    
    res.status(201).json({
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully. You will receive updates via email and SMS.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/complaints/{id}/status:
 *   put:
 *     summary: Update complaint status (Admin/Department Head only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, resolved, closed]
 *               resolution:
 *                 type: string
 *               internalNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 */
router.put('/:id/status', protect, authorize('admin', 'department_head'), async (req, res, next) => {
  try {
    const { status, resolution, internalNotes } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Add status update to history
    complaint.statusHistory.push({
      status: status,
      updatedBy: req.user.id,
      timestamp: new Date(),
      notes: internalNotes
    });
    
    // Update complaint fields
    complaint.status = status;
    if (resolution) complaint.resolution = resolution;
    if (internalNotes) complaint.internalNotes = internalNotes;
    
    // Set resolved/closed dates
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user.id;
    } else if (status === 'closed') {
      complaint.closedAt = new Date();
      complaint.closedBy = req.user.id;
    }
    
    await complaint.save();
    
    // Populate for response
    await complaint.populate('complainant', 'firstName lastName email phone');
    
    res.json({
      success: true,
      data: complaint,
      message: 'Complaint status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/complaints/{id}/assign:
 *   put:
 *     summary: Assign complaint to user (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedTo
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 description: User ID to assign complaint to
 *     responses:
 *       200:
 *         description: Complaint assigned successfully
 */
router.put('/:id/assign', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        $push: {
          statusHistory: {
            status: complaint.status,
            updatedBy: req.user.id,
            timestamp: new Date(),
            notes: `Assigned to user: ${assignedTo}`
          }
        }
      },
      { new: true }
    ).populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    res.json({
      success: true,
      data: complaint,
      message: 'Complaint assigned successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/complaints/stats:
 *   get:
 *     summary: Get complaint statistics (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complaint statistics retrieved successfully
 */
router.get('/stats', protect, authorize('admin', 'department_head'), async (req, res, next) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        statusStats: stats,
        categoryStats,
        priorityStats,
        totalComplaints: await Complaint.countDocuments()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;