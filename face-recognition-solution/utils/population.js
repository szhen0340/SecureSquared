import { extractFaceDescriptor, calculateSimilarity } from "./face-utils";
import { loadImage } from "./image-utils";

// Initialize genetic algorithm population
export const initializePopulation = async (seedImages, size) => {
  const population = [];

  if (!Array.isArray(seedImages)) {
    seedImages = [seedImages];
  }

  population.push(...seedImages);

  try {
    const images = await Promise.all(
      seedImages.map((seedImage) => loadImage(seedImage))
    );

    // Create variations to fill the rest of the population
    while (population.length < size) {
      try {
        // Select a random seed image to create variation from
        const randomIndex = Math.floor(Math.random() * images.length);
        const img = images[randomIndex];

        // Create a canvas for image manipulation
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Apply random transformations
        // 1. Brightness/contrast adjustment
        if (Math.random() > 0.5) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const factor = 0.9 + Math.random() * 0.2; // 90-110%

          for (let p = 0; p < imageData.data.length; p += 4) {
            imageData.data[p] = Math.min(255, imageData.data[p] * factor); // R
            imageData.data[p + 1] = Math.min(
              255,
              imageData.data[p + 1] * factor
            ); // G
            imageData.data[p + 2] = Math.min(
              255,
              imageData.data[p + 2] * factor
            ); // B
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // 2. Geometric transformations
        if (Math.random() > 0.5) {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext("2d");

          // Copy current state
          tempCtx.drawImage(canvas, 0, 0);

          // Clear original
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Setup transformation
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);

          // Random rotation (±5 degrees)
          const rotation = ((Math.random() * 10 - 5) * Math.PI) / 180;
          ctx.rotate(rotation);

          // Random scale (95-105%)
          const scale = 0.95 + Math.random() * 0.1;
          ctx.scale(scale, scale);

          ctx.translate(-canvas.width / 2, -canvas.height / 2);

          // Draw back with transformations
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.restore();
        }

        // Add this variation to the population
        population.push(canvas.toDataURL("image/jpeg"));
      } catch (error) {
        console.error("Error creating variation:", error);
        // Add a random seed image if there's an error
        population.push(
          seedImages[Math.floor(Math.random() * seedImages.length)]
        );
      }
    }
  } catch (error) {
    console.error("Error initializing population:", error);
    // Fill with copies of seed images on error
    while (population.length < size) {
      const index = population.length % seedImages.length;
      population.push(seedImages[index]);
    }
  }

  if (population.length > size) {
    population.splice(size);
  }

  return population;
};

// Evaluate fitness of each individual in the population
export const evaluatePopulation = async (population, targetEmbedding) => {
  const fitnessValues = [];

  for (const imageDataUrl of population) {
    try {
      const descriptor = await extractFaceDescriptor(imageDataUrl);

      let similarity = 0;
      if (descriptor && targetEmbedding) {
        similarity = calculateSimilarity(descriptor, targetEmbedding);
      }

      fitnessValues.push(similarity);
    } catch (error) {
      console.error("Error evaluating individual:", error);
      // Assign low fitness on error
      fitnessValues.push(0.01);
    }
  }

  return fitnessValues;
};
