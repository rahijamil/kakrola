import type { Metadata } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import TaskProjectDataProvider from "@/context/TaskProjectDataContext";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "TaskMaster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskProjectDataProvider>{children}</TaskProjectDataProvider>
      </body>
    </html>
  );
}
