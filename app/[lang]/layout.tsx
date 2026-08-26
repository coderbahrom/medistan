import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { notFound } from "next/navigation";
import {
  SITE_URL,
  OG_LOCALE,
  alternatesFor,
  localeUrl,
  ogAlternateLocales,
} from "@/lib/seo";

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
  const dict = await getDictionary(locale);
  const t = dict.seo;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.homeTitle,
      template: "%s | Medistan",
    },
    description: t.homeDescription,
    alternates: alternatesFor(locale),
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
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
      url: localeUrl(locale),
      siteName: "Medistan",
      title: t.homeTitle,
      description: t.homeDescription,
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
      title: t.homeTitle,
      description: t.homeDescription,
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

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${sans.variable} ${serif.variable}`}
    >
      <body className="font-sans">
        {/* Each page receives `lang` via params and loads its own dictionary. */}
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
