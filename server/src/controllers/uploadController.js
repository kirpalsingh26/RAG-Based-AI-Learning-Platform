import { extractTextFromFile } from '../utils/extractText.js';
import { indexStudyMaterial } from '../services/ragService.js';

export const uploadStudyMaterial = async (req, res, next) => {
  try {
    const { subject = 'general', topic = 'general' } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error('File is required.');
    }

    const text = await extractTextFromFile(req.file);

    const indexingResult = await indexStudyMaterial({
      fileName: req.file.originalname,
      text,
      subject,
      topic,
    });

    res.status(201).json({
      message: 'File indexed successfully',
      fileName: req.file.originalname,
      ...indexingResult,
    });
  } catch (error) {
    next(error);
  }
};
