import React from "react";
import {
  Shield,
  Lock,
  Database,
  History,
  Bell,
  CheckCircle2,
  Users,
  FileCheck,
} from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";

const SecurityPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <LandingPageHeader />
      <div className="wrapper py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary-50">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold">Security at Kakrola</h1>
          </div>

          <p className="text-xl text-gray-600 mb-12">
            We take the security of your data seriously. Learn about our
            comprehensive approach to protecting your information.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <Lock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Data Encryption</h3>
                  <p className="text-gray-600">
                    All data is encrypted at rest and in transit using
                    industry-standard encryption protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <Database className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Secure Infrastructure
                  </h3>
                  <p className="text-gray-600">
                    Hosted on enterprise-grade cloud infrastructure with
                    multiple layers of security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <History className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Regular Backups</h3>
                  <p className="text-gray-600">
                    Automated backups and disaster recovery procedures ensure
                    your data is safe.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <Bell className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Security Monitoring</h3>
                  <p className="text-gray-600">
                    24/7 monitoring for suspicious activities and potential
                    security threats.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <CheckCircle2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Compliance</h3>
                  <p className="text-gray-600">
                    Adherence to industry standards and regular security audits
                    to ensure best practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary-50">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Access Control</h3>
                  <p className="text-gray-600">
                    Granular permissions and role-based access control to
                    protect sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl mb-16">
            <h2 className="text-2xl font-semibold mb-6">
              Security Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white">
                  <FileCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">SOC 2 Type II</h3>
                  <p className="text-sm text-gray-600">
                    Independently verified security controls
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">ISO 27001</h3>
                  <p className="text-sm text-gray-600">
                    Information security management
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>Our Security Commitment</h2>
            <p>
              Security is at the core of everything we do at Kakrola. We employ
              industry-leading security measures and regularly update our
              systems to protect against emerging threats. Our dedicated
              security team works around the clock to ensure your data remains
              safe and confidential.
            </p>

            <h2>Report a Security Issue</h2>
            <p>
              If you believe you've found a security vulnerability in our
              service, please report it to{" "}
              <span className="text-primary-600">security@kakrola.com</span>. We
              take all security reports seriously and will respond promptly to
              your concerns.
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

export default SecurityPage;
