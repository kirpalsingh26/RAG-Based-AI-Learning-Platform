import { askWithRag, generateQuizFromSubject } from '../services/ragService.js';

export const askQuestion = async (req, res, next) => {
  try {
    const { question, subject = 'general' } = req.body;

    if (!question) {
      res.status(400);
      throw new Error('Question is required.');
    }

    const result = await askWithRag({ question, subject });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const generateQuizController = async (req, res, next) => {
  try {
    const { subject = 'general', count = 5 } = req.body;

    const quiz = await generateQuizFromSubject({
      subject,
      count: Number(count),
    });

    res.status(200).json({
      quiz,
    });
  } catch (error) {
    next(error);
  }
};
