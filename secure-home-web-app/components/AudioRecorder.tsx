"use client";

import { useState, useEffect, useRef } from "react";

import { formatAudioTimestamp } from "../utils/audio-utils";
import { webmFixDuration } from "../utils/blob-fix";
import { Mic } from "lucide-react";

function getMimeType() {
  const types = [
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
}

export default function AudioRecorder(props: {
  onRecordingComplete: (blob: Blob) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const startTime = Date.now();

    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
        if (mediaRecorder.state === "inactive") {
          const duration = Date.now() - startTime;

          // Received a stop event
          let blob = new Blob(chunksRef.current, { type: mimeType });

          if (mimeType === "audio/webm") {
            blob = await webmFixDuration(blob, duration, blob.type);
          }

          props.onRecordingComplete(blob);

          chunksRef.current = [];
        }
      });
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // set state to inactive
      setDuration(0);
      setRecording(false);
    }
  };

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [recording]);

  const handleToggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      className="flex flex-col items-center w-full justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg p-3 cursor-pointer transition-all duration-200 text-gray-300 hover:text-white"
      onClick={handleToggleRecording}
    >
      {recording ? (
        <>
          <div className="animate-pulse">
            <Mic className="h-5 w-5 text-zinc-400" />
          </div>
          <span className="text-xs">
            Recording... ({formatAudioTimestamp(duration)})
          </span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5 text-zinc-400" />
          <span className="text-xs">Start Recording</span>
        </>
      )}
    </button>
  );
}
