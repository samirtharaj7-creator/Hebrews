import { HeroSection } from "@/components/hero-section";
import { preload } from "react-dom";

export default function HomePage() {
  preload("/assets/hebrews-hero-engraving.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high"
  });

  return (
    <main>
      <HeroSection />
    </main>
  );
}
