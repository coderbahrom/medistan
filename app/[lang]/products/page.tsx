import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck, Globe2, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { waMsg } from "@/lib/whatsapp";
import { products, getProductsByCategory } from "@/data/products";
import { isBoneGraftSpecs, isMembraneSpecs } from "@/data/products";
import { getDictionary, hasLocale, locales } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return {
    title: "Products — Bone Grafts & Membranes",
    description:
      "Complete range of Korean dental regenerative materials: allografts, xenografts, collagen membranes, and pericardium membranes. K-FDA and CE cleared. Factory-direct wholesale.",
    openGraph: {
      title: "Products — Bone Grafts & Membranes | Medistan",
      description:
        "5 bone graft materials + 2 barrier membranes. K-FDA and CE cleared. Factory-direct wholesale worldwide.",
      images: [{ url: "/og/products.svg", width: 1200, height: 630 }],
    },
  };
}

function getSpecLine(p: (typeof products)[0]): string {
  const s = p.specs;
  if (isBoneGraftSpecs(s)) {
    if (s.remodelingTime) return `${s.remodelingTime} remodeling`;
    if (s.resorption) return s.resorption;
    return p.composition;
  }
  if (isMembraneSpecs(s)) return `${s.resorptionTime} resorption`;
  return p.composition;
}

const featuredSlugs = ["renew-oss", "titan-x", "diaderm-m", "titan-gide"];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.products;
  const tc = dict.common;

  const featured = featuredSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const boneGrafts = getProductsByCategory("bone-graft");
  const membranes = getProductsByCategory("membrane");

  const trustBand = [
    { icon: ShieldCheck, label: t.trustBandKFda },
    { icon: Award, label: t.trustBandManufacturing },
    { icon: Globe2, label: t.trustBandCountries },
    { icon: Zap, label: t.trustBandWholesale },
  ];

  const clinicalCards = [
    { title: t.gbrTitle, body: t.gbrBody, href: `/${lang}/products/bone-graft-material` },
    { title: t.alloTitle, body: t.alloBody, href: `/${lang}/products/bone-graft-material` },
    { title: t.membraneTitle, body: t.membraneBody, href: `/${lang}/products/membrane` },
  ];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://medistan.co.kr" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://medistan.co.kr/products" },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar lang={lang} t={dict.nav} />

      {/* Hero */}
      <section className="border-b border-slate-200/80 bg-linear-to-b from-slate-50/60 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {t.dentalMaterials}
          </div>
          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-6xl">
            {t.builtForPredictable}
            <br />
            <span className="italic text-slate-500">{t.boneRegeneration}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 lg:text-lg">
            {t.heroDescription}
          </p>
        </div>
      </section>

      {/* Category cards */}
      <section className="border-b border-slate-200/80 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              href={`/${lang}/products/bone-graft-material`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t["4products"]}
              </div>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-slate-900 lg:text-4xl">
                {t.boneGraftTitle1}
                <br />
                <span className="italic text-slate-500">{t.boneGraftTitle2}</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">{t.boneGraftDesc}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {boneGrafts.map((p) => (
                  <span key={p.slug} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] text-slate-600">
                    {p.name}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-slate-900 group-hover:underline">
                {t.viewBoneGrafts}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={`/${lang}/products/membrane`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t["2products"]}
              </div>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-slate-900 lg:text-4xl">
                {t.barrierTitle1}
                <br />
                <span className="italic text-slate-500">{t.barrierTitle2}</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">{t.barrierDesc}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {membranes.map((p) => (
                  <span key={p.slug} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] text-slate-600">
                    {p.name}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-slate-900 group-hover:underline">
                {t.viewMembranes}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{t.featured}</div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-slate-900 lg:text-4xl">{t.mostRequested}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/${lang}/products/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="relative aspect-square overflow-hidden bg-linear-to-b from-slate-50 to-white">
                  <Image src={p.image} alt={`${p.name} — ${p.subcategory}`} fill className="object-contain p-6" unoptimized />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    {p.category === "bone-graft" ? tc.boneGraft : tc.membrane}
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{p.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{getSpecLine(p)}</div>
                  <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-medium text-slate-900 group-hover:underline">
                    {tc.viewDetails2} <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-b border-slate-200/80 bg-slate-950 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {trustBand.map((tb) => (
              <div key={tb.label} className="flex items-center gap-3">
                <tb.icon className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.5} />
                <span className="text-sm text-slate-300">{tb.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical education */}
      <section className="border-b border-slate-200/80 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{t.clinicalContext}</div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-slate-900 lg:text-4xl">{t.understandingDentistry}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {clinicalCards.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-serif text-xl font-normal text-slate-900">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.body}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-medium text-slate-900 group-hover:underline">
                  {tc.learnMore} <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <h2 className="font-serif text-3xl font-normal lg:text-4xl">{t.requestWholesaleQuote}</h2>
          <p className="mt-3 text-sm text-slate-400">{t.responseTime}</p>
          <a
            href={waMsg.homepageQuote}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex h-12 rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100"
            )}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {tc.chatWhatsApp}
          </a>
        </div>
      </section>

      <div className="bg-white py-6 text-center">
        <Link href={`/${lang}`} className="text-xs text-slate-500 hover:text-slate-900">
          {t.backToMedistan}
        </Link>
      </div>
    </main>
  );
}
