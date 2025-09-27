import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by read status
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
 *           default: 20
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { type, read, page = 1, limit = 20 } = req.query;
    
    // Build filter object
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read === 'true';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification details by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification details retrieved successfully
 *       404:
 *         description: Notification not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user can access this notification
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user can access this notification
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/mark-all-read', protect, async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { 
        read: true, 
        readAt: new Date() 
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error, scheme_update, document_status, complaint_update, event_reminder]
 *               userId:
 *                 type: string
 *                 description: Target user ID (or 'all' for broadcast)
 *               data:
 *                 type: object
 *               actionUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router.post('/', protect, authorize('admin', 'department_head'), async (req, res, next) => {
  try {
    const { title, message, type, userId, data, actionUrl } = req.body;
    
    // Handle broadcast notifications
    if (userId === 'all') {
      // Create notification for all users (implement with caution for large user bases)
      const users = await User.find({}, '_id');
      const notifications = users.map(user => ({
        userId: user._id,
        title,
        message,
        type,
        data,
        actionUrl,
        createdBy: req.user.id
      }));
      
      const result = await Notification.insertMany(notifications);
      
      return res.status(201).json({
        success: true,
        message: `Broadcast notification sent to ${result.length} users`,
        data: { count: result.length }
      });
    }
    
    // Create single notification
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      data,
      actionUrl,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user can delete this notification
    if (req.user.role !== 'admin' && notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notifications/stats:
 *   get:
 *     summary: Get notification statistics (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics retrieved successfully
 */
router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const typeStats = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const readStats = await Notification.aggregate([
      {
        $group: {
          _id: '$read',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Notifications sent in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentNotifications = await Notification.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      success: true,
      data: {
        typeStats,
        readStats,
        totalNotifications: await Notification.countDocuments(),
        recentNotifications,
        unreadCount: await Notification.countDocuments({ read: false })
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;