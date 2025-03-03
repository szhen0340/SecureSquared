import { BadgeCheck, Box, Clock, Lock, Radar, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function About() {
  return (
    <section className="relative z-10 px-12 py-36 bg-zinc-950">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left column with image and decorative elements */}
        <div className="relative">
          <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>

            <div className="p-6 relative z-10">
              <div className="aspect-[7/3] relative rounded-lg overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="size-16 text-emerald-400" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                      <Clock className="size-5 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-medium text-zinc-200">99.9%</h4>
                    <p className="text-xs text-zinc-400">Threat Detection</p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                      <BadgeCheck className="size-5 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-medium text-zinc-200">24/7</h4>
                    <p className="text-xs text-zinc-400">Monitoring</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
          <div className="absolute -z-10 -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/20 via-zinc-100/5 to-emerald-500/20 blur-xl opacity-50"></div>
        </div>

        {/* Right column with content */}
        <div>
          <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
            About SecureSquared
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-6">
            Enterprise-Grade Security for the{" "}
            <span className="text-emerald-400">AI Era</span>
          </h2>

          <p className="text-zinc-400 mb-8">
            At SecureSquared, we're pioneering the next generation of AI-powered
            solutions. Our advanced systems protect your most valuable digital
            assets with adaptive intelligence that evolves alongside emerging
            threats.
          </p>

          <div className="space-y-6 mb-8">
            {[
              {
                title: "Adaptive AI Defense",
                description:
                  "Our systems continuously learn from global threat patterns to anticipate and neutralize attacks before they reach your network.",
                icon: <Radar className="size-5 text-emerald-400" />,
              },
              {
                title: "Privacy-First Architecture",
                description:
                  "Our systems are designed with privacy at their core, ensuring your data remains secure while still enabling powerful security analytics.",
                icon: <Lock className="size-5 text-emerald-400" />,
              },
              {
                title: "Seamless Integration",
                description:
                  "Deploy our solutions across your existing infrastructure with minimal disruption and maximum compatibility.",
                icon: <Box className="size-5 text-emerald-400" />,
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Learn About Our Approach
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
