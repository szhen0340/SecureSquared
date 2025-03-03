import { Activity, CreditCard, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function Products() {
  return (
    <section className="relative z-10 py-24 bg-zinc-950 px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Advanced AI <span className="text-emerald-400">Security</span>{" "}
          Solutions
        </h2>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Our suite of specialized AI systems provides comprehensive protection
          across your most critical digital touchpoints.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* FinanceGuard AI */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="p-6 relative">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-5">
              <CreditCard className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              FinanceGuard AI
            </h3>
            <p className="text-zinc-400 mb-6">
              Intelligent protection for financial transactions, detecting
              anomalies and preventing fraud before it occurs.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Fraud detection",
                "Transaction monitoring",
                "Risk assessment",
                "Regulatory compliance",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
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
                    className="text-emerald-400"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 group-hover:border-emerald-500/50"
            >
              Learn More
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
        </Card>

        {/* HealthSync AI */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="p-6 relative">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-5">
              <Activity className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              HealthSync AI
            </h3>
            <p className="text-zinc-400 mb-6">
              Secure healthcare data management with advanced encryption and
              privacy-preserving analysis capabilities.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "HIPAA compliance",
                "Medical data encryption",
                "Privacy-first analytics",
                "Secure patient portals",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
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
                    className="text-emerald-400"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 group-hover:border-emerald-500/50"
            >
              Learn More
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
        </Card>

        {/* SecureHome AI */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="p-6 relative">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-5">
              <Home className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              SecureHome AI
            </h3>
            <p className="text-zinc-400 mb-6">
              Automated home security system that learns patterns, recognizes
              danger, and protects your connected devices.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "IoT device protection",
                "Behavioral analysis",
                "Threat detection",
                "Privacy controls",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
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
                    className="text-emerald-400"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 group-hover:border-emerald-500/50"
            >
              Learn More
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
        </Card>
      </div>
    </section>
  );
}
