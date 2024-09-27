import React from "react";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageFooter from "./LandingPageFooter";
  import HeroSection from "./landingpage_sections/HeroSection";
import FeatureGrid from "./FeatureGrid";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingPageHeader />
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Grid */}
        <FeatureGrid />
      </main>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
