import { Router } from 'express';
import { askQuestion, generateQuizController } from '../controllers/askController.js';
import { createRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateAskRequest, validateQuizRequest } from '../middleware/validationMiddleware.js';

const router = Router();
const askLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: 30,
	message: 'Too many AI requests. Please wait a minute and try again.',
});

router.post('/', askLimiter, validateAskRequest, askQuestion);
router.post('/quiz', askLimiter, validateQuizRequest, generateQuizController);

export default router;
