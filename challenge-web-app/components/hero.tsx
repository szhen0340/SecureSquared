import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function Hero() {
  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
            Revolutionizing the Future with Secure AI
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100">
            Secure Your Digital <span className="text-emerald-400">Future</span>{" "}
            With Performant AI
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            Our advanced LLMs manage everything from personal finance to
            healthcare, making your life simpler and more secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              className="border-white border-1 hover:bg-zinc-800 text-white"
            >
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-700"
                ></div>
              ))}
            </div>
            <p className="text-sm text-zinc-400">
              <span className="font-semibold text-zinc-300">10,000+</span>{" "}
              companies trust our security
            </p>
          </div>
        </div>
        {/* Placeholder image */}
        <div className="relative">
          <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl"></div>
            <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl"></div>
            <div className="p-6 relative z-10">
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-zinc-900/80 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Play />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-zinc-800 p-4">
                    <div className="h-8 w-8 rounded-full bg-zinc-700 mb-3"></div>
                    <div className="h-2 w-16 bg-zinc-700 rounded mb-2"></div>
                    <div className="h-2 w-12 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <div className="absolute -z-10 -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/20 via-zinc-100/10 to-emerald-500/20 blur-xl opacity-50"></div>
        </div>
      </div>
    </main>
  );
}
