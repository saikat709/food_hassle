import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AOSInit } from "@/components/AOSInit";

import { BackgroundBlobs } from "@/components/ui/BackgroundBlobs";

export const metadata: Metadata = {
  title: "Urban Harvest",
  description: "Sustainable Food Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-off-white text-charcoal-blue antialiased min-h-screen overflow-x-hidden relative">
        <AOSInit />
        <BackgroundBlobs />
        <Navbar />
        <main className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
