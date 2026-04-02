const cache = new Map();
const CACHE_VERSION = 'v3';

const getTtlMs = () => Number(process.env.CACHE_TTL_SECONDS || 900) * 1000;

export const createCacheKey = (subject, question) =>
  `${CACHE_VERSION}::${String(subject || 'general').toLowerCase()}::${String(question || '').trim().toLowerCase()}`;

export const getCachedValue = (cacheKey) => {
  const entry = cache.get(cacheKey);

  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    cache.delete(cacheKey);
    return null;
  }

  return entry.value;
};

export const setCachedValue = (cacheKey, value) => {
  cache.set(cacheKey, {
    value,
    expiresAt: Date.now() + getTtlMs(),
  });
};
