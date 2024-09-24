import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.scss";
import SidebarDataProvider from "@/context/SidebarDataContext";
import AuthProvider from "@/context/AuthContext";
import OnboardProvider from "@/context/OnboardContext";
import GlobalOptionProvider from "@/context/GlobalOptionContext";
import ClientProviderWrapper from "./ClientProviderWrapper";
import RoleProvider from "@/context/RoleContext";

const inter = Inter({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  // display: "swap"
});

const nunito = Nunito({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });

export const metadata: Metadata = {
  title: "Kakrola | All Your Work in One Place",
  icons: {
    shortcut: "/kakrola.svg",
  },
  manifest: "/manifest.json",
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
                  <RoleProvider>{children}</RoleProvider>
                </GlobalOptionProvider>
              </OnboardProvider>
            </SidebarDataProvider>
          </AuthProvider>
        </ClientProviderWrapper>
      </body>
    </html>
  );
}
