import { Router } from 'express';

import uploadRouter from './uploadRoutes.js';
import askRouter from './askRoutes.js';
import codeRouter from './codeRoutes.js';

const router = Router();

router.use('/upload', uploadRouter);
router.use('/ask', askRouter);
router.use('/code', codeRouter);

export default router;
