import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create Your Free Team Workspace | Kakrola",
  description:
    "Get started with Kakrola in minutes. Free plan available, no credit card required. Quick signup with Google, GitHub, Slack, Notion to keep your team organized.",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  keywords: [
    "team workspace",
    "free team software",
    "organize team work",
    "team management",
    "work organization",
    "project planning",
    "team chat",
    "document sharing",
    "task management",
    "remote teams",
  ].join(", "),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.kakrola.com/signup",
    siteName: "Kakrola",
    title: "Try Kakrola Free - Your Team's New Home for Work",
    description:
      "Join Kakrola and give your team a better way to work together. Free plan available, no credit card required. Set up in minutes and see the difference.",
    images: [
      {
        url: "/signup-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Start organizing your team's work with Kakrola",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    creator: "@kakrola",
    title: "Join Kakrola Free - Get Your Team Organized",
    description:
      "Start fresh with a better way to organize your team's work. Free forever plan, no credit card needed.",
    images: ["/signup-twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://www.kakrola.com/signup",
  },
};

const SignUpPageLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SignUpPageLayout;
