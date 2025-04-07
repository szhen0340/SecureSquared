"use client";

import { AudioManager } from "@/components/AudioManager";
import { useTranscriber } from "@/hooks/useTranscriber";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

export default function Home() {
  const transcriber = useTranscriber();
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusIcon = () => (
    <svg
      className="w-8 h-8 text-emerald-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 backdrop-blur-sm rounded-xl overflow-hidden">
        <div className="bg-zinc-800 p-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-xs text-zinc-400">ARMED</span>
          </div>
        </div>

        <CardContent className="p-6 space-y-10">
          <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col items-center justify-center gap-4 border border-zinc-700">
            <div className="relative w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border-4 border-zinc-700">
              {getStatusIcon()}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20"></div>
            </div>

            <div className="text-center">
              <h3 className="text-zinc-200 font-medium">
                Ready. Speak the passphrase.
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Secure Home System v1.0
              </p>
            </div>
          </div>

          <AudioManager transcriber={transcriber} />
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
