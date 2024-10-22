import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.scss";
import SidebarDataProvider from "@/context/SidebarDataContext";
import AuthProvider from "@/context/AuthContext";
import OnboardProvider from "@/context/OnboardContext";
import GlobalOptionProvider from "@/context/GlobalOptionContext";
import ClientProviderWrapper from "./ClientProviderWrapper";
import RoleProvider from "@/context/RoleContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  // display: "swap",
});

const nunito = Nunito({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });

export const metadata: Metadata = {
  title: "Kakrola: The Complete Workspace for Teams",
  description:
    "Kakrola is the all-in-one platform for managing projects, tasks, documents, team communication through DMs and channels, and much more.",
  keywords:
    "Kakrola, project management, team communication, DMs, team channels, tasks, docs, all-in-one platform, collaboration, workspace",
  robots: "index, follow",
  icons: {
    shortcut: "/kakrola.svg",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    site: "@kakrola",
    title: "Kakrola: Manage Projects, Docs, DMs, and Team Channels",
    description:
      "All your work in one place, from project management to team communication.",
    images: "/path/to/your/twitter-image.jpg",
  },
  openGraph: {
    title: "Kakrola: Manage Projects, Docs, DMs, and Team Channels",
    description:
      "All your work in one place with Kakrola. Manage tasks, projects, and team communication seamlessly.",
    url: "https://www.kakrola.com",
    type: "website",
    images: "/path/to/your/og-image.jpg",
    locale: "en_US",
    siteName: "Kakrola",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientProviderWrapper>
          <AuthProvider>
            <SidebarDataProvider>
              <OnboardProvider>
                <GlobalOptionProvider>
                  <RoleProvider>
                    {children}
                    <SpeedInsights />
                  </RoleProvider>
                </GlobalOptionProvider>
              </OnboardProvider>
            </SidebarDataProvider>
          </AuthProvider>
        </ClientProviderWrapper>
      </body>
    </html>
  );
}
