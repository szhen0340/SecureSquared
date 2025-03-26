"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Mic,
  Upload,
  Shield,
  Loader2,
  Home,
  AlertCircle,
  CheckCircle2,
  Volume2,
  WifiOff,
} from "lucide-react";

export default function AudioGuardPage() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<
    "idle" | "listening" | "processing" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Say the passphrase to authenticate"
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(
    Array(20).fill(3)
  );

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setVisualizerValues(
          Array(20)
            .fill(0)
            .map(() => Math.floor(Math.random() * 50) + 5)
        );
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVisualizerValues(Array(20).fill(3));
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioBlob(event.data);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDeviceStatus("listening");
      setStatusMessage("Listening for passphrase...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setDeviceStatus("error");
      setStatusMessage("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setDeviceStatus("processing");
      setStatusMessage("Processing audio...");
      handleAuthentication();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setDeviceStatus("processing");
      setStatusMessage("Processing uploaded audio...");
      handleAuthentication();
    }
  };

  const handleAuthentication = () => {
    setIsProcessing(true);
    // Simulate audio verification process
    setTimeout(() => {
      setIsProcessing(false);
      setDeviceStatus("success");
      setStatusMessage("Voice pattern recognized");
      setTimeout(() => {
        setDialogOpen(true);
      }, 1000);
    }, 3000);
  };

  const getStatusIcon = () => {
    switch (deviceStatus) {
      case "idle":
        return <Volume2 className="h-12 w-12 text-zinc-400" />;
      case "listening":
        return <Mic className="h-12 w-12 text-emerald-400 animate-pulse" />;
      case "processing":
        return <Loader2 className="h-12 w-12 text-emerald-400 animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-emerald-400" />;
      case "error":
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="bg-zinc-800 p-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-xs text-zinc-400">ARMED</span>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col items-center justify-center gap-4 border border-zinc-700">
            <div className="relative w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border-4 border-zinc-700">
              {getStatusIcon()}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20"></div>
            </div>

            <div className="text-center">
              <h3 className="text-zinc-200 font-medium">{statusMessage}</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Home Security System v2.5
              </p>
            </div>

            {/* Audio visualizer */}
            <div className="w-full h-12 flex items-center justify-center gap-1">
              {visualizerValues.map((value, index) => (
                <div
                  key={index}
                  className="w-1.5 bg-emerald-400/80 rounded-full"
                  style={{ height: `${value}px` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              className={`bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 h-16 ${
                isRecording ? "bg-emerald-500/20 border-emerald-500/50" : ""
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <div className="flex flex-col items-center">
                <Mic
                  className={`h-5 w-5 ${
                    isRecording ? "text-emerald-400" : "text-zinc-400"
                  }`}
                />
                <span className="text-xs mt-1">
                  {isRecording ? "Stop" : "Speak"}
                </span>
              </div>
            </Button>

            <label className="cursor-pointer">
              <Input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-md h-16 flex flex-col items-center justify-center">
                <Upload className="h-5 w-5 text-zinc-400" />
                <span className="text-xs mt-1">Upload</span>
              </div>
            </label>

            <Button
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 h-16 col-span-1"
              disabled={true}
            >
              <div className="flex flex-col items-center">
                <Home className="h-5 w-5 text-zinc-400" />
                <span className="text-xs mt-1">Status</span>
              </div>
            </Button>

            <Button
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 h-16 col-span-1"
              disabled={true}
            >
              <div className="flex flex-col items-center">
                <WifiOff className="h-5 w-5 text-zinc-400" />
                <span className="text-xs mt-1">Offline</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">
              Access Granted
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Voice pattern recognized. Welcome home.
              <div className="mt-4 p-3 bg-zinc-800 rounded-md border border-zinc-700 font-mono text-emerald-400">
                {"FLAG: CTF{v01c3_r3c0gn1t10n_byp4ss3d}"}
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white mt-4"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
