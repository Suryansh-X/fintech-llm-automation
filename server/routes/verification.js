import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';
import { query } from '../config/database.js';

const router = express.Router();

// Get verification queue
router.get('/queue', authenticateToken, authorizeRole(['admin', 'verifier']), async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM ai_requests WHERE status = $1 ORDER BY created_at ASC LIMIT 50',
      ['pending_verification']
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// Verify and approve request
router.post('/:id/verify', authenticateToken, authorizeRole(['admin', 'verifier']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved, notes } = req.body;

    if (typeof approved !== 'boolean') {
      throw new AppError('Approved status is required', 400);
    }

    const status = approved ? 'verified' : 'rejected';

    const result = await query(
      'UPDATE ai_requests SET status = $1, verified_by = $2, verified_at = NOW(), verification_notes = $3 WHERE id = $4 RETURNING *',
      [status, req.user.id, notes || '', id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Request not found', 404);
    }

    logger.info(`Request ${id} ${status} by verifier ${req.user.id}`);

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Bulk verification
router.post('/bulk-verify', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  try {
    const { ids, approved } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('IDs array is required', 400);
    }

    const status = approved ? 'verified' : 'rejected';
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');

    const result = await query(
      `UPDATE ai_requests SET status = $${ids.length + 1}, verified_by = $${ids.length + 2}, verified_at = NOW() WHERE id IN (${placeholders}) RETURNING id`,
      [...ids, status, req.user.id]
    );

    logger.info(`Bulk verification: ${result.rows.length} requests ${status}`);

    res.json({
      success: true,
      message: `${result.rows.length} requests ${status}`,
      verified: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
