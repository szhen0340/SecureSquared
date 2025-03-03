import { Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function Testimonials() {
  return (
    <section className="relative z-10 px-12 py-36 pb-48 bg-zinc-950">
      <div className="text-center mb-16">
        <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
          What Our Clients Say
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Trusted by <span className="text-emerald-400">Industry Leaders</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          See how our AI security solutions are transforming organizations
          across different sectors.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Financial Sector Testimonial */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex flex-col h-full">
              <Quote className="size-8 text-emerald-400 mb-4" />
              <p className="text-zinc-300 italic mb-6 flex-grow">
                "FinanceGuard AI has revolutionized our fraud detection
                capabilities. We've seen a 78% reduction in false positives
                while catching sophisticated attacks that would have previously
                gone unnoticed. The system adapts to new threats faster than
                anything we've implemented before, allowing our team to focus on
                more strategic initiatives rather than chasing down false
                alarms."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-zinc-800 mr-3 flex items-center justify-center">
                  <span className="text-emerald-400 font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium">Jane Doe</h4>
                  <p className="text-zinc-500 text-sm">CFO, Global Finance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Healthcare Testimonial */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex flex-col h-full">
              <Quote className="size-8 text-emerald-400 mb-4" />
              <p className="text-zinc-300 italic mb-6 flex-grow">
                "HealthSync AI has transformed how we protect sensitive patient
                data. The privacy-preserving analytics allow us to gain valuable
                insights while maintaining HIPAA compliance. Implementation was
                seamless, and the system's ability to detect unusual access
                patterns has already prevented several potential data breaches."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-zinc-800 mr-3 flex items-center justify-center">
                  <span className="text-emerald-400 font-semibold">DR</span>
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium">Dr. John Doe</h4>
                  <p className="text-zinc-500 text-sm">CTO, Medicine Tech</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Home Testimonial */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative">
            <div className="flex flex-col h-full">
              <Quote className="size-8 text-emerald-400 mb-4" />
              <p className="text-zinc-300 italic mb-6 flex-grow">
                "SecureHome AI gives our customers peace of mind. The behavioral
                analysis capabilities detect unusual patterns that traditional
                security systems miss. We've integrated it across our entire
                product line, and customer satisfaction scores have increased by
                42%. It's become a key differentiator in the competitive smart
                home market."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-zinc-800 mr-3 flex items-center justify-center">
                  <span className="text-emerald-400 font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="text-zinc-200 font-medium">John Smith</h4>
                  <p className="text-zinc-500 text-sm">
                    Product Director, Secure Systems
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
