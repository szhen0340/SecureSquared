import { crossoverImages, mutateImage } from "./image-utils";

// Tournament selection for parent selection
export const tournamentSelection = (fitnessScores) => {
  const tournamentSize = Math.min(3, Math.floor(fitnessScores.length / 3));
  const participants = [];

  for (let i = 0; i < tournamentSize; i++) {
    participants.push(Math.floor(Math.random() * fitnessScores.length));
  }
  return participants.reduce(
    (best, current) =>
      fitnessScores[current] > fitnessScores[best] ? current : best,
    participants[0]
  );
};

// Create next generation through selection, crossover, and mutation
export const evolvePopulation = async (
  population,
  fitnessScores,
  mutationRate
) => {
  const newPopulation = [];

  // Elitism: Keep the best individual
  const bestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
  newPopulation.push(population[bestIndex]);

  // Create the rest of the population
  while (newPopulation.length < population.length) {
    try {
      // Select parents
      const parent1Index = tournamentSelection(fitnessScores);
      let parent2Index;
      do {
        parent2Index = tournamentSelection(fitnessScores);
      } while (parent2Index === parent1Index); // Ensure different parents

      // Get parent images
      const parent1 = population[parent1Index];
      const parent2 = population[parent2Index];

      // Perform crossover or use better parent
      let offspring;
      if (Math.random() < 0.7) {
        // 70% chance of crossover
        offspring = await crossoverImages(parent1, parent2);
      } else {
        offspring =
          fitnessScores[parent1Index] > fitnessScores[parent2Index]
            ? parent1
            : parent2;
      }

      // Apply mutation
      offspring = await mutateImage(offspring, mutationRate);

      // Add to new population
      newPopulation.push(offspring);
    } catch (error) {
      console.error("Error creating offspring:", error);
      // Add the best individual on error
      newPopulation.push(population[bestIndex]);
    }
  }

  return newPopulation;
};
