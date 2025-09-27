import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Scheme from '../models/Scheme.js';
import Event from '../models/Event.js';
import Complaint from '../models/Complaint.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';

const router = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user's recent notifications (last 5)
    const recentNotifications = await Notification.find({ 
      userId, 
      read: false 
    })
    .sort({ createdAt: -1 })
    .limit(5);
    
    // Get recommended schemes
    const user = await User.findById(userId);
    const recommendedSchemes = await user.getSchemeRecommendations();
    
    // Get user's recent complaints
    const recentComplaints = await Complaint.find({ complainant: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title status priority createdAt');
    
    // Get user's upcoming events
    const upcomingEvents = await Event.find({
      'registrations.userId': userId,
      startDate: { $gte: new Date() }
    })
    .sort({ startDate: 1 })
    .limit(3)
    .select('title startDate location type');
    
    // Get document verification status
    const documentStats = await Document.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Quick stats
    const quickStats = {
      totalComplaints: await Complaint.countDocuments({ complainant: userId }),
      pendingComplaints: await Complaint.countDocuments({ complainant: userId, status: 'pending' }),
      verifiedDocuments: await Document.countDocuments({ owner: userId, verificationStatus: 'verified' }),
      upcomingEvents: upcomingEvents.length,
      unreadNotifications: recentNotifications.length
    };
    
    res.json({
      success: true,
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          memberSince: req.user.createdAt
        },
        notifications: recentNotifications,
        recommendedSchemes: recommendedSchemes.slice(0, 3),
        recentComplaints,
        upcomingEvents,
        documentStats,
        quickStats
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved successfully
 */
router.get('/admin', protect, authorize('admin', 'department_head'), async (req, res, next) => {
  try {
    // Overall system statistics
    const totalUsers = await User.countDocuments();
    const totalSchemes = await Scheme.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalDocuments = await Document.countDocuments();
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentComplaints = await Complaint.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentDocuments = await Document.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Pending items requiring attention
    const pendingComplaints = await Complaint.countDocuments({ 
      status: 'pending' 
    });
    
    const pendingDocuments = await Document.countDocuments({ 
      verificationStatus: 'pending' 
    });
    
    // Complaint status distribution
    const complaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Document verification stats
    const documentVerificationStats = await Document.aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top complaint categories
    const topComplaintCategories = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Recent high-priority complaints
    const urgentComplaints = await Complaint.find({ 
      priority: 'urgent',
      status: { $in: ['pending', 'in_progress'] }
    })
    .populate('complainant', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(5);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSchemes,
          totalComplaints,
          totalEvents,
          totalDocuments
        },
        recentActivity: {
          newUsers: recentUsers,
          newComplaints: recentComplaints,
          newDocuments: recentDocuments
        },
        pendingItems: {
          pendingComplaints,
          pendingDocuments
        },
        analytics: {
          complaintStats,
          documentVerificationStats,
          topComplaintCategories
        },
        urgentComplaints
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get detailed analytics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 90days, 1year]
 *           default: 30days
 *         description: Analytics period
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { period = '30days' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // Complaint resolution trends
    const complaintTrends = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // Scheme popularity
    const schemePopularity = await Scheme.aggregate([
      {
        $project: {
          name: 1,
          category: 1,
          viewCount: 1,
          applicationCount: { $size: '$applications' }
        }
      },
      { $sort: { viewCount: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate: now },
        userTrends,
        complaintTrends,
        schemePopularity
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;