import { AboutSection } from "./(site)/sections/AboutSection";
import { CallToAction } from "./(site)/sections/CallToAction";
import HeroSection from "./(site)/sections/HeroSection";
import { MapPreview } from "./(site)/sections/MapPreview";
import { MediaShowcase } from "./(site)/sections/MediaShowcase";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MediaShowcase />
      <MapPreview />
      <CallToAction />
    </>
  );
}
