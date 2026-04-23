import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-X6C3F0TZ91";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://medistan.co.kr"),
  title: {
    default:
      "Medistan — Korean Dental Bone Grafts & Membranes | Wholesale to Clinics Worldwide",
    template: "%s | Medistan",
  },
  description:
    "Korean-manufactured dental bone graft materials and barrier membranes for oral surgeons, periodontists, and implantologists. K-FDA and CE cleared. Factory-direct wholesale shipping to 62 countries. Allografts, xenografts, collagen and pericardium membranes.",
  keywords: [
    "bone allograft",
    "bovine xenograft",
    "pericardium membrane",
    "collagen membrane",
    "dental regeneration",
    "GBR membrane",
    "GTR membrane",
    "socket preservation",
    "sinus lift material",
    "ridge augmentation",
    "dental bone graft wholesale",
    "Korean dental supplies",
    "oral surgery materials B2B",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medistan.co.kr",
    siteName: "Medistan",
    title:
      "Medistan — Korean Dental Bone Grafts & Membranes | Wholesale Worldwide",
    description:
      "K-FDA and CE cleared bone graft materials and barrier membranes. Factory-direct wholesale to oral surgeons and periodontists in 62 countries.",
    images: [{ url: "/og/home.svg", width: 1200, height: 630, alt: "Medistan — Dental Regenerative Materials" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medistan — Korean Dental Bone Grafts & Membranes",
    description:
      "Factory-direct wholesale of allografts, xenografts, collagen and pericardium membranes. K-FDA and CE cleared.",
    images: ["/og/home.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </html>
  );
}
