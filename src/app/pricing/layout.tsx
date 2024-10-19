import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Simple, Transparent Pricing | Start Free, Scale When Ready | Kakrola",
  description:
    "Start with Kakrola's free plan - no credit card needed. Our straightforward pricing grows with your team. Get all the tools you need - tasks, docs, and team chat - without the enterprise price tag.",
  keywords: [
    "team software pricing",
    "free project management",
    "affordable team tools",
    "business collaboration cost",
    "team chat pricing",
    "document sharing plans",
    "task management cost",
    "startup team software",
    "small business tools",
    "flexible team pricing",
    "collaborative workspace cost",
    "monthly team plans",
    "annual team discount",
    "free team tools",
    "business software pricing",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Pricing That Makes Sense | Free & Flexible Team Plans | Kakrola",
    description:
      "Why pay for features you won't use? Kakrola's pricing is simple: start free, then pay only when you need more. Perfect for growing teams who need the right tools without breaking the bank.",
    url: "https://www.kakrola.com/pricing",
    type: "website",
    images: [
      {
        url: "/pricing-overview.jpg",
        width: 1200,
        height: 630,
        alt: "Simple, transparent pricing plans for teams of all sizes",
      },
    ],
    locale: "en_US",
    siteName: "Kakrola",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    title: "Team Software That Fits Your Budget | Kakrola Pricing",
    description:
      "Start free, no surprises. Get all your team tools in one place - tasks, docs, chat - at a price that works for you. Scale up only when you need to.",
    images: ["/pricing-twitter.jpg"],
    creator: "@kakrola",
  },
  alternates: {
    canonical: "https://www.kakrola.com/pricing",
  },
  authors: [{ name: "Kakrola", url: "https://www.kakrola.com" }],
  creator: "Kakrola",
  publisher: "Kakrola",
  icons: {
    icon: "/kakrola.svg",
    shortcut: "/kakrola.svg",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/manifest.json",
  other: {
    "og:price:amount": ["0", "10", "18"],
    "og:price:currency": "USD",
    "og:availability": "in stock",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Team Software",
};

const PricingLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default PricingLayout;
