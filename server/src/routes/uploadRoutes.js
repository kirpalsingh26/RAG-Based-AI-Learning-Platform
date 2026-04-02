import { Router } from 'express';
import { uploadStudyMaterial } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateUploadRequest } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/', validateUploadRequest, upload.single('file'), uploadStudyMaterial);

export default router;
