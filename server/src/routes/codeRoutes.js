import { Router } from 'express';

import { runCode } from '../controllers/codeController.js';
import { createRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateCodeRunRequest } from '../middleware/validationMiddleware.js';

const router = Router();

const codeLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many code runs. Please wait and try again.',
});

router.post('/run', codeLimiter, validateCodeRunRequest, runCode);

export default router;
