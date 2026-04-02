import pdfParse from 'pdf-parse';

export const extractTextFromFile = async (file) => {
  if (!file?.buffer) {
    throw new Error('Invalid file input. File buffer is required.');
  }

  const lowerName = String(file.originalname || '').toLowerCase();

  if (file.mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || '';
  }

  return file.buffer.toString('utf-8');
};
