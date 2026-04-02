import multer from 'multer';

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/octet-stream',
]);

const fileFilter = (_req, file, callback) => {
  const isTextExtension = /\.(txt|md)$/i.test(file.originalname || '');

  if (allowedMimeTypes.has(file.mimetype) || isTextExtension) {
    callback(null, true);
    return;
  }

  callback(new Error('Only PDF, TXT, and MD files are supported'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
  },
});
