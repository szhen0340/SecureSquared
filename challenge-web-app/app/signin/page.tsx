"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Camera,
  Upload,
  User,
  Lock,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { getMessage } from "@/utils/signin/get-message";
import Link from "next/link";

export default function LoginPage() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const webcamRef = useRef<any>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
        setErrorMessage("Failed to load face recognition models");
      }
    };

    loadModels();
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyFace = async (imageUrl: string) => {
    try {
      const target = await fetch("/signin.json").then((res) => res.json());
      const targetDescriptor = new Float32Array(Object.values(target.match));

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return {
          verified: false,
          outputPath: null,
          message: "No face detected",
        };
      }

      const face = detections.reduce((prev, current) => {
        const prevArea = prev.detection.box.width * prev.detection.box.height;
        const currentArea =
          current.detection.box.width * current.detection.box.height;
        return prevArea > currentArea ? prev : current;
      });

      const distance = faceapi.euclideanDistance(
        face.descriptor,
        targetDescriptor
      );

      const similarity = 1 - Math.min(distance, 1.0);

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height);
      }

      const outputPath = canvas.toDataURL("image/jpeg");

      const message = getMessage(similarity);

      return {
        verified: similarity > 0.6,
        outputPath,
        similarity,
        message: message,
      };
    } catch (error) {
      console.error("Error in face verification:", error);
      throw new Error("Face verification failed");
    }
  };

  const handleLogin = async () => {
    if (!capturedImage || !modelsLoaded) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const result = await verifyFace(capturedImage);
      setVerificationResult(result);
      setDialogOpen(true);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Face verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-zinc-100 flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            SecureSquared
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCapturing ? (
            <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : capturedImage ? (
            <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
              <User className="h-20 w-20 text-zinc-700" />
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 p-3 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errorMessage}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => setIsCapturing(true)}
              disabled={isCapturing}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Image
            </Button>
            <label className="flex-1">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md px-4 py-2 text-sm font-medium cursor-pointer flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </div>
            </label>
          </div>
          {isCapturing && (
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={capture}
            >
              Take Photo
            </Button>
          )}
          {capturedImage && (
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleLogin}
              disabled={isProcessing || !modelsLoaded}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !modelsLoaded ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading models...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Login with Face ID
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle
              className={
                verificationResult?.verified
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            >
              {verificationResult?.verified
                ? "Login Successful"
                : "Login Failed"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {verificationResult?.message ||
                "Your identity verification has been processed."}
            </DialogDescription>
          </DialogHeader>

          {verificationResult?.outputPath && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={verificationResult.outputPath}
                alt="Verification result"
                className="w-full"
              />
            </div>
          )}

          <div className="text-zinc-400 text-sm">
            Similarity score: {verificationResult?.similarity}
          </div>
          {verificationResult?.verified ? (
            <Link href="/">
              <Button
                className={
                  "bg-emerald-500 hover:bg-emerald-600 text-white w-full"
                }
                onClick={() => setDialogOpen(false)}
              >
                Go Home
              </Button>
            </Link>
          ) : (
            <Button
              className={"bg-zinc-700 hover:bg-zinc-600 text-white"}
              onClick={() => setDialogOpen(false)}
            >
              Try again
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
