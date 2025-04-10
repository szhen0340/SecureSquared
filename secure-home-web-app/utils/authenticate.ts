/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { extractVoiceEmbeddings } from "./embedding-model";
import { getFlag } from "./get-flag";

function extractEmbeddingArray(embedding) {
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

function calculateCosineSimilarity(embeddingA, embeddingB) {
  const a = extractEmbeddingArray(embeddingA);
  const b = extractEmbeddingArray(embeddingB);

  if (a.length !== b.length) {
    console.error(`Dimension mismatch: ${a.length} vs ${b.length}`);
    return 0;
  }

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

  const similarity = calculateCosineSimilarity(
    currentEmbedding,
    targetEmbedding
  );

  if (similarity > 0.7) {
    return {
      success: true,
      message: "Voice authenticated.",
      flag: await getFlag(),
      similarity: similarity,
    };
  } else {
    return {
      success: false,
      message: "Voice not recognized.",
      similarity: similarity,
    };
  }
};
