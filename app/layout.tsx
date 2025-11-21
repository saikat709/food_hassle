'use client'

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AOSInit } from "@/components/AOSInit";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { BackgroundBlobs } from "@/components/ui/BackgroundBlobs";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-off-white text-charcoal-blue antialiased min-h-screen overflow-x-hidden relative">
          <AOSInit />
          <BackgroundBlobs />
          <Navbar />
          <main className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
            {children}
          </main>
          <ChatbotWrapper />
        </body>
      </html>
    </SessionProvider>
  );
}
