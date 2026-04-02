const normalizeSubject = (subject) => String(subject || 'general').trim().toLowerCase();
const sanitizeSubject = (subject) => {
  const normalized = normalizeSubject(subject)
    .replace(/[^a-z0-9\s-_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized || normalized.length > 40) {
    return 'general';
  }

  return normalized;
};

export const validateAskRequest = (req, res, next) => {
  const question = String(req.body?.question || '').trim();
  const subject = sanitizeSubject(req.body?.subject);

  if (!question) {
    res.status(400).json({ message: 'Question is required.' });
    return;
  }

  if (question.length < 3 || question.length > 1000) {
    res.status(400).json({ message: 'Question length must be between 3 and 1000 characters.' });
    return;
  }

  req.body.question = question;
  req.body.subject = subject;
  next();
};

export const validateQuizRequest = (req, res, next) => {
  const subject = sanitizeSubject(req.body?.subject);
  const count = Number(req.body?.count || 5);

  req.body.subject = subject;
  req.body.count = Number.isNaN(count) ? 5 : Math.min(10, Math.max(1, Math.floor(count)));

  next();
};

export const validateUploadRequest = (req, res, next) => {
  const subject = sanitizeSubject(req.body?.subject);
  const topic = String(req.body?.topic || 'general').trim().toLowerCase();

  req.body.subject = subject;
  req.body.topic = topic || 'general';
  next();
};

export const validateCodeRunRequest = (req, res, next) => {
  const language = String(req.body?.language || '').trim().toLowerCase();
  const sourceCode = String(req.body?.sourceCode || '');
  const stdin = String(req.body?.stdin || '');

  const allowedLanguages = new Set(['javascript', 'python', 'java', 'cpp']);

  if (!allowedLanguages.has(language)) {
    res.status(400).json({ message: 'Unsupported language.' });
    return;
  }

  if (!sourceCode.trim()) {
    res.status(400).json({ message: 'Source code is required.' });
    return;
  }

  if (sourceCode.length > 50000) {
    res.status(400).json({ message: 'Source code is too large.' });
    return;
  }

  if (stdin.length > 10000) {
    res.status(400).json({ message: 'Input is too large.' });
    return;
  }

  req.body.language = language;
  req.body.sourceCode = sourceCode;
  req.body.stdin = stdin;
  next();
};
