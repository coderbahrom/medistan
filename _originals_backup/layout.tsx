import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

// Clean geometric sans for body (optimized for small-size legibility)
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces: a variable serif with character — perfect for a medical brand that
// wants to feel premium without being clinical-cold. Italics add warmth to headlines.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "SEOHA Dental — Premium Korean Dental Implants · B2B Wholesale",
  description:
    "K-FDA, CE and US-FDA certified dental implants from Seoul, shipped direct to dentists in 62 countries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
