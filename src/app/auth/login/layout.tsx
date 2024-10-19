import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Log in to Your Workspace | Kakrola",
  description:
    "Welcome back! Log in to your Kakrola workspace to manage projects, collaborate on docs, and chat with your team. Quick social login available.",
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
  openGraph: {
    title: "Log in to Kakrola",
    description:
      "Access your team's workspace. Quick login with Google, GitHub, Slack, Notion.",
    type: "website",
    locale: "en_US",
    url: "https://www.kakrola.com/login",
    siteName: "Kakrola",
    images: [
      {
        url: "/login-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Log in to your Kakrola workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    creator: "@kakrola",
    title: "Welcome Back to Kakrola",
    description:
      "Log in and get back to what matters - moving your team's work forward.",
    images: ["/login-twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://www.kakrola.com/login",
  },
};

const LoginPageLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default LoginPageLayout;
