import { extractVoiceEmbeddings } from "./embedding-model";
import { calculateSimilarity } from "./calculate-similarity";

function extractEmbeddingArray(embedding: {
  cpuData: any[];
  dims: number[];
  size: number;
}) {
  // Handle authorized embeddings loaded from storage
  if (Array.isArray(embedding)) {
    return embedding;
  }

  // Handle the model tensor output format
  if (embedding && embedding.cpuData && embedding.dims) {
    const size = embedding.size || embedding.dims[0] * embedding.dims[1];
    const result = new Array(size);

    for (let i = 0; i < size; i++) {
      result[i] = embedding.cpuData[i];
    }

    return result;
  }

  console.error("Unknown embedding format:", embedding);
  throw new Error("Cannot extract embedding data");
}

function calculateCosineSimilarity(a: any[], b: number[]) {
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

export const authenticateVoice = async (audioBuffer: AudioBuffer) => {
  const currentEmbedding = await extractVoiceEmbeddings(audioBuffer);

  const targetEmbedding = await fetch("/embedding.json").then((res) =>
    res.json()
  );

  const currentEmbeddingArray = extractEmbeddingArray(currentEmbedding);
  const targetEmbeddingArray = extractEmbeddingArray(targetEmbedding);

  const { similarity, message } = await calculateSimilarity(
    currentEmbeddingArray,
    targetEmbeddingArray
  );

  if (similarity > 0.7) {
    return {
      success: true,
      message: message,
      similarity: similarity,
    };
  } else {
    return {
      success: false,
      message: message,
      similarity: similarity,
    };
  }
};
