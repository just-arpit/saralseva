import express from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateEventCreation } from '../middleware/validation.js';
import Event from '../models/Event.js';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events with optional filtering
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by event category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [workshop, seminar, camp, awareness, other]
 *         description: Filter by event type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *         description: Filter by event status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location/city
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
 *         description: Number of events per page
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, type, status, location, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (location) filter['location.city'] = new RegExp(location, 'i');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Default to upcoming and ongoing events if no status specified
    if (!status) {
      filter.status = { $in: ['upcoming', 'ongoing'] };
    }
    
    const events = await Event.find(filter)
      .populate('organizer', 'name email contact')
      .populate('department', 'name')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Event.countDocuments(filter);
    
    res.json({
      success: true,
      data: events,
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
 * /api/events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email contact')
      .populate('department', 'name contact')
      .populate('registrations.userId', 'name email phone');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Increment view count
    await Event.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               additionalInfo:
 *                 type: object
 *                 description: Additional registration information
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Registration failed (already registered, event full, etc.)
 */
router.post('/:id/register', protect, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if registration is open
    if (event.registrationStatus !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this event'
      });
    }
    
    // Check if event is full
    if (event.maxParticipants && event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Check if user already registered
    const existingRegistration = event.registrations.find(
      reg => reg.userId.toString() === req.user.id
    );
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }
    
    // Add registration
    event.registrations.push({
      userId: req.user.id,
      registeredAt: new Date(),
      status: 'confirmed',
      additionalInfo: req.body.additionalInfo || {}
    });
    
    await event.save();
    
    // Populate for response
    await event.populate('registrations.userId', 'name email');
    
    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        eventId: event._id,
        registrationId: event.registrations[event.registrations.length - 1]._id
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events/{id}/unregister:
 *   delete:
 *     summary: Unregister from an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Unregistration successful
 *       400:
 *         description: Not registered for this event
 */
router.delete('/:id/unregister', protect, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Find and remove registration
    const registrationIndex = event.registrations.findIndex(
      reg => reg.userId.toString() === req.user.id
    );
    
    if (registrationIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }
    
    event.registrations.splice(registrationIndex, 1);
    await event.save();
    
    res.json({
      success: true,
      message: 'Unregistration successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event (Admin/Department Head only)
 *     tags: [Events]
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
 *               - description
 *               - startDate
 *               - location
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: object
 *               type:
 *                 type: string
 *               maxParticipants:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', protect, authorize('admin', 'department_head'), validateEventCreation, async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id,
      createdBy: req.user.id
    };
    
    // Parse dates
    if (eventData.startDate) eventData.startDate = new Date(eventData.startDate);
    if (eventData.endDate) eventData.endDate = new Date(eventData.endDate);
    
    const event = await Event.create(eventData);
    
    // Populate for response
    await event.populate('organizer', 'name email');
    
    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event (Admin/Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/:id', protect, authorize('admin', 'department_head'), validateEventCreation, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user can edit this event
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Parse dates if provided
    const updateData = { ...req.body };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedBy: req.user.id },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');
    
    res.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Update status to cancelled instead of deleting
    event.status = 'cancelled';
    event.cancellationReason = 'Cancelled by administrator';
    event.cancelledBy = req.user.id;
    event.cancelledAt = new Date();
    
    await event.save();
    
    res.json({
      success: true,
      message: 'Event cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/events/my/registrations:
 *   get:
 *     summary: Get user's event registrations
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User registrations retrieved successfully
 */
router.get('/my/registrations', protect, async (req, res, next) => {
  try {
    const events = await Event.find({
      'registrations.userId': req.user.id
    })
    .populate('organizer', 'name email')
    .sort({ startDate: -1 });
    
    // Filter to show only user's registration details
    const userRegistrations = events.map(event => {
      const userReg = event.registrations.find(
        reg => reg.userId.toString() === req.user.id
      );
      
      return {
        ...event.toObject(),
        userRegistration: userReg
      };
    });
    
    res.json({
      success: true,
      data: userRegistrations
    });
  } catch (error) {
    next(error);
  }
});

export default router;