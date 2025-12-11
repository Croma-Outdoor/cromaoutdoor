import { AboutSection } from "./(site)/components/AboutSection";
import { CallToAction } from "./(site)/components/CallToAction";
import HeroSection from "./(site)/components/HeroSection";
import { MapPreview } from "./(site)/components/MapPreview";
import { MediaShowcase } from "./(site)/components/MediaShowcase";

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
