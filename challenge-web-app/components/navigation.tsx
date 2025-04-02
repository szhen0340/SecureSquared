"use client";

import { Shield } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 mx-auto max-w-7xl px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-zinc-100">
          <div className="flex items-center gap-2">
            <Shield className="size-10 text-emerald-400" />
            SecureSquared
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {["FinanceGuard", "HealthSync", "SecureHome", "Careers", "Blog"].map(
            (item) => (
              <Link
                key={item}
                href={"/" + item.toLowerCase()}
                className={`text-sm ${
                  "/" + item.toLowerCase() === pathname
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-zinc-100 hover:cursor-pointer"
            >
              Sign In
            </Button>
            <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 hover:cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
