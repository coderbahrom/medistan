import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  Headphones,
  BadgeDollarSign,
  MessageCircle,
  Quote,
  Check,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { waMsg } from "@/lib/whatsapp";
import { products, isBoneGraftSpecs, isMembraneSpecs } from "@/data/products";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";
import type { Dictionary } from "./dictionaries";

const featuredSlugs = ["renew-oss", "titan-x", "diaderm-m", "titan-gide"];
const featuredProducts = featuredSlugs
  .map((s) => products.find((p) => p.slug === s))
  .filter((p): p is NonNullable<typeof p> => p !== undefined);

function getSpecLine(p: (typeof products)[0]): string {
  if (isBoneGraftSpecs(p.specs)) {
    if (p.specs.remodelingTime)
      return `${p.specs.remodelingTime} remodeling · ${p.composition}`;
    if (p.specs.resorption) return `${p.specs.resorption} · ${p.composition}`;
    return p.composition;
  }
  if (isMembraneSpecs(p.specs)) {
    return `${p.specs.resorptionTime} resorption · ${p.specs.material.split(" ").slice(-1)[0]}`;
  }
  return p.composition;
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Medistan",
  url: "https://medistan.co.kr",
  logo: "https://medistan.co.kr/favicon.svg",
  description:
    "Korean manufacturer of dental regenerative materials — bone graft allografts, bovine xenografts, collagen membranes, and pericardium membranes for oral surgeons and periodontists worldwide.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seoul",
    addressCountry: "KR",
  },
  foundingDate: "2016",
  numberOfEmployees: { "@type": "QuantitativeValue", value: "200" },
  sameAs: ["https://medistan.co.kr"],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar lang={lang} t={dict.nav} />
      <Hero lang={lang} t={dict} />
      <StatsStrip t={dict} />
      <TrustFeatures lang={lang} t={dict} />
      <FeaturedProducts lang={lang} t={dict} />
      <Testimonials t={dict} />
      <About lang={lang} t={dict} />
      <FinalCta lang={lang} t={dict} />
      <Footer lang={lang} t={dict} />
      <WhatsAppFloat t={dict.common} />
    </main>
  );
}

function Hero({ lang, t }: { lang: string; t: Dictionary }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(226 232 240 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240 / 0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-32">
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t.home.badge}
          </div>

          <h1 className="font-serif text-[2.5rem] font-normal leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]">
            {t.home.heroTitle1}
            <br />
            {t.home.heroTitle2}
            <br />
            <span className="italic text-slate-500">{t.home.heroTitle3}</span>
          </h1>

          <p className="mt-5 max-w-lg font-serif text-xl font-normal italic leading-snug tracking-tight text-slate-500 sm:text-2xl">
            {t.home.heroSubtitle}
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.home.heroDescription}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/${lang}/products`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-slate-900 px-7 text-[15px] text-white shadow-sm hover:bg-slate-800"
              )}
            >
              {t.common.exploreCatalog}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={waMsg.homepageQuote}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-slate-300 bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-50"
              )}
            >
              {t.common.requestAQuote}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.16em] text-slate-500">
            <span>{t.home.trustedBy}</span>
            <span className="font-medium text-slate-700">Smile Clinic Group</span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">Dental Pro Chile</span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">ImplantWerk DE</span>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <RegenerativeVisual t={t.common} />
        </div>
      </div>
    </section>
  );
}

function RegenerativeVisual({ t }: { t: Dictionary["common"] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-50 via-slate-50 to-white" />
      <div className="absolute inset-8 rounded-full border border-slate-200/80" />
      <div className="absolute inset-16 rounded-full border border-slate-200/60" />

      <div className="absolute left-4 top-1/3 -translate-y-1/2 space-y-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
        <div>Type I Atelocollagen</div>
        <div className="h-px w-8 bg-slate-300" />
        <div>4-mo resorption</div>
        <div className="h-px w-8 bg-slate-300" />
        <div>20×30 mm</div>
      </div>

      <div className="absolute right-4 top-12 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
        <div>0.25–1.0 mm</div>
        <div className="ml-auto mt-1 h-px w-8 bg-slate-300" />
        <div className="mt-1">80/20 C/C</div>
        <div className="ml-auto mt-1 h-px w-8 bg-slate-300" />
        <div className="mt-1">Gamma Sterilized</div>
      </div>

      <svg
        viewBox="0 0 200 220"
        className="absolute left-1/2 top-1/2 h-[72%] w-auto -translate-x-1/2 -translate-y-1/2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="mem-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="part-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <filter id="soft-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
          </filter>
        </defs>
        <path
          d="M20 60 Q50 42 100 50 Q150 58 180 44 L178 100 Q148 112 100 106 Q52 100 22 114 Z"
          fill="url(#mem-grad)"
          stroke="#94A3B8"
          strokeWidth="0.8"
          filter="url(#soft-shadow)"
        />
        {[68, 78, 88, 98].map((y, i) => (
          <path
            key={i}
            d={`M28 ${y} Q100 ${y - 6} 172 ${y - 2}`}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="0.5"
            opacity="0.45"
          />
        ))}
        <ellipse cx="55" cy="148" rx="22" ry="13" fill="url(#part-grad)" opacity="0.8" transform="rotate(-20 55 148)" />
        <ellipse cx="100" cy="160" rx="26" ry="14" fill="url(#part-grad)" opacity="0.85" transform="rotate(10 100 160)" />
        <ellipse cx="148" cy="150" rx="20" ry="12" fill="url(#part-grad)" opacity="0.75" transform="rotate(-35 148 150)" />
        <ellipse cx="75" cy="178" rx="18" ry="11" fill="url(#part-grad)" opacity="0.70" transform="rotate(25 75 178)" />
        <ellipse cx="130" cy="176" rx="22" ry="12" fill="url(#part-grad)" opacity="0.80" transform="rotate(-10 130 176)" />
        <ellipse cx="100" cy="200" rx="15" ry="9" fill="url(#part-grad)" opacity="0.65" transform="rotate(5 100 200)" />
      </svg>

      <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        Lot 24-GBR01
      </div>
      <div className="absolute bottom-6 right-6 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        {t.madeInSouthKorea}
      </div>
    </div>
  );
}

function StatsStrip({ t }: { t: Dictionary }) {
  const stats = [
    { value: "5,000+", label: t.stats.clinicsServed },
    { value: "62", label: t.stats.countriesShipped },
    { value: "10 yrs", label: t.stats.manufacturing },
    { value: "6", label: t.stats.activeSKUs },
  ];
  return (
    <section className="border-b border-slate-200/80 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-slate-800 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-950 px-6 py-8 lg:px-10 lg:py-12">
            <div className="font-serif text-4xl font-normal tracking-tight lg:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustFeatures({ lang, t }: { lang: string; t: Dictionary }) {
  const features = [
    { icon: ShieldCheck, title: t.trustFeatures.certifiedQualityTitle, copy: t.trustFeatures.certifiedQualityCopy },
    { icon: Globe2, title: t.trustFeatures.globalLogisticsTitle, copy: t.trustFeatures.globalLogisticsCopy },
    { icon: Headphones, title: t.trustFeatures.clinicalSupportTitle, copy: t.trustFeatures.clinicalSupportCopy },
    { icon: BadgeDollarSign, title: t.trustFeatures.b2bPricingTitle, copy: t.trustFeatures.b2bPricingCopy },
  ];
  return (
    <section
      id="technology"
      className="scroll-mt-20 border-b border-slate-200/80 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {t.home.whySurgeons}
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              {t.home.manufacturingDiscipline}
              <br />
              <span className="italic text-slate-500">
                {t.home.withoutMiddlemen}
              </span>
            </h2>
          </div>
          <Link
            href={`/${lang}/#about`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {t.home.ourCertifications}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative flex flex-col gap-6 bg-white p-8 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold tracking-tight text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.copy}
                </p>
              </div>
              <ArrowUpRight className="absolute right-6 top-6 h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-900" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ lang, t }: { lang: string; t: Dictionary }) {
  return (
    <section
      id="products"
      className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50/50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {t.home.featuredCatalog}
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              {t.home.builtForEvery}
            </h2>
          </div>
          <Link
            href={`/${lang}/products`}
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline sm:inline-flex"
          >
            {t.home.viewAll6}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <Card
              key={p.id}
              className="group overflow-hidden rounded-2xl border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                  <Badge className="absolute left-4 top-4 z-10 rounded-full border-0 bg-slate-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white hover:bg-slate-900">
                    {p.category === "bone-graft" ? t.common.boneGraft : t.common.membrane}
                  </Badge>
                  <Image
                    src={p.image}
                    alt={`${p.name} — ${p.subcategory} for guided bone regeneration`}
                    fill
                    className="object-contain p-6"
                    unoptimized
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-5">
                <div>
                  <CardTitle className="text-[17px] font-semibold tracking-tight text-slate-900">
                    {p.name}
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs text-slate-500">
                    {p.subcategory}
                  </CardDescription>
                </div>
                <p className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600">
                  {getSpecLine(p)}
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2 border-t border-slate-100 p-5">
                <Link
                  href={`/${lang}/products/${p.slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-full border-slate-300 bg-white text-xs font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  {t.common.viewDetails}
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
                <a
                  href={waMsg.productCard(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "h-9 rounded-full bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800"
                  )}
                >
                  {t.common.quote}
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ t }: { t: Dictionary }) {
  const testimonials = [
    { quote: t.testimonials.t1Quote, name: t.testimonials.t1Name, role: t.testimonials.t1Role, location: t.testimonials.t1Location },
    { quote: t.testimonials.t2Quote, name: t.testimonials.t2Name, role: t.testimonials.t2Role, location: t.testimonials.t2Location },
    { quote: t.testimonials.t3Quote, name: t.testimonials.t3Name, role: t.testimonials.t3Role, location: t.testimonials.t3Location },
  ];
  return (
    <section className="border-b border-slate-200/80 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {t.home.fromTheField}
          </div>
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
            {t.home.whatPractitioners}
            <br />
            <span className="italic text-slate-500">{t.home.afterTwelveMonths}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <figure
              key={testimonial.name}
              className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 ${
                i === 1 ? "md:translate-y-6" : ""
              }`}
            >
              <Quote className="h-6 w-6 text-slate-300" strokeWidth={1.5} aria-hidden />
              <blockquote className="mt-6 font-serif text-lg leading-relaxed text-slate-800">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {testimonial.name.split(" ").slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.role} · {testimonial.location}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ lang, t }: { lang: string; t: Dictionary }) {
  const aboutStats = [
    { label: t.aboutStats.founded, value: "2016" },
    { label: t.aboutStats.isoStandard, value: "13485:2016" },
    { label: t.aboutStats.clearances, value: "K-FDA · CE" },
    { label: t.aboutStats.exportMarkets, value: "62 countries" },
  ];
  return (
    <section
      id="about"
      className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50/50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {t.home.ourStory}
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              {t.home.tenYears}
              <br />
              <span className="italic text-slate-500">{t.home.koreanPrecision}</span>
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-600">{t.home.aboutP1}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{t.home.aboutP2}</p>
            <a
              href={waMsg.homepageQuote}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              {t.home.getInTouch}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {aboutStats.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="font-serif text-2xl font-normal tracking-tight text-slate-900 lg:text-3xl">
                  {item.value}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ lang, t }: { lang: string; t: Dictionary }) {
  return (
    <section
      id="contact"
      className="scroll-mt-20 relative overflow-hidden bg-slate-950 text-white"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {t.home.startWholesale}
            </div>
            <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight lg:text-6xl">
              {t.home.readyToSource}
              <br />
              <span className="italic text-slate-400">{t.home.fromTheFactory}</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
              {t.home.customQuote24h}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <a
              href={waMsg.homepageQuote}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100 lg:w-auto"
              )}
            >
              {t.common.requestCustomQuote}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href={waMsg.homepageQuote}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 w-full rounded-full border-slate-700 bg-transparent px-7 text-[15px] text-white hover:bg-slate-900 hover:text-white lg:w-auto"
              )}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.common.chatWhatsApp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang, t }: { lang: string; t: Dictionary }) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-900">
                <div className="h-3 w-3 rounded-[2px] bg-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900">Medistan</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">{t.home.footerTagline}</p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span>ISO 13485:2016</span>
              <span>·</span>
              <span>K-FDA Licensed</span>
              <span>·</span>
              <span>CE 2797</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              {t.home.productsColumn}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link href={`/${lang}/products`} className="hover:text-slate-900">{t.home.allProducts}</Link></li>
              <li><Link href={`/${lang}/products/bone-graft-material`} className="hover:text-slate-900">{t.home.boneGraftMaterials}</Link></li>
              <li><Link href={`/${lang}/products/membrane`} className="hover:text-slate-900">{t.home.membranesColumn}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              {t.home.boneGraftsColumn}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {products.filter((p) => p.category === "bone-graft").map((p) => (
                <li key={p.slug}>
                  <Link href={`/${lang}/products/${p.slug}`} className="hover:text-slate-900">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              {t.home.membranesColumn}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {products.filter((p) => p.category === "membrane").map((p) => (
                <li key={p.slug}>
                  <Link href={`/${lang}/products/${p.slug}`} className="hover:text-slate-900">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">{t.home.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat({ t }: { t: Dictionary["common"] }) {
  return (
    <a
      href={waMsg.floating}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Medistan on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 hover:shadow-xl"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
        <MessageCircle className="relative h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="hidden sm:inline">{t.chatWhatsApp}</span>
    </a>
  );
}
