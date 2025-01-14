import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.scss";
import SidebarDataProvider from "@/context/SidebarDataContext";
import AuthProvider from "@/context/AuthContext";
import OnboardProvider from "@/context/OnboardContext";
import GlobalOptionProvider from "@/context/GlobalOptionContext";
import ClientProviderWrapper from "./ClientProviderWrapper";
import RoleProvider from "@/context/RoleContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import OneTapComponent from "@/components/OneTapComponent";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  display: "swap",
});

// const nunito = Nunito({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });

export const metadata: Metadata = {
  title: "Kakrola: One space for your team to thrive",
  // description:
  //   "Say goodbye to scattered tools and endless app switching. Kakrola brings your team's tasks, docs, and conversations into one clean, fast workspace. Perfect for busy teams who need to stay organized without the hassle. Try it free—no credit card needed.",
  description:
    "Finally, a workspace that feels natural. Kakrola combines your team's tasks, docs, and chats in one lightning-fast home - no more tab jungle. Built for teams who believe great work should feel effortless.",
  keywords: [
    "team organization",
    "work management",
    "team chat",
    "shared documents",
    "task tracking",
    "team workspace",
    "project planning",
    "remote teams",
    "team alignment",
    "work tracking",
    "team efficiency",
    "simple project management",
    "team communication",
    "document sharing",
    "organized teamwork",
  ],
  authors: [{ name: "Kakrola", url: "https://www.kakrola.com" }],
  creator: "Kakrola",
  publisher: "Kakrola",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.kakrola.com",
    siteName: "Kakrola",
    title: "The Complete Workspace for Teams | Kakrola",
    description:
      "Tired of your team's work being scattered across different apps? Kakrola keeps everything in one place: tasks, docs, and team chat. It's simple, fast, and actually helps you get things done. Start free and see the difference.",
    images: [
      {
        url: "/images/og-image-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "See how Kakrola helps teams stay organized with everything in one place",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    creator: "@kakrola",
    title: "The Complete Workspace for Teams | Kakrola",
    description:
      "No more juggling multiple apps or losing track of important work. Get your team on the same page with one simple, fast workspace. Try it free.",
    images: ["/images/twitter-card-800x418.jpg"],
  },
  alternates: {
    canonical: "https://www.kakrola.com",
    languages: {
      "en-US": "https://www.kakrola.com",
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Team Software",
  metadataBase: new URL("https://www.kakrola.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics />

      <body className={poppins.className}>
        <ClientProviderWrapper>
          <AuthProvider>
            <SidebarDataProvider>
              <OnboardProvider>
                <GlobalOptionProvider>
                  <RoleProvider>
                    {/* <OneTapComponent /> */}
                    {children}
                    <SpeedInsights />
                  </RoleProvider>
                </GlobalOptionProvider>
              </OnboardProvider>
            </SidebarDataProvider>
          </AuthProvider>
        </ClientProviderWrapper>

        <Toaster />
      </body>
    </html>
  );
}
