import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Shield, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-zinc-950  backdrop-blur-sm pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Shield className="text-emerald-400" />
              </div>
              <span className="text-xl font-bold text-zinc-100">
                SecureSquared
              </span>
            </div>
            <p className="text-zinc-400 mb-4">
              Pioneering AI-powered security solutions for the digital age.
              Protect your assets with adaptive intelligence.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {["twitter", "linkedin", "github"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-zinc-500 hover:text-emerald-400 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social === "twitter" && <Twitter />}
                    {social === "linkedin" && <Linkedin />}
                    {social === "github" && <Github />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Products", "Pricing", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2">
              {[
                "FinanceGuard AI",
                "HealthSync AI",
                "SecureHome AI",
                "Enterprise Solutions",
                "Custom Integration",
              ].map((product) => (
                <li key={product}>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Stay Updated</h3>
            <p className="text-zinc-400 mb-4">
              Subscribe to our newsletter for the latest security insights and
              product updates.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500"
              />
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-zinc-400 text-sm">
          <p>&copy; 2025 SecureSquared.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
