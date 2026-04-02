const buckets = new Map();

const getClientKey = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown-client';
};

export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 60,
  message = 'Too many requests. Please try again later.',
} = {}) => {
  return (req, res, next) => {
    const key = getClientKey(req);
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });

      next();
      return;
    }

    if (current.count >= max) {
      res.status(429).json({ message });
      return;
    }

    current.count += 1;
    next();
  };
};
