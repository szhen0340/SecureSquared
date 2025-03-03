import { Shield } from "lucide-react";
import { Button } from "./ui/button";

export default function Navigation() {
  return (
    <header className="relative z-10 mx-auto max-w-7xl px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="size-10 text-emerald-400" />
          <span className="text-xl font-bold text-zinc-100">SecureSquared</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Features", "Solutions", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-zinc-400 hover:text-zinc-100"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
            Sign In
          </Button>
          <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}
