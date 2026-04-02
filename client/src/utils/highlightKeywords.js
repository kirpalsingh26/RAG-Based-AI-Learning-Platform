const KEYWORDS = [
  'important',
  'definition',
  'example',
  'step',
  'note',
  'formula',
  'algorithm',
  'database',
  'process',
  'memory',
  'normalization',
];

const escaped = KEYWORDS.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

export const highlightKeywords = (text) => {
  const normalized = String(text || '');

  if (!normalized.trim()) return [];

  const parts = [];
  let lastIndex = 0;

  normalized.replace(pattern, (match, _p1, offset) => {
    if (offset > lastIndex) {
      parts.push({
        type: 'text',
        value: normalized.slice(lastIndex, offset),
      });
    }

    parts.push({
      type: 'keyword',
      value: match,
    });

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < normalized.length) {
    parts.push({
      type: 'text',
      value: normalized.slice(lastIndex),
    });
  }

  return parts;
};
