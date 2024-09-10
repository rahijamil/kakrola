import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import TaskProjectDataProvider from "@/context/TaskProjectDataContext";
import AuthProvider from "@/context/AuthContext";
import OnboardProvider from "@/context/OnboardContext";
import GlobalOptionProvider from "@/context/GlobalOptionContext";
import ClientProviderWrapper from "./ClientProviderWrapper";
import RoleProvider from "@/context/RoleContext";

const inter = Inter({ subsets: ["latin"], fallback: ["Helvetica", "Arial"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
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
            <TaskProjectDataProvider>
              <OnboardProvider>
                <GlobalOptionProvider>
                  <RoleProvider>{children}</RoleProvider>
                </GlobalOptionProvider>
              </OnboardProvider>
            </TaskProjectDataProvider>
          </AuthProvider>
        </ClientProviderWrapper>
      </body>
    </html>
  );
}
