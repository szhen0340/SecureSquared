// Load image from data URL
export const loadImage = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

// Crossover two parent images
export const crossoverImages = async (parent1DataUrl, parent2DataUrl) => {
  try {
    // Load both parent images
    const [img1, img2] = await Promise.all([
      loadImage(parent1DataUrl),
      loadImage(parent2DataUrl),
    ]);

    // Create canvas for crossover
    const canvas = document.createElement("canvas");
    canvas.width = img1.width;
    canvas.height = img1.height;
    const ctx = canvas.getContext("2d");

    // Choose a crossover method
    const method = Math.floor(Math.random() * 3);

    switch (method) {
      case 0: // Alpha blending
        // Draw first parent
        ctx.drawImage(img1, 0, 0);

        // Blend with second parent
        ctx.globalAlpha = 0.3 + Math.random() * 0.4; // Random blend 30-70%
        ctx.drawImage(img2, 0, 0);
        ctx.globalAlpha = 1.0;
        break;

      case 1: // Horizontal split
        const splitY = Math.floor(canvas.height * (0.3 + Math.random() * 0.4));

        // Draw top from parent 1
        ctx.drawImage(
          img1,
          0,
          0,
          img1.width,
          splitY,
          0,
          0,
          canvas.width,
          splitY
        );

        // Draw bottom from parent 2
        ctx.drawImage(
          img2,
          0,
          splitY,
          img2.width,
          img2.height - splitY,
          0,
          splitY,
          canvas.width,
          canvas.height - splitY
        );
        break;

      case 2: // Vertical split
        const splitX = Math.floor(canvas.width * (0.3 + Math.random() * 0.4));

        // Draw left from parent 1
        ctx.drawImage(
          img1,
          0,
          0,
          splitX,
          img1.height,
          0,
          0,
          splitX,
          canvas.height
        );

        // Draw right from parent 2
        ctx.drawImage(
          img2,
          splitX,
          0,
          img2.width - splitX,
          img2.height,
          splitX,
          0,
          canvas.width - splitX,
          canvas.height
        );
        break;
    }

    return canvas.toDataURL("image/jpeg");
  } catch (error) {
    console.error("Error during crossover:", error);
    // Return one of the parents on error
    return Math.random() < 0.5 ? parent1DataUrl : parent2DataUrl;
  }
};

// Mutate an image
export const mutateImage = async (imageDataUrl, mutationRate) => {
  try {
    // Skip mutation sometimes based on mutation rate
    if (Math.random() > mutationRate) {
      return imageDataUrl;
    }

    const img = await loadImage(imageDataUrl);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    let appliedMutation = false;

    // Brightness/contrast mutation
    if (Math.random() < mutationRate) {
      appliedMutation = true;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const factor = 0.9 + Math.random() * 0.2; // 90-110%

      for (let p = 0; p < imageData.data.length; p += 4) {
        imageData.data[p] = Math.min(
          255,
          Math.max(0, imageData.data[p] * factor)
        );
        imageData.data[p + 1] = Math.min(
          255,
          Math.max(0, imageData.data[p + 1] * factor)
        );
        imageData.data[p + 2] = Math.min(
          255,
          Math.max(0, imageData.data[p + 2] * factor)
        );
      }

      ctx.putImageData(imageData, 0, 0);
    }

    // Color channel mutation
    if (Math.random() < mutationRate) {
      appliedMutation = true;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const channel = Math.floor(Math.random() * 3); // 0 = R, 1 = G, 2 = B
      const factor = 0.95 + Math.random() * 0.1; // 95-105%

      for (let p = 0; p < imageData.data.length; p += 4) {
        imageData.data[p + channel] = Math.min(
          255,
          Math.max(0, imageData.data[p + channel] * factor)
        );
      }

      ctx.putImageData(imageData, 0, 0);
    }

    // Geometric mutations
    if (Math.random() < mutationRate) {
      appliedMutation = true;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Copy current state
      tempCtx.drawImage(canvas, 0, 0);

      // Clear original
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Random rotation
      if (Math.random() < mutationRate) {
        const rotation = ((Math.random() * 6 - 3) * Math.PI) / 180; // ±3 degrees
        ctx.rotate(rotation);
      }

      // Random scale
      if (Math.random() < mutationRate) {
        const scaleX = 0.98 + Math.random() * 0.04; // 98-102%
        const scaleY = 0.98 + Math.random() * 0.04; // 98-102%
        ctx.scale(scaleX, scaleY);
      }

      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw back with transformations
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
    }

    // Ensure some variation if no mutation was applied
    if (!appliedMutation) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const factor = 0.99 + Math.random() * 0.02; // 99-101%

      for (let p = 0; p < imageData.data.length; p += 4) {
        imageData.data[p] = Math.min(
          255,
          Math.max(0, imageData.data[p] * factor)
        );
        imageData.data[p + 1] = Math.min(
          255,
          Math.max(0, imageData.data[p + 1] * factor)
        );
        imageData.data[p + 2] = Math.min(
          255,
          Math.max(0, imageData.data[p + 2] * factor)
        );
      }

      ctx.putImageData(imageData, 0, 0);
    }

    return canvas.toDataURL("image/jpeg");
  } catch (error) {
    console.error("Error during mutation:", error);
    return imageDataUrl;
  }
};
