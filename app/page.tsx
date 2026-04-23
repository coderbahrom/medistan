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
import { products } from "@/data/products";
import { isBoneGraftSpecs, isMembraneSpecs } from "@/data/products";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    copy: "K-FDA and CE cleared. Every lot traceable to origin, tested against ISO 13485 standards.",
  },
  {
    icon: Globe2,
    title: "Global Logistics",
    copy: "DHL & FedEx express partnerships shipping to 62 countries. Average door-to-clinic in 4–7 days.",
  },
  {
    icon: Headphones,
    title: "24/7 Clinical Support",
    copy: "Direct access to our Seoul-based clinical team. Live chat, email, and scheduled video consults.",
  },
  {
    icon: BadgeDollarSign,
    title: "Direct B2B Pricing",
    copy: "Factory-direct wholesale tiers. No distributor markup. Volume pricing unlocks from 50 units.",
  },
];

const testimonials = [
  {
    quote:
      "Switched our socket preservation protocol to Korean allografts last year. The predictability of regeneration is consistently better than what we saw with European brands — and at two-thirds the cost.",
    name: "Dr. Marco Beltrán",
    role: "Periodontist & Implantologist",
    location: "Madrid, Spain",
  },
  {
    quote:
      "Procurement used to take weeks. Now I place an order Tuesday evening and it's in my clinic on Monday. The clinical support team actually picks up the phone.",
    name: "Dr. Amara Okonkwo",
    role: "Oral & Maxillofacial Surgeon",
    location: "Lagos, Nigeria",
  },
  {
    quote:
      "The documentation and traceability is immaculate. Every membrane's lot, raw material, and QC record is accessible. It's the kind of paper trail our regulators appreciate.",
    name: "Dr. Jonas Weiß",
    role: "Clinic Director",
    location: "Zurich, Switzerland",
  },
];

const stats = [
  { value: "5,000+", label: "Clinics served" },
  { value: "62", label: "Countries shipped" },
  { value: "10 yrs", label: "Manufacturing" },
  { value: "6", label: "Active SKUs" },
];

const aboutStats = [
  { label: "Founded", value: "2016" },
  { label: "ISO Standard", value: "13485:2016" },
  { label: "Clearances", value: "K-FDA · CE" },
  { label: "Export markets", value: "62 countries" },
];

// Featured: Renew Oss, Titan-X, Diaderm M, Titan Gide
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

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <Hero />
      <StatsStrip />
      <TrustFeatures />
      <FeaturedProducts />
      <Testimonials />
      <About />
      <FinalCta />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
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
        {/* Copy */}
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            K-FDA · CE cleared
          </div>

          <h1 className="font-serif text-[2.5rem] font-normal leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]">
            Premium Korean
            <br />
            dental regenerative
            <br />
            <span className="italic text-slate-500">materials.</span>
          </h1>

          <p className="mt-5 max-w-lg font-serif text-xl font-normal italic leading-snug tracking-tight text-slate-500 sm:text-2xl">
            Allografts, xenografts, and barrier membranes — direct to your
            clinic, worldwide.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Ten years of precision manufacturing in South Korea.
            Factory-direct wholesale of bone graft materials and barrier
            membranes for oral surgeons, periodontists, and implantologists in
            62 countries — with clinical support that answers when you call.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-slate-900 px-7 text-[15px] text-white shadow-sm hover:bg-slate-800"
              )}
            >
              Explore Catalog
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
              Request a Quote
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.16em] text-slate-500">
            <span>Trusted by</span>
            <span className="font-medium text-slate-700">Smile Clinic Group</span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">Dental Pro Chile</span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">ImplantWerk DE</span>
          </div>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-5">
          <RegenerativeVisual />
        </div>
      </div>
    </section>
  );
}

function RegenerativeVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-50 via-slate-50 to-white" />
      <div className="absolute inset-8 rounded-full border border-slate-200/80" />
      <div className="absolute inset-16 rounded-full border border-slate-200/60" />

      {/* Membrane annotation — left */}
      <div className="absolute left-4 top-1/3 -translate-y-1/2 space-y-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
        <div>Type I Atelocollagen</div>
        <div className="h-px w-8 bg-slate-300" />
        <div>4-mo resorption</div>
        <div className="h-px w-8 bg-slate-300" />
        <div>20×30 mm</div>
      </div>

      {/* Bone graft annotation — right */}
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

        {/* Membrane — draped sheet */}
        <path
          d="M20 60 Q50 42 100 50 Q150 58 180 44 L178 100 Q148 112 100 106 Q52 100 22 114 Z"
          fill="url(#mem-grad)"
          stroke="#94A3B8"
          strokeWidth="0.8"
          filter="url(#soft-shadow)"
        />
        {/* Collagen fiber lines on membrane */}
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

        {/* Bone graft particulate — below membrane */}
        <ellipse cx="55" cy="148" rx="22" ry="13" fill="url(#part-grad)" opacity="0.8" transform="rotate(-20 55 148)" />
        <ellipse cx="100" cy="160" rx="26" ry="14" fill="url(#part-grad)" opacity="0.85" transform="rotate(10 100 160)" />
        <ellipse cx="148" cy="150" rx="20" ry="12" fill="url(#part-grad)" opacity="0.75" transform="rotate(-35 148 150)" />
        <ellipse cx="75" cy="178" rx="18" ry="11" fill="url(#part-grad)" opacity="0.70" transform="rotate(25 75 178)" />
        <ellipse cx="130" cy="176" rx="22" ry="12" fill="url(#part-grad)" opacity="0.80" transform="rotate(-10 130 176)" />
        <ellipse cx="100" cy="200" rx="15" ry="9" fill="url(#part-grad)" opacity="0.65" transform="rotate(5 100 200)" />
      </svg>

      {/* Floating badges */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        Lot 24-GBR01
      </div>
      <div className="absolute bottom-6 right-6 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        Made in South Korea
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats strip
// ---------------------------------------------------------------------------

function StatsStrip() {
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

// ---------------------------------------------------------------------------
// Trust features
// ---------------------------------------------------------------------------

function TrustFeatures() {
  return (
    <section
      id="technology"
      className="scroll-mt-20 border-b border-slate-200/80 bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Why surgeons choose us
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Manufacturing discipline,
              <br />
              <span className="italic text-slate-500">
                without the middlemen.
              </span>
            </h2>
          </div>
          <Link
            href="/#about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            Our certifications
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((f) => (
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

// ---------------------------------------------------------------------------
// Featured products
// ---------------------------------------------------------------------------

function FeaturedProducts() {
  return (
    <section
      id="products"
      className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50/50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Featured catalog
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Built for every indication.
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline sm:inline-flex"
          >
            View all 6 products
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
                    {p.category === "bone-graft" ? "Bone Graft" : "Membrane"}
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
                  href={`/products/${p.slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-full border-slate-300 bg-white text-xs font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  View Details
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
                  Quote
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

function Testimonials() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            — From the field
          </div>
          <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
            What practitioners say
            <br />
            <span className="italic text-slate-500">after twelve months.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 ${
                i === 1 ? "md:translate-y-6" : ""
              }`}
            >
              <Quote
                className="h-6 w-6 text-slate-300"
                strokeWidth={1.5}
                aria-hidden
              />
              <blockquote className="mt-6 font-serif text-lg leading-relaxed text-slate-800">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {t.name.split(" ").slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.role} · {t.location}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50/50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Our story
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Ten years of
              <br />
              <span className="italic text-slate-500">Korean precision.</span>
            </h2>
            <p className="mt-8 text-base leading-relaxed text-slate-600">
              Founded in 2016, Medistan has grown from a single South Korean
              manufacturing facility into one of Korea&apos;s most trusted
              exporters of dental regenerative materials. Every bone graft and
              barrier membrane is processed, tested, and packed under one roof —
              so traceability is never in question.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Our clinical advisory teams work directly with oral surgeons,
              periodontists, and implantologists across 62 countries to refine
              our allograft processing, collagen purification, and pericardium
              treatment methods — all backed by K-FDA and CE clearance.
            </p>
            <a
              href={waMsg.homepageQuote}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Get in touch with our clinical team
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

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
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
              — Start a wholesale account
            </div>
            <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight lg:text-6xl">
              Ready to source directly
              <br />
              <span className="italic text-slate-400">from the factory?</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
              Get a custom quote within 24 hours. Free product samples for
              qualified dental professionals and clinics.
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
              Request Custom Quote
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
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-10 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-900">
                <div className="h-3 w-3 rounded-[2px] bg-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Medistan
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
              Korean manufacturer of dental regenerative materials. Factory-direct
              wholesale to oral surgeons in 62 countries.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span>ISO 13485:2016</span>
              <span>·</span>
              <span>K-FDA Licensed</span>
              <span>·</span>
              <span>CE 2797</span>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Products
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link href="/products" className="hover:text-slate-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/bone-graft-material"
                  className="hover:text-slate-900"
                >
                  Bone Graft Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/products/membrane"
                  className="hover:text-slate-900"
                >
                  Membranes
                </Link>
              </li>
            </ul>
          </div>

          {/* Bone Grafts column */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Bone Grafts
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {products
                .filter((p) => p.category === "bone-graft")
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="hover:text-slate-900"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Membranes column */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Membranes
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {products
                .filter((p) => p.category === "membrane")
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="hover:text-slate-900"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © 2026 Medistan Co., Ltd. · Seoul, Republic of Korea
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// WhatsApp float
// ---------------------------------------------------------------------------

function WhatsAppFloat() {
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
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
