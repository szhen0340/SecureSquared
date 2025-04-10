# SecureSquared Voice Authentication Challenge Solution

This repository contains a possible solution to the SecureSquared Voice Authentication Challenge.

## Understanding the Authentication System

Before attempting to bypass the voice authentication system, it's crucial to understand how it works by analyzing its network traffic and implementation.

### Inspecting Network Activity

When opening the Secure Home application and attempting to authenticate with a voice sample, examining the network tab in your browser's Developer Tools reveals important information:

1. The application downloads `pyannote-embeddings.onnx` - a neural network model used for voice embedding extraction
2. It also fetches `embeddings.json` - containing the target voice embeddings that the system matches against

These discoveries provide critical insights into how the authentication system works:

- The system uses the PyAnnote speaker embedding model to convert voice samples into numerical representations
- Authentication succeeds when the submitted voice sample's embeddings are sufficiently similar to the target embeddings

### Examining the Authentication Process

From analyzing the web application code, we can determine that:

1. The system extracts voice embeddings from the submitted audio
2. It compares these embeddings to the target embeddings using cosine similarity
3. Authentication succeeds when the similarity exceeds a certain threshold

By examining the source code (accessible via the Sources tab in Developer Tools), you can see that the system uses a **cosine similarity** measure with a threshold of **0.7** for authentication.

## Solution Approach

Our solution uses an optimization-based approach to generate an audio sample that produces embeddings similar to the target:

1. Start with a base audio sample (can be any human voice)
2. Extract the target embeddings from the `embeddings.json` file
3. Implement a perturbation-based optimization algorithm that:
   - Gradually modifies the base audio sample
   - Evaluates each modification's similarity to the target embeddings
   - Keeps changes that improve similarity

## Usage

1. Download the target embeddings from the application's network requests
2. Prepare the base audio sample. The challenge provides a base audio sample of someone saying the required passphrase, which you can use as your starting point for optimization.
3. Run the notebook in Google Colab with the files you gathered.
4. Upload the generated optimized audio to the Secure Home application
5. Retrieve the flag when authentication succeeds

## Results

The optimization process typically achieves a similarity score above 0.7 within 500 iterations, which is sufficient to bypass the authentication system.

`solution.wav` is the optimized audio that bypassed the system.

The original problem included creating audio that passed the transcription model while passing the speaker identification system. This made the problem exponentially harder so I decided to take out the transcription part to make it easier.
