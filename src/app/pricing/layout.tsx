import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kakrola Pricing Plans: Free, Plus, and Business",
  description:
    "Explore Kakrola's flexible pricing plans. Find the perfect plan for your team to manage projects, docs, tasks, and team communication all in one place.",
  keywords:
    "Kakrola pricing, project management, team communication, team plans, collaboration, Free plan, Plus plan, Business plan, SaaS pricing, productivity tools",
  robots: "index, follow",
  openGraph: {
    title:
      "Pricing - Kakrola: Free, Plus, and Business Plans for Project Management",
    description:
      "Explore Kakrola's flexible pricing plans for individuals, teams, and businesses. Start managing projects, docs, and team communication today.",
    url: "https://www.kakrola.com/pricing",
    type: "website",
    images: ["/path/to/your/og-image.jpg"],
    locale: "en_US",
    siteName: "Kakrola",
    // videos: "https://www.kakrola.com/video-overview.mp4", // Optional video URL
    // audio: "https://www.kakrola.com/audio-preview.mp3", // Optional audio preview
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    title:
      "Pricing - Kakrola: Free, Plus, and Business Plans for Project Management",
    description:
      "Explore Kakrola's flexible pricing plans for individuals, teams, and businesses.",
    images: ["/path/to/your/twitter-image.jpg"],
    creator: "@kakrola", // Twitter handle for the creator
  },
  icons: {
    shortcut: "/kakrola.svg",
    apple: "/kakrola-apple-touch-icon.png", // Optional Apple touch icon
  },
  manifest: "/manifest.json",
//   structuredData: {
//     "@context": "https://schema.org",
//     "@type": "WebPage",
//     name: "Kakrola Pricing Plans",
//     url: "https://www.kakrola.com/pricing",
//     description:
//       "Explore Kakrola's flexible pricing plans designed for project management, team communication, and collaboration.",
//     mainEntity: {
//       "@type": "PricingPlan",
//       name: "Kakrola Pricing Plans",
//       offers: [
//         {
//           "@type": "Offer",
//           priceCurrency: "USD",
//           price: "0.00",
//           url: "https://www.kakrola.com/pricing/free",
//           name: "Free Plan",
//           priceValidUntil: "2024-12-31",
//           eligibleRegion: {
//             "@type": "Place",
//             name: "Global",
//           },
//         },
//         {
//           "@type": "Offer",
//           priceCurrency: "USD",
//           price: "9.99",
//           url: "https://www.kakrola.com/pricing/pro",
//           name: "Plus Plan",
//           priceValidUntil: "2024-12-31",
//           eligibleRegion: {
//             "@type": "Place",
//             name: "Global",
//           },
//         },
//         {
//           "@type": "Offer",
//           priceCurrency: "USD",
//           price: "19.99",
//           url: "https://www.kakrola.com/pricing/business",
//           name: "Business Plan",
//           priceValidUntil: "2024-12-31",
//           eligibleRegion: {
//             "@type": "Place",
//             name: "Global",
//           },
//         },
//       ],
//     },
//   },
};

const PricingLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default PricingLayout;
