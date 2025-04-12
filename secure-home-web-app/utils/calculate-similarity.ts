"use server";

function calculateCosineSimilarity(a: any[], b: any[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const calculateSimilarity = async (
  currentEmbedding: any[],
  targetEmbeddings: any[]
) => {
  const similarity = calculateCosineSimilarity(
    currentEmbedding,
    targetEmbeddings
  );

  return {
    message:
      similarity > 0.7
        ? "Voice authenticated. The flag is flame{v01c3_b10m3tr1c_4uth_byp4ss3d}."
        : "Voice not recognized. Please try again.",
    similarity: similarity,
  };
};
