import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const getLocations = async (req, res) => {
  res.status(200).json({ success: true, data: [], message: 'Locations endpoint - coming soon' });
};

const searchNearby = async (req, res) => {
  res.status(200).json({ success: true, data: [], message: 'Nearby search endpoint - coming soon' });
};

router.get('/', optionalAuth, getLocations);
router.get('/nearby', optionalAuth, searchNearby);

export default router;