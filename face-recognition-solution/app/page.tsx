/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  Dna,
  Fingerprint,
  BarChart2,
  Image as ImageIcon,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import data from "@/target.json";
import { runGeneticAlgorithm } from "@/utils/genetic-algorithm";

export default function Home() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetEmbedding, setTargetEmbedding] = useState<Float32Array | null>(
    null
  );
  const [seedImages, setSeedImages] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [bestSimilarity, setBestSimilarity] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [populationSize, setPopulationSize] = useState(20);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [maxGenerations, setMaxGenerations] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        setTargetEmbedding(new Float32Array(data.match));
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const imagePromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((images) => {
        setSeedImages((prevImages) => [...prevImages, ...images]);
      });
    }
  };

  const removeImage = (index: number) => {
    setSeedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setSeedImages([]);
  };

  const downloadGeneratedImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-face-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunGeneticAlgorithm = async () => {
    if (!targetEmbedding || seedImages.length === 0) return;

    setIsProcessing(true);
    setGeneration(0);
    setBestSimilarity(0);

    try {
      await runGeneticAlgorithm({
        seedImages,
        targetEmbedding,
        populationSize,
        mutationRate,
        maxGenerations,
        onProgress: ({ currentGeneration, bestSimilarity, bestImage }) => {
          setGeneration(currentGeneration);
          setBestSimilarity(bestSimilarity);
          if (bestImage) {
            setGeneratedImage(bestImage);
          }
        },
      });
    } catch (error) {
      console.error("Error running genetic algorithm:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Dna className="h-6 w-6" />
            Face Recognition Bypass
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="populationSize">Population Size</Label>
                    <Slider
                      id="populationSize"
                      min={5}
                      max={50}
                      step={1}
                      value={[populationSize]}
                      onValueChange={(value) => setPopulationSize(value[0])}
                      className="my-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {populationSize}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mutationRate">Mutation Rate</Label>
                    <Slider
                      id="mutationRate"
                      min={0}
                      max={1}
                      step={0.05}
                      value={[mutationRate]}
                      onValueChange={(value) => setMutationRate(value[0])}
                      className="my-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {mutationRate.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxGenerations">Max Generations</Label>
                    <Slider
                      id="maxGenerations"
                      min={10}
                      max={500}
                      step={10}
                      value={[maxGenerations]}
                      onValueChange={(value) => setMaxGenerations(value[0])}
                      className="my-2"
                    />
                    <div className="text-sm text-muted-foreground">
                      {maxGenerations}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col border rounded-md p-4 h-64 overflow-auto">
                    {seedImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {seedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Seed face ${index + 1}`}
                              className="max-h-28 object-contain mx-auto"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <p>Upload seed images</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-grow"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Seed Images
                    </Button>

                    {seedImages.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearAllImages}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="text-sm text-muted-foreground text-center">
                    {seedImages.length} image
                    {seedImages.length !== 1 ? "s" : ""} selected
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex flex-col border rounded-md p-4 h-64 overflow-auto">
                    {seedImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {seedImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Seed face ${index + 1}`}
                            className="max-h-28 object-contain mx-auto"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>No seed images</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Seed Images ({seedImages.length})
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col border rounded-md p-4 h-64">
                    {generatedImage ? (
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="max-h-full max-w-full object-contain mx-auto"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>No generated image yet</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Current Best Generated Image
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Generation: {generation}/{maxGenerations}
                  </span>
                  <span>Best Similarity: {bestSimilarity.toFixed(4)}</span>
                </div>
                <Progress value={(generation / maxGenerations) * 100} />
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleRunGeneticAlgorithm}
                  disabled={
                    isProcessing || !modelsLoaded || seedImages.length === 0
                  }
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Dna className="mr-2 h-4 w-4" />
                      Start Genetic Algorithm
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex flex-col border rounded-md p-4 h-64">
                    {generatedImage ? (
                      <img
                        src={generatedImage}
                        alt="Best match"
                        className="max-h-full max-w-full object-contain mx-auto"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>No results yet</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center font-medium">
                    Best Match Generated
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Results Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Similarity Score:
                        </span>
                        <span
                          className={
                            bestSimilarity > 0.6
                              ? "text-green-500 font-medium"
                              : "text-red-500 font-medium"
                          }
                        >
                          {bestSimilarity.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Authentication Threshold:
                        </span>
                        <span>0.6000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={
                            bestSimilarity > 0.6
                              ? "text-green-500 font-medium"
                              : "text-red-500 font-medium"
                          }
                        >
                          {bestSimilarity > 0.6 ? "PASS" : "FAIL"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Generations Run:
                        </span>
                        <span>{generation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Seed Images Used:
                        </span>
                        <span>{seedImages.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Authentication
                    </h3>
                    <Button
                      className={
                        bestSimilarity > 0.6
                          ? "w-full bg-green-500 hover:bg-green-600"
                          : "w-full bg-red-500 hover:bg-red-600"
                      }
                      disabled={!generatedImage}
                      onClick={downloadGeneratedImage}
                    >
                      Download Generated Image
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div>Models: {modelsLoaded ? "Loaded" : "Loading..."}</div>
          <div>
            Target Embedding: {targetEmbedding ? "Loaded" : "Not Loaded"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
