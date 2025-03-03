import About from "@/components/about";
import ChatAssistant from "@/components/chat-assistant";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Light from "@/components/light";
import Navigation from "@/components/navigation";
import Products from "@/components/products";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <div className="max-w-screen">
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
        <Light />
        <Navigation />
        <Hero />
      </div>
      <About />
      <Products />
      <Testimonials />
      <Footer />
      <ChatAssistant />
    </div>
  );
}
