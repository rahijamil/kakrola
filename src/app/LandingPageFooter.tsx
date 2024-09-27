import React from "react";
import KakrolaLogo from "./kakrolaLogo";
import BottomNav from "./BottomNav";
import { Accordion } from "@/components/Accordion";

const faqItems = [
  {
    title: "Can I change my plan later?",
    content:
      "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, ensuring you always have the flexibility to adjust as your needs change.",
  },
  {
    title: "What payment methods do you accept?",
    content:
      "We accept all major credit cards and PayPal. This allows you to choose the payment method that's most convenient for you or your business.",
  },
  {
    title: "Is there a free trial?",
    content:
      "Yes, we offer a 14-day free trial for our Pro and Business plans. You can experience the full power of Kakrola risk-free, with no credit card required to start your trial.",
  },
  {
    title: "What happens when I hit my storage limit?",
    content:
      "You'll receive a notification as you approach your storage limit. At this point, you can easily upgrade your plan for more storage or manage your existing files to free up space. We provide tools to help you identify large or unused files, making storage management simple.",
  },
  {
    title: "Who's behind Kakrola?",
    content:
      "Kakrola is developed and maintained by a passionate solo developer committed to creating the best productivity tool possible. This means you get a streamlined product with fast, personal support. Every feature is carefully crafted with the user in mind, ensuring a focused and efficient experience.",
  },
  {
    title: "How secure is my data?",
    content:
      "Your data's security is our top priority. We use industry-standard encryption for data in transit and at rest. Regular security audits are conducted to ensure your information remains protected. With Kakrola, you can focus on your work knowing your data is safe.",
  },
];

const LandingPageFooter = () => {
  return (
    <>
      <div>
        {/* FAQ Section */}
        <section className="wrapper pt-20 pb-40 md:pb-20 bg-surface border-t border-text-100">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Questions & answers
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqItems} />
          </div>
        </section>

        {/* Horizontal Rule */}
        <hr className="border-t border-text-200 wrapper" />
      </div>
      <footer className="bg-surface hidden md:block">
        <div className="wrapper py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <KakrolaLogo size="lg" isTitle />
              <p className="text-text-700">
                Making the world more productive, one task at a time.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-text-700 hover:text-primary-600 transition-colors"
                    aria-label={social}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {/* Add appropriate SVG path for each social icon */}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Integrations", "FAQ", "Security"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-text-700 hover:text-primary-600 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact", "Partners"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-text-700 hover:text-primary-600 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "GDPR",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-text-700 hover:text-primary-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-text-200 pt-8">
            <p className="text-text-700 text-center">
              &copy; {new Date().getFullYear()} Kakrola, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      <BottomNav />
    </>
  );
};

export default LandingPageFooter;
