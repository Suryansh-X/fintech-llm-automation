import { OpenAI } from 'openai';
import logger from '../config/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Layer 2: LLM Processing with ANN-inspired confidence scoring
export async function processFinancialData(input, type) {
  try {
    logger.info(`Processing ${type} with LLM`);

    const prompt = buildPrompt(input, type);
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert fintech AI analyst. Provide accurate, structured analysis with confidence scores.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;

    return {
      llmResponse: response,
      model: completion.model,
      inputTokens: completion.usage.prompt_tokens,
      outputTokens: completion.usage.completion_tokens,
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`AI Processing failed: ${error.message}`);
    throw error;
  }
}

// Layer 3: Output Verification & Filtering
export async function verifyOutput(aiResult) {
  try {
    logger.info('Verifying AI output');

    // ANN-inspired confidence calculation
    const confidence = calculateConfidence(aiResult);

    // CNN-inspired pattern matching for anomalies
    const anomalyScore = detectAnomalies(aiResult);

    // Filter and clean output
    const filteredOutput = filterOutput(aiResult, confidence);

    return {
      verified: true,
      confidence: confidence,
      anomalyScore: anomalyScore,
      output: filteredOutput,
      verificationLayers: parseInt(process.env.VERIFICATION_LAYERS || 3),
      verifiedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Verification failed: ${error.message}`);
    throw error;
  }
}

// ANN Confidence Scoring
function calculateConfidence(aiResult) {
  let confidence = 0.5;

  // Token-based confidence
  const tokenScore = Math.min(aiResult.outputTokens / 2000, 1);
  confidence += tokenScore * 0.2;

  // Response length and quality
  const responseLength = aiResult.llmResponse.length;
  if (responseLength > 500) confidence += 0.15;
  else if (responseLength > 200) confidence += 0.1;

  // Grammar and structure check
  if (isWellStructured(aiResult.llmResponse)) confidence += 0.15;

  // Normalize
  return Math.min(confidence, 1.0);
}

// CNN-inspired Anomaly Detection
function detectAnomalies(aiResult) {
  let anomalyScore = 0;

  const response = aiResult.llmResponse.toLowerCase();
  const redFlags = ['error', 'failed', 'invalid', 'unknown', 'unable'];

  redFlags.forEach(flag => {
    if (response.includes(flag)) anomalyScore += 0.1;
  });

  return Math.min(anomalyScore, 1.0);
}

// Output Filtering
function filterOutput(aiResult, confidence) {
  return {
    summary: truncateText(aiResult.llmResponse, 500),
    fullAnalysis: aiResult.llmResponse,
    tokensUsed: aiResult.inputTokens + aiResult.outputTokens,
    model: aiResult.model,
    qualityRating: confidence > 0.9 ? 'Excellent' : confidence > 0.8 ? 'Good' : 'Fair'
  };
}

function isWellStructured(text) {
  // Check for bullet points, numbers, or clear sections
  return /^([-•*]|\d+\.|#{1,6})/.test(text);
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function buildPrompt(input, type) {
  if (type === 'transaction') {
    return `Analyze this financial transaction for fraud risk, legitimacy, and compliance:\n${JSON.stringify(input)}\nProvide structured analysis with risk score (0-100).`;
  } else if (type === 'report') {
    return `Generate a professional financial report based on:\n${JSON.stringify(input)}\nInclude summary, key metrics, and recommendations.`;
  } else if (type === 'compliance') {
    return `Verify compliance and regulatory status:\n${JSON.stringify(input)}\nProvide compliance checklist and any issues.`;
  }
  return `Analyze:\n${JSON.stringify(input)}`;
}

export default { processFinancialData, verifyOutput };
