import type { Metadata } from "next";
import { Montserrat, Inter, Lora, Instrument_Sans, Instrument_Serif, Geist } from "next/font/google";
import { VisitTracker } from "@/components/site/VisitTracker";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Pilgrim's Memoirs",
  description:
    "Christian books, articles, and monthly devotionals to nourish your faith and encourage your walk with God.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${lora.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${geist.variable}`}
    >
      <body className="font-sans antialiased">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
