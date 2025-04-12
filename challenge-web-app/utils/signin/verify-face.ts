import * as faceapi from "face-api.js";
import { loadImage, createOutputImage } from "./process-images";
import { calculateSimilarity } from "./calculate-similarity";

export interface VerificationResult {
  verified: boolean;
  outputPath: string | null;
  similarity?: number;
  message: string;
}

export const verifyFace = async (
  imageUrl: string
): Promise<VerificationResult> => {
  try {
    const target = await fetch("/signin.json").then((res) => res.json());
    const targetDescriptor = new Float32Array(Object.values(target.match));

    const img = await loadImage(imageUrl);
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      return {
        verified: false,
        outputPath: null,
        message: "No face detected",
      };
    }

    const face = detections.reduce((prev, current) => {
      const prevArea = prev.detection.box.width * prev.detection.box.height;
      const currentArea =
        current.detection.box.width * current.detection.box.height;
      return prevArea > currentArea ? prev : current;
    });

    const outputPath = createOutputImage(img);
    const { message, similarity } = await calculateSimilarity(
      face.descriptor,
      targetDescriptor
    );

    return {
      verified: similarity > 0.6,
      outputPath,
      similarity,
      message: message,
    };
  } catch (error) {
    console.error("Error in face verification:", error);
    throw new Error("Face verification failed");
  }
};
