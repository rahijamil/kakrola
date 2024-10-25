import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Simple Team Plans | Plus & Business | Kakrola",
  description:
    "Choose the perfect plan for your team - Plus or Business. Try any plan free for 14 days. Get everything your team needs in one powerful workspace.",
  keywords: [
    "team workspace plans",
    "business collaboration tools",
    "document sharing platform",
    "team chat software",
    "project management tools",
    "remote team platform",
    "task management system",
    "team communication hub",
    "workspace solution",
    "professional collaboration",
    "enterprise workspace",
    "team organization tools",
    "business planning software",
    "productivity platform",
    "secure team workspace",
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
    title: "Professional Team Plans | 7-Day Trial | Kakrola",
    description:
      "Choose between Plus and Business plans. Each plan includes a 7-day trial to explore our complete workspace solution. Perfect for teams who mean business.",
    url: "https://www.kakrola.com/pricing",
    type: "website",
    images: [
      {
        url: "/pricing-overview.jpg",
        width: 1200,
        height: 630,
        alt: "Professional team workspace plans with 7-day trial",
      },
    ],
    locale: "en_US",
    siteName: "Kakrola",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    title: "Professional Team Workspace Plans | Kakrola",
    description:
      "Two powerful plans for serious teams. Try Plus or Business free for 14 days. All the tools you need to work better together.",
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
    "og:price:amount": ["120", "180"],
    "og:price:currency": "USD",
    "og:availability": "in stock",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Team Workspace",
};

const PricingLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default PricingLayout;
