import Header from './homepage/Header';
import HeroSection from './homepage/HeroSection';
import HowItWorks from './homepage/HowItWorks';
import FeaturesSection from './homepage/FeaturesSection';
import TemplatesSection from './homepage/TemplatesSection';
import InsightsSection from './homepage/InsightsSection';
import CTASection from './homepage/CTASection';
import Footer from './homepage/Footer';
import { SectionScrollHandler } from './homepage/SectionLink';

export default function HomePage() {
  return (
    <main className="home-sans min-h-screen bg-[#f5f4ed] text-[#151b26] overflow-x-clip">
      <SectionScrollHandler />
      <Header />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <TemplatesSection />
      <InsightsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
