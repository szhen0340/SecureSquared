import * as faceapi from "face-api.js";

export const loadModels = async (): Promise<boolean> => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    return true;
  } catch (error) {
    console.error("Error loading face-api.js models:", error);
    return false;
  }
};
