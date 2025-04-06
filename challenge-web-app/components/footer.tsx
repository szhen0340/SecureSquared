import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, ExternalLink, Lock, Code, Terminal } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-zinc-900 to-zinc-950 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top section with logo and description */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-emerald-400 size-10" />
            <span className="text-2xl font-bold text-zinc-100">
              SecureSquared
            </span>
          </div>
          <p className="text-zinc-400 max-w-xl">
            Pioneering AI-powered security solutions for the digital age.
            Protect your assets with adaptive intelligence.
          </p>
        </div>

        {/* Main links section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8 border-t border-b border-zinc-800">
          {/* Advcaned Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-zinc-100 font-mono text-lg mb-6 flex items-center">
              <Lock className="mr-2 h-5 w-5 text-emerald-400" />
              <span>ADVANCED</span>
            </h3>
            <ul className="space-y-3 text-center md:text-left">
              {["FinanceGuard", "HealthSync", "SecureHome"].map((link) => (
                <li key={link}>
                  <a
                    href={link.toLowerCase()}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center"
                  >
                    <span>{link}</span>
                    <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Beginner Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-zinc-100 font-mono text-lg mb-6 flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-emerald-400" />
              <span>BEGINNER</span>
            </h3>
            <ul className="space-y-3 text-center md:text-left">
              {["Careers", "Blog", "Signin"].map((link) => (
                <li key={link}>
                  <a
                    href={link.toLowerCase()}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center"
                  >
                    <span>{link}</span>
                    <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTF Challenge Hub Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-zinc-100 font-mono text-lg mb-6 flex items-center">
              <Code className="mr-2 h-5 w-5 text-emerald-400" />
              <span>CHALLENGE HUB</span>
            </h3>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 w-full">
              <p className="text-zinc-300 mb-4 text-sm">
                Check out other cybersecurity challenges at Capture the Flame!
              </p>
              <Link href="https://capturetheflame.ctfd.io/">
                <Button
                  variant="outline"
                  className="w-full bg-zinc-800 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:cursor-pointer"
                >
                  Go to hub
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-zinc-500 text-sm font-mono">
              SYSTEM STATUS: ONLINE
            </p>
          </div>

          <p className="text-zinc-500 text-sm">
            &copy; 2025 SecureSquared. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
