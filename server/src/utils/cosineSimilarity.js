export const cosineSimilarity = (vectorA, vectorB) => {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) return 0;
  if (!vectorA.length || vectorA.length !== vectorB.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    const valueA = Number(vectorA[index] || 0);
    const valueB = Number(vectorB[index] || 0);

    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }

  if (!magnitudeA || !magnitudeB) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};
