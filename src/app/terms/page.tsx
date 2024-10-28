import React from "react";
import { ScrollText } from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";
import { notFound } from "next/navigation";

const TermsPage = () => {
  return notFound();
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50 to-white min-h-screen">
      <LandingPageHeader />
      <div className="wrapper py-32 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary-50">
            <ScrollText className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500">Last updated: October 23, 2024</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using Kakrola's services, you agree to be bound by
            these Terms of Service. If you disagree with any part of the terms,
            you may not access our services.
          </p>

          <h2>2. Subscription and Payments</h2>
          <p>
            Kakrola offers various subscription plans. Payment is required in
            advance and is non-refundable except as required by law. All
            features and storage limits are determined by your subscription
            tier.
          </p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect the intellectual property rights of others</li>
            <li>Use the service only for its intended purpose</li>
          </ul>

          <h2>4. Data Usage and Privacy</h2>
          <p>
            Your use of Kakrola is also governed by our Privacy Policy. We
            collect and process data as described in that policy to provide and
            improve our services.
          </p>

          <h2>5. Service Availability and Updates</h2>
          <p>
            While we strive for 99.9% uptime, we do not guarantee uninterrupted
            access to our services. We may update or modify our services at any
            time.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account immediately for violations
            of these terms or for any other reason at our sole discretion.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Kakrola shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use or
            inability to use the service.
          </p>
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

export default TermsPage;
