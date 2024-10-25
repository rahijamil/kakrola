import React from "react";
import { Shield } from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";

const PrivacyPage = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50 to-white min-h-screen">
      <LandingPageHeader />
      <div className="wrapper py-32 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary-50">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500">Last updated: October 23, 2024</p>

          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Profile information</li>
            <li>Content you create and share</li>
            <li>Payment information</li>
            <li>Communications with us</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and updates</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns and improve our services</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your data. Your data is stored in secure cloud
            infrastructure with encryption at rest and in transit.
          </p>

          <h2>Data Sharing and Third Parties</h2>
          <p>
            We do not sell your personal information. We may share your
            information with third-party service providers who assist us in
            operating our services, conducting our business, or serving our
            users.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You can also export your data or request account
            deletion.
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

export default PrivacyPage;
