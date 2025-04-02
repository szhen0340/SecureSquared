import * as faceapi from "face-api.js";

// Extract face descriptor from an image
export const extractFaceDescriptor = async (imageUrl) => {
  try {
    const img = await faceapi.fetchImage(imageUrl);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      return detections.descriptor;
    }
    return null;
  } catch (error) {
    console.error("Error extracting face descriptor:", error);
    return null;
  }
};

// Calculate similarity between two face descriptors
export const calculateSimilarity = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2) return 0;
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return 1 - Math.min(distance, 1.0);
};
