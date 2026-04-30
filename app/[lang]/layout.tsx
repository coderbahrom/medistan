import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { getDictionary, hasLocale, locales, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";

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

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "en";

  const ogLocaleMap: Record<Locale, string> = {
    en: "en_US",
    ar: "ar_SA",
    fr: "fr_FR",
    de: "de_DE",
    ru: "ru_RU",
  };

  return {
    metadataBase: new URL("https://medistan.co.kr"),
    title: {
      default:
        "Medistan — Korean Dental Bone Grafts & Membranes | Wholesale to Clinics Worldwide",
      template: "%s | Medistan",
    },
    description:
      "Korean-manufactured dental bone graft materials and barrier membranes for oral surgeons, periodontists, and implantologists. K-FDA and CE cleared. Factory-direct wholesale shipping to 62 countries.",
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
      locale: ogLocaleMap[locale as Locale] ?? "en_US",
      url: "https://medistan.co.kr",
      siteName: "Medistan",
      title:
        "Medistan — Korean Dental Bone Grafts & Membranes | Wholesale Worldwide",
      description:
        "K-FDA and CE cleared bone graft materials and barrier membranes. Factory-direct wholesale to oral surgeons and periodontists in 62 countries.",
      images: [
        {
          url: "/og/home.svg",
          width: 1200,
          height: 630,
          alt: "Medistan — Dental Regenerative Materials",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Medistan — Korean Dental Bone Grafts & Membranes",
      description:
        "Factory-direct wholesale of allografts, xenografts, collagen and pericardium membranes. K-FDA and CE cleared.",
      images: ["/og/home.svg"],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${sans.variable} ${serif.variable}`}
    >
      <body className="font-sans">
        {/* Pass dict to children via a data attribute is not ideal —
            instead each page receives lang via params and loads dict itself */}
        {children}
      </body>
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
