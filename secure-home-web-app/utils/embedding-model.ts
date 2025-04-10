import * as onnxruntime from "onnxruntime-web";

export const extractVoiceEmbeddings = async (audioBuffer: AudioBuffer) => {
  const session = await onnxruntime.InferenceSession.create(
    "./pyannote-embeddings.onnx"
  );

  const processedData = audioBuffer.getChannelData(0);

  const inputTensor = new onnxruntime.Tensor("float32", processedData, [
    1,
    processedData.length,
  ]);

  const feeds = { waveform: inputTensor };
  const results = await session.run(feeds);

  return results["embeddings"];
};

export const createReferenceEmbedding = async (audioBuffer: AudioBuffer) => {
  const embedding = await extractVoiceEmbeddings(audioBuffer);

  const embeddingArray = Array.from(embedding.data || embedding);

  const dataStr = JSON.stringify(embedding);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", "embedding.json");
  linkElement.click();
  linkElement.remove();

  return embeddingArray;
};
