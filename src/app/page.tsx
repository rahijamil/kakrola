import React from "react";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import HeroSection from "./landingpage_sections/HeroSection";
import { FeatureGrid, CtaSection } from "./FeatureGrid";
import ProjectSection from "./landingpage_sections/ProjectSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingPageHeader />
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Detailed Product Sections */}
        <ProjectSection />

        {/* Feature Grid */}
        <FeatureGrid />
        {/* CTA Section */}
        <CtaSection />
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
