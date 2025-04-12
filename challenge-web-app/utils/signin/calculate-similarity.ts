"use server";

import { euclideanDistance } from "face-api.js";

export const calculateSimilarity = async (
  face: number[] | Float32Array<ArrayBufferLike>,
  target: number[] | Float32Array<ArrayBufferLike>
) => {
  const distance = euclideanDistance(face, target);

  const similarity = 1 - Math.min(distance, 1.0);

  return {
    message:
      similarity > 0.6
        ? "Your identity has been verified. The flag is flame{3mb3dd1ngs_4r3_gr8!}."
        : "Your identity could not be verified. Please try again.",
    similarity: similarity,
  };
};
