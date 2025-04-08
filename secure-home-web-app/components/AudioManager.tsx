"use client";

import React, { useEffect, useState } from "react";

import Constants from "../utils/Constants";
import { Transcriber } from "../hooks/useTranscriber";
import Progress from "./Progress";
import AudioRecorder from "./AudioRecorder";
import AudioPlayer from "./AudioPlayer";
import { Upload } from "lucide-react";

import { authenticateVoice } from "@/utils/Authentication";

export enum AudioSource {
  URL = "URL",
  FILE = "FILE",
  RECORDING = "RECORDING",
}

export function AudioManager(props: { transcriber: Transcriber }) {
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [audioData, setAudioData] = useState<
    | {
        buffer: AudioBuffer;
        url: string;
        source: AudioSource;
        mimeType: string;
      }
    | undefined
  >(undefined);
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    message: string;
    flag?: string;
    similarity?: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const isAudioLoading = progress !== undefined;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (props.transcriber.output && !props.transcriber.isBusy && audioData) {
      authenticateVoice(audioData.buffer)
        .then((result) => {
          console.log("Authentication result:", result);
          setAuthResult(result);
        })
        .catch((error) => {
          console.error("Authentication error:", error);
          setAuthResult({
            success: false,
            message: "Error during authentication: " + error.message,
          });
        });
    }
  }, [props.transcriber.output, props.transcriber.isBusy, audioData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const urlObj = URL.createObjectURL(file);
    const mimeType = file.type;

    setAuthResult(null);

    const reader = new FileReader();
    reader.onloadend = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      const audioCTX = new AudioContext({
        sampleRate: Constants.SAMPLING_RATE,
      });

      const decoded = await audioCTX.decodeAudioData(arrayBuffer);
      props.transcriber.onInputChange();
      setAudioData({
        buffer: decoded,
        url: urlObj,
        source: AudioSource.FILE,
        mimeType: mimeType,
      });

      props.transcriber.start(decoded);
    };
    reader.readAsArrayBuffer(file);

    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleRecordingComplete = (blob: Blob) => {
    props.transcriber.onInputChange();

    setAuthResult(null);

    const blobUrl = URL.createObjectURL(blob);
    const fileReader = new FileReader();
    fileReader.onprogress = (event) => {
      setProgress(event.loaded / event.total || 0);
    };
    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({
        sampleRate: Constants.SAMPLING_RATE,
      });
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const decoded = await audioCTX.decodeAudioData(arrayBuffer);
      setProgress(undefined);
      setAudioData({
        buffer: decoded,
        url: blobUrl,
        source: AudioSource.RECORDING,
        mimeType: blob.type,
      });

      props.transcriber.start(decoded);
    };
    fileReader.readAsArrayBuffer(blob);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 w-full mb-2">
        <label className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg p-3 cursor-pointer transition-all duration-200 text-gray-300 hover:text-white">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="h-5 w-5 text-zinc-400" />
          <span className="text-xs mt-1">Upload</span>
        </label>

        {isClient &&
          typeof window !== "undefined" &&
          window.navigator.mediaDevices && (
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          )}
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-1 mb-2">
        <div
          className="bg-emerald-400 h-1 rounded-full transition-all duration-100"
          style={{
            width: isAudioLoading
              ? `${Math.round(progress! * 100)}%`
              : audioData
              ? "100%"
              : "0%",
          }}
        ></div>
      </div>

      {audioData && (
        <>
          <AudioPlayer audioUrl={audioData.url} mimeType={audioData.mimeType} />

          {props.transcriber.output && (
            <div className="p-3 bg-zinc-800/50 rounded">
              <h3 className="font-medium text-zinc-300 mb-1">Transcription:</h3>
              <p className="text-zinc-100">{props.transcriber.output.text}</p>
            </div>
          )}

          {authResult && (
            <div
              className={`p-4 rounded-lg text-zinc-200 ${
                authResult.success
                  ? "bg-emerald-900/50 border border-emerald-700"
                  : "bg-red-900/50 border border-rose-700"
              }`}
            >
              <h3 className="font-bold mb-1">
                {authResult.success
                  ? "Authentication Successful"
                  : "Authentication Failed"}
              </h3>
              <p>
                {authResult.message}{" "}
                {authResult.similarity !== undefined &&
                  `Similarity: ${(authResult.similarity * 100).toFixed(2)}%`}
              </p>

              {authResult.flag && (
                <div className="mt-3 p-3 bg-black/50 rounded font-mono text-emerald-400 border border-emerald-500">
                  Flag: {authResult.flag}
                </div>
              )}
            </div>
          )}

          {props.transcriber.progressItems.length > 0 && (
            <div className="relative z-10 p-4 w-full">
              <label className="text-gray-300 text-sm">
                Loading model files... (only run once)
              </label>
              {props.transcriber.progressItems.map((data) => (
                <div key={data.file}>
                  <Progress text={data.file} percentage={data.progress} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
