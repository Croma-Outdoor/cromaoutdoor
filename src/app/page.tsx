import HeroSection from "./(site)/sections/HeroSection";
import { ImpactShowcase } from "./(site)/sections/ImpactShowcase";
import { SocialProofSection } from "./(site)/sections/SocialProofSection";
import { MapPreview } from "./(site)/sections/MapPreview";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactShowcase />
      <SocialProofSection />
      <MapPreview />
    </>
  );
}
