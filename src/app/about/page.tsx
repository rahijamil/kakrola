import React from "react";
import { Users, Building2, Rocket } from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";

const AboutPage = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50 to-white min-h-screen">
      <LandingPageHeader />
      <div className="wrapper py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Kakrola</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-xl text-gray-600 mb-12">
              We're building the complete workspace that helps teams
              collaborate, communicate, and deliver results.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="p-6 bg-primary-50 rounded-xl">
                <Users className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-xl mb-2">Built for Teams</h3>
                <p className="text-gray-600">
                  Created with modern teams in mind, focusing on simplicity and
                  productivity.
                </p>
              </div>

              <div className="p-6 bg-primary-50 rounded-xl">
                <Building2 className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-xl mb-2">
                  Independent Company
                </h3>
                <p className="text-gray-600">
                  Self-funded and focused on sustainable growth to serve our
                  customers long-term.
                </p>
              </div>

              <div className="p-6 bg-primary-50 rounded-xl">
                <Rocket className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-xl mb-2">Rapid Innovation</h3>
                <p className="text-gray-600">
                  Continuously improving with weekly updates and new features.
                </p>
              </div>
            </div>

            <h2>Our Story</h2>
            <p>
              Founded in 2024, Kakrola emerged from our own frustrations with
              existing workplace tools. We saw teams struggling with
              disconnected tools and scattered information, leading to decreased
              productivity and increased frustration.
            </p>

            <h2>Our Mission</h2>
            <p>
              We're on a mission to help teams work better together by providing
              a unified platform that combines project management, document
              collaboration, and team communication in one seamless experience.
            </p>

            <h2>Open Development</h2>
            <p>
              We believe in building in public and maintaining strong
              connections with our user community. Our public roadmap and
              regular development updates ensure transparency and allow users to
              influence our product direction.
            </p>
          </div>
        </div>
      </div>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
        <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
      </div>
      <LandingPageFooter />
    </div>
  );
};

export default AboutPage;
