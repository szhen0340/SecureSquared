"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
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
import Link from "next/link";
import { loadModels } from "@/utils/signin/load-models";
import { fileToDataUrl } from "@/utils/signin/process-images";
import { verifyFace, VerificationResult } from "@/utils/signin/verify-face";

export default function LoginPage() {
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const webcamRef = useRef<any>(null);

  useEffect(() => {
    const initModels = async () => {
      const loaded = await loadModels();
      setModelsLoaded(loaded);
      if (!loaded) {
        setErrorMessage("Failed to load face recognition models");
      }
    };

    initModels();
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setCapturedImage(dataUrl);
      } catch (error) {
        console.error("Error processing file:", error);
        setErrorMessage("Failed to process the uploaded image");
      }
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
