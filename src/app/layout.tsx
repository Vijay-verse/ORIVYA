import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TravelStoreProvider } from "@/lib/store";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ORIVYA — Plan. Book. Travel. | Multi-Modal Travel Platform",
  description: "One trip. Every booking. One place. Unified booking and trip management for Bus, Train, Hotel, and Cab journeys.",
  keywords: ["travel", "bus booking", "train reservation", "hotels", "cabs", "trip planner", "ORIVYA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD] text-slate-900 selection:bg-indigo-500 selection:text-white">
        <TravelStoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </TravelStoreProvider>
      </body>
    </html>
  );
}
