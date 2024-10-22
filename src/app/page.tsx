import React from "react";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
import HeroSection from "./landingpage_sections/HeroSection";
import { FeatureGrid } from "./FeatureGrid";
import ProjectSection from "./landingpage_sections/ProjectSection";
import CtaSection from "./CtaSection";
import BuiltInPublicSection from "./landingpage_sections/BuiltInPublicSection";

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

        {/* Built in Public section - Shows transparency and progress */}
        <BuiltInPublicSection />

        {/* CTA Section */}
        <CtaSection />
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
