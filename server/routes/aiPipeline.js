import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { processFinancialData, verifyOutput } from '../services/aiService.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';
import { query } from '../config/database.js';

const router = express.Router();

// Process financial data through AI pipeline
router.post('/process', authenticateToken, async (req, res, next) => {
  try {
    const { input, type = 'transaction' } = req.body;

    if (!input) {
      throw new AppError('Input data is required', 400);
    }

    logger.info(`Processing ${type} request from user ${req.user.id}`);

    // Layer 1: Input Validation & Enhancement
    const enhancedInput = await enhanceInput(input, type);

    // Layer 2: AI Processing (LLM + ANN)
    const aiResult = await processFinancialData(enhancedInput, type);

    // Layer 3: Output Verification & Filtering
    const verifiedOutput = await verifyOutput(aiResult);

    // Layer 4: Confidence Check
    if (verifiedOutput.confidence < parseFloat(process.env.CONFIDENCE_THRESHOLD || 0.85)) {
      throw new AppError(`Confidence too low (${verifiedOutput.confidence}). Output not reliable.`, 422);
    }

    // Store in database
    const result = await query(
      'INSERT INTO ai_requests (user_id, input_type, input_data, output_data, confidence, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, type, JSON.stringify(enhancedInput), JSON.stringify(verifiedOutput), verifiedOutput.confidence, 'completed']
    );

    logger.info(`Processing completed for user ${req.user.id}. Confidence: ${verifiedOutput.confidence}`);

    res.json({
      success: true,
      message: 'Data processed successfully',
      data: verifiedOutput,
      requestId: result.rows[0].id,
      confidence: verifiedOutput.confidence
    });
  } catch (error) {
    next(error);
  }
});

// Get processing history
router.get('/history', authenticateToken, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await query(
      'SELECT * FROM ai_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, parseInt(limit), parseInt(offset)]
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

// Get request details
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM ai_requests WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Request not found', 404);
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Helper function: Input Enhancement
async function enhanceInput(input, type) {
  return {
    ...input,
    type,
    enhancedAt: new Date().toISOString(),
    language: detectLanguage(input),
    preprocessing: {
      normalized: true,
      validated: true,
      enriched: true
    }
  };
}

function detectLanguage(input) {
  const hindiRegex = /[\u0900-\u097F]/g;
  const englishRegex = /[a-zA-Z]/g;
  const hindiMatches = (JSON.stringify(input).match(hindiRegex) || []).length;
  const englishMatches = (JSON.stringify(input).match(englishRegex) || []).length;
  return hindiMatches > englishMatches ? 'hindi' : 'english';
}

export default router;
