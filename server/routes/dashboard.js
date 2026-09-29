import express from 'express';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// User dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [processed, verified, pending, avgConfidence] = await Promise.all([
      query('SELECT COUNT(*) FROM ai_requests WHERE user_id = $1', [userId]),
      query('SELECT COUNT(*) FROM ai_requests WHERE user_id = $1 AND status = $2', [userId, 'verified']),
      query('SELECT COUNT(*) FROM ai_requests WHERE user_id = $1 AND status = $2', [userId, 'pending_verification']),
      query('SELECT AVG(confidence) FROM ai_requests WHERE user_id = $1', [userId])
    ]);

    res.json({
      success: true,
      data: {
        totalRequests: parseInt(processed.rows[0].count),
        verifiedRequests: parseInt(verified.rows[0].count),
        pendingRequests: parseInt(pending.rows[0].count),
        averageConfidence: parseFloat(avgConfidence.rows[0].avg) || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Recent activity
router.get('/activity', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, input_type, status, confidence, created_at FROM ai_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export default router;
