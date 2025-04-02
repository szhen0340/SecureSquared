import { initializePopulation, evaluatePopulation } from "./population";
import { evolvePopulation } from "./selection";

export const runGeneticAlgorithm = async ({
  seedImages,
  targetEmbedding,
  populationSize,
  mutationRate,
  maxGenerations,
  onProgress,
}: {
  seedImages: string | string[];
  targetEmbedding: Float32Array;
  populationSize: number;
  mutationRate: number;
  maxGenerations: number;
  onProgress: (update: ProgressUpdate) => void;
}) => {
  if (!Array.isArray(seedImages)) {
    seedImages = [seedImages];
  }

  let generation = 0;
  let bestSimilarity = 0;
  let bestImage = null;

  let population = await initializePopulation(seedImages, populationSize);

  for (let gen = 0; gen < maxGenerations; gen++) {
    const fitnessResults = await evaluatePopulation(
      population,
      targetEmbedding
    );

    const bestIndex = fitnessResults.indexOf(Math.max(...fitnessResults));

    if (fitnessResults[bestIndex] > bestSimilarity) {
      bestImage = population[bestIndex];
      bestSimilarity = fitnessResults[bestIndex];

      onProgress({
        currentGeneration: gen,
        bestSimilarity,
        bestImage,
      });
    }

    if (bestSimilarity > 0.6) {
      break;
    }

    population = await evolvePopulation(
      population,
      fitnessResults,
      mutationRate
    );
    generation = gen + 1;

    onProgress({
      currentGeneration: generation,
      bestSimilarity,
      bestImage,
    });
  }

  return {
    generation,
    bestSimilarity,
    bestImage,
  };
};

interface ProgressUpdate {
  currentGeneration: number;
  bestSimilarity: number;
  bestImage: string | null;
}
