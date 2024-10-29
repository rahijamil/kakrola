import React from "react";
import { RefreshCw } from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";

const RefundPage = () => {
  return (
    <>
      <LandingPageHeader />
      <div className="wrapper py-32 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary-50">
            <RefreshCw className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold">Refund Policy</h1>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500">Last updated: October 23, 2024</p>

          <h2>Subscription Refunds</h2>
          <p>
            We want you to be satisfied with your subscription to Kakrola. If
            you're not completely happy with your purchase, we're here to help.
          </p>

          <h2>7-Day Trial Period</h2>
          <p>
            All new subscriptions start with a 7-day trial period. During this
            time, you can explore Kakrola's features without being charged. You
            can cancel at any time during the trial and won't be billed.
          </p>

          <h2>Paid Subscriptions</h2>
          <p>For paid subscriptions, we handle refund requests as follows:</p>
          <ul>
            <li>
              Within 14 days of your first payment: Full refund available upon
              request
            </li>
            <li>
              Technical issues: If you experience technical problems that
              significantly impact your use of Kakrola and our team cannot
              resolve them, you may be eligible for a partial refund
            </li>
            <li>
              Accidental renewals: If your subscription renewed automatically
              and you contact us within 7 days of the renewal, we'll consider
              your refund request
            </li>
          </ul>

          <h2>How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol>
            {/* <li>Contact our support team at support@kakrola.com</li> */}
            <li>Contact our support team at cs.mohammadrahi@gmail.com</li>
            <li>
              Include your account email and the reason for your refund request
            </li>
            <li>
              Our team will review your request and respond within 2 business
              days
            </li>
          </ol>

          <h2>Non-Refundable Cases</h2>
          <p>Refunds are not available for:</p>
          <ul>
            <li>Partial months of service</li>
            <li>Requests made after 14 days of initial purchase</li>
            <li>
              Account termination due to violations of our Terms of Service
            </li>
            <li>Usage of premium features during the paid period</li>
          </ul>

          <h2>Processing Time</h2>
          <p>
            Once approved, refunds typically process within 5-10 business days,
            depending on your payment method and financial institution.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this refund policy as needed. Significant changes will
            be communicated via email to our active subscribers.
          </p>
        </div>
      </div>
      <LandingPageFooter />
    </>
  );
};

export default RefundPage;
