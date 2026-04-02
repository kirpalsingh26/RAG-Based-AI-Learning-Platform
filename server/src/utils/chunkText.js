const DEFAULT_CHUNK_SIZE = 360;
const DEFAULT_OVERLAP = 60;

export const chunkTextByWords = (
  text,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP,
) => {
  const normalizedText = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalizedText) return [];

  const words = normalizedText.split(' ');
  const chunks = [];

  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + chunkSize, words.length);
    const chunkWords = words.slice(startIndex, endIndex);
    const chunk = chunkWords.join(' ').trim();

    if (chunk) {
      chunks.push({
        text: chunk,
        wordCount: chunkWords.length,
      });
    }

    if (endIndex >= words.length) break;

    startIndex = Math.max(endIndex - overlap, startIndex + 1);
  }

  return chunks;
};
