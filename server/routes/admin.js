import express from 'express';
import { authorizeRole } from '../middleware/auth.js';
import { query } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// Admin-only: System stats
router.get('/stats', authorizeRole(['admin']), async (req, res, next) => {
  try {
    const [totalUsers, totalRequests, verificationRate] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM ai_requests'),
      query('SELECT COUNT(*) FROM ai_requests WHERE status = $1', ['verified'])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalRequests: parseInt(totalRequests.rows[0].count),
        verifiedRequests: parseInt(verificationRate.rows[0].count),
        verificationRate: `${((parseInt(verificationRate.rows[0].count) / parseInt(totalRequests.rows[0].count)) * 100).toFixed(2)}%`
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin-only: Get all users
router.get('/users', authorizeRole(['admin']), async (req, res, next) => {
  try {
    const result = await query('SELECT id, email, name, role, created_at FROM users LIMIT 100');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
