import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import TaskProjectDataProvider from "@/context/TaskProjectDataContext";
import AuthProvider from "@/context/AuthContext";
import OnboardProvider from "@/context/OnboardContext";
import GlobalOptionProvider from "@/context/GlobalOptionContext";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const nunito = Nunito({ subsets: ["latin"] });

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
        <AuthProvider>
          <TaskProjectDataProvider>
            <OnboardProvider>
              <GlobalOptionProvider>{children}</GlobalOptionProvider>
            </OnboardProvider>
          </TaskProjectDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
