import { getFlag } from "./GetFlag";

// Constants
export const AUTHORIZED_PASSPHRASE = "secure home system access granted.";
export const VOICE_SIMILARITY_THRESHOLD = 0.75;

export const authorizedVoiceprint: number[] = [
  0.00016816888152719375, 0.048133303944999845, 0.08856407181128606,
  0.03500517181416742, 0.04743810837049844, 0.05962107324267099,
  0.09291022543380506, 0.04908665384255108, 0.053849924303340534,
  0.00109288619880127, 1273.4375, 1125, 3476.5625, 3226.5625, 1500,
  1343.4710507551622, 514.4566129637083, 920.2320439868705, 1036.6132685387536,
  1276.424333406362,
];

// const initializeAuthorizedVoiceprint = async (
//   audioBuffer: AudioBuffer
// ): Promise<void> => {
//   authorizedVoiceprint = await extractVoiceFeatures(audioBuffer);
//   console.log(authorizedVoiceprint);
//   console.log("Authorized voiceprint initialized");
// };

export const extractVoiceFeatures = async (
  audioBuffer: AudioBuffer
): Promise<number[]> => {
  const audioData = audioBuffer.getChannelData(0);

  const features = [];

  const chunkSize = Math.floor(audioData.length / 10);
  for (let i = 0; i < 10; i++) {
    const chunk = audioData.slice(i * chunkSize, (i + 1) * chunkSize);
    features.push(calculateRMS(chunk));
  }

  features.push(...estimatePitch(audioData, audioBuffer.sampleRate));

  features.push(...calculateSpectralFeatures(audioData));

  return features;
};

// Calculate Root Mean Square (energy)
const calculateRMS = (signal: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < signal.length; i++) {
    sum += signal[i] * signal[i];
  }
  return Math.sqrt(sum / signal.length);
};

// Simplified pitch estimation
const estimatePitch = (signal: Float32Array, sampleRate: number): number[] => {
  const features = [];
  const frameSize = 1024;

  for (let i = 0; i < 5; i++) {
    const startIdx = Math.floor(Math.random() * (signal.length - frameSize));
    const frame = signal.slice(startIdx, startIdx + frameSize);

    // Calculate zero crossing rate as a very crude pitch approximation
    let zeroCrossings = 0;
    for (let j = 1; j < frame.length; j++) {
      if (
        (frame[j] >= 0 && frame[j - 1] < 0) ||
        (frame[j] < 0 && frame[j - 1] >= 0)
      ) {
        zeroCrossings++;
      }
    }

    features.push(((zeroCrossings / frameSize) * sampleRate) / 2);
  }

  return features;
};

// Calculate some basic spectral features
const calculateSpectralFeatures = (signal: Float32Array): number[] => {
  // In a real system, we would use FFT and extract MFCC features
  // This is a simplified version for the CTF
  const features = [];
  const frameSize = 2048;

  // Extract 5 random frames and calculate their spectral centroid
  for (let i = 0; i < 5; i++) {
    const startIdx = Math.floor(Math.random() * (signal.length - frameSize));
    const frame = signal.slice(startIdx, startIdx + frameSize);

    let weightedSum = 0;
    let energySum = 0;

    for (let j = 0; j < frame.length; j++) {
      const magnitude = Math.abs(frame[j]);
      weightedSum += j * magnitude;
      energySum += magnitude;
    }

    const centroid = energySum > 0 ? weightedSum / energySum : 0;
    features.push(centroid);
  }

  return features;
};

// Compare two voiceprints and return similarity score
export const compareVoiceprints = (
  voiceprint1: number[],
  voiceprint2: number[]
): number => {
  if (voiceprint1.length !== voiceprint2.length) {
    throw new Error("Voiceprints have different dimensions");
  }

  // Calculate cosine similarity
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < voiceprint1.length; i++) {
    dotProduct += voiceprint1[i] * voiceprint2[i];
    magnitude1 += voiceprint1[i] * voiceprint1[i];
    magnitude2 += voiceprint2[i] * voiceprint2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

// Check for deepfake indicators
export const detectDeepfake = (audioBuffer: AudioBuffer): boolean => {
  const audioData = audioBuffer.getChannelData(0);

  // Check for unnatural spectral patterns
  let unnaturalPatterns = 0;
  const frameSize = 1024;

  for (let i = 0; i < 10; i++) {
    const startIdx = Math.floor(Math.random() * (audioData.length - frameSize));
    const frame = audioData.slice(startIdx, startIdx + frameSize);

    // Check for unusual spectral flatness
    const rms = calculateRMS(frame);
    let sum = 0;
    for (let j = 0; j < frame.length; j++) {
      sum += Math.abs(frame[j]);
    }
    const mean = sum / frame.length;

    // if RMS/mean ratio is outside expected range, flag as suspicious
    const ratio = rms / mean;
    if (ratio > 1.8 || ratio < 1.2) {
      unnaturalPatterns++;
    }
  }

  return unnaturalPatterns >= 7;
};

export const authenticateVoice = async (
  audioBuffer: AudioBuffer,
  transcribedText: string
): Promise<{ success: boolean; message: string; flag?: string }> => {
  const normalizedTranscript = transcribedText.toLowerCase().trim();

  if (normalizedTranscript !== AUTHORIZED_PASSPHRASE) {
    return {
      success: false,
      message: "Incorrect passphrase. Access denied.",
    };
  }

  if (detectDeepfake(audioBuffer)) {
    return {
      success: false,
      message: "Potential voice synthesis detected. Access denied.",
    };
  }

  if (!authorizedVoiceprint) {
    return {
      success: false,
      message: "No authorized voiceprint found. Please initialize the system.",
    };
  }

  const userVoiceprint = await extractVoiceFeatures(audioBuffer);
  const similarity = compareVoiceprints(authorizedVoiceprint, userVoiceprint);

  if (similarity < VOICE_SIMILARITY_THRESHOLD) {
    return {
      success: false,
      message: `Voice verification failed. Similarity: ${(
        similarity * 100
      ).toFixed(2)}%`,
    };
  }

  return {
    success: true,
    message: "Voice verified. Access granted.",
    flag: await getFlag(),
  };
};
