"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera, Upload, User, Lock, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = () => {
    setIsProcessing(true);
    // Simulate facial recognition process
    setTimeout(() => {
      setIsProcessing(false);
      setDialogOpen(true);
    }, 3000);
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
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
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
        <CardFooter className="text-center text-zinc-500 text-sm">
          Secure login powered by AI facial recognition
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">
              Login Successful
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Your identity has been verified. The flag is
            </DialogDescription>
          </DialogHeader>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white mt-4"
            onClick={() => setDialogOpen(false)}
          >
            Go back home
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
