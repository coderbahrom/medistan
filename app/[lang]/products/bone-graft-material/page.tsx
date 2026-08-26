import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CategoryView } from "@/components/category-view";
import { getProductsByCategory, getProductBySlug } from "@/data/products";
import { withCounts, type FilterGroup } from "@/lib/product-filters";
import { localizeProducts } from "@/lib/catalog";
import { waMsg } from "@/lib/whatsapp";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import type { Dictionary } from "../../dictionaries";
import { notFound } from "next/navigation";
import { alternatesFor, localeUrl, OG_LOCALE, ogAlternateLocales } from "@/lib/seo";

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
  const t = (await getDictionary(locale)).seo;

  return {
    title: t.boneGraftTitle,
    description: t.boneGraftDescription,
    alternates: alternatesFor(locale, "/products/bone-graft-material"),
    openGraph: {
      title: `${t.boneGraftTitle} | Medistan`,
      description: t.boneGraftDescription,
      url: localeUrl(locale, "/products/bone-graft-material"),
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og/bone-graft-material.svg", width: 1200, height: 630 }],
    },
  };
}

/** Filter groups, labelled from the active locale's dictionary. */
function buildFilterGroups(t: Dictionary["filters"]): FilterGroup[] {
  const g = t.groups;
  const o = t.options;
  return [
    {
      id: "type",
      label: g.type,
      options: [
        { value: "allograft", label: o.allograft },
        { value: "xenograft", label: o.xenograft },
      ],
    },
    {
      id: "format",
      label: g.format,
      options: [
        { value: "particulate", label: o.particulate },
        { value: "syringe", label: o.syringe },
        { value: "high-density", label: o["high-density"] },
        { value: "granules", label: o.granules },
      ],
    },
    {
      id: "remodeling",
      label: g.remodeling,
      options: [
        { value: "3-4", label: o["3-4"] },
        { value: "4-6", label: o["4-6"] },
        { value: "5-6", label: o["5-6"] },
        { value: "permanent", label: o.permanent },
      ],
    },
    {
      id: "indication",
      label: g.indication,
      options: [
        { value: "ind-socket", label: o["ind-socket"], matches: ["socket-preservation", "extraction-sockets"] },
        { value: "ind-sinus", label: o["ind-sinus"], matches: ["sinus-augmentation", "sinus-lifts"] },
        { value: "ind-ridge", label: o["ind-ridge"], matches: ["ridge-augmentation", "horizontal-ridge-augmentation"] },
        { value: "ind-aesthetic", label: o["ind-aesthetic"], matches: ["aesthetic-zone-augmentation"] },
        { value: "ind-dehiscence", label: o["ind-dehiscence"], matches: ["implant-dehiscence"] },
        { value: "ind-large", label: o["ind-large"], matches: ["large-bony-defects"] },
      ],
    },
    {
      id: "composition",
      label: g.composition,
      options: [
        { value: "100-cortical", label: o["100-cortical"] },
        { value: "80-20", label: o["80-20"] },
        { value: "70-30", label: o["70-30"] },
        { value: "bovine-cancellous", label: o["bovine-cancellous"] },
      ],
    },
    {
      id: "volume",
      label: g.volume,
      options: ["0.25cc", "0.3cc", "0.35cc", "0.5cc", "0.6cc", "1.0cc", "1.1cc"].map((v) => ({
        value: v,
        label: v.replace("cc", " cc"),
      })),
    },
    {
      id: "weight",
      label: g.weight,
      options: ["0.25g", "0.5g", "1.0g", "2.0g"].map((v) => ({
        value: v,
        label: v.replace("g", " g"),
      })),
    },
    {
      id: "particleRange",
      label: g.particleRange,
      options: [
        { value: "lt-05", label: o["lt-05"] },
        { value: "05-10", label: o["05-10"] },
        { value: "10-20", label: o["10-20"] },
      ],
    },
  ];
}

const boneGraftProducts = getProductsByCategory("bone-graft");
const relatedMembranes = (["diaderm-m", "titan-gide"] as const)
  .map((s) => getProductBySlug(s))
  .filter((p): p is NonNullable<typeof p> => p !== undefined);

export default async function BoneGraftMaterialPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const products = localizeProducts(boneGraftProducts, dict.catalog);
  const related = localizeProducts(relatedMembranes, dict.catalog);
  const filterGroups = withCounts(products, buildFilterGroups(dict.filters));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.productDetail.home, item: localeUrl(lang) },
      { "@type": "ListItem", position: 2, name: dict.nav.products, item: localeUrl(lang, "/products") },
      { "@type": "ListItem", position: 3, name: dict.nav.boneGraftMaterials, item: localeUrl(lang, "/products/bone-graft-material") },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar lang={lang} t={dict.nav} />

      <nav className="border-b border-slate-100 bg-white px-6 py-3 lg:px-10" aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-7xl items-center gap-1.5 text-xs text-slate-500">
          <li><Link href={`/${lang}`} className="hover:text-slate-900">{dict.productDetail.home}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/${lang}/products`} className="hover:text-slate-900">{dict.nav.products}</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-900">{dict.nav.boneGraftMaterials}</li>
        </ol>
      </nav>

      <section className="border-b border-slate-200/80 bg-linear-to-b from-slate-50/60 to-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            — {dict.products["4products"]}
          </div>
          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
            {dict.nav.boneGraftMaterials}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            {dict.categoryPages.boneGraftIntro}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Suspense>
            <CategoryView
              products={products}
              filterGroups={filterGroups}
              relatedTitle={dict.categoryPages.relatedBone}
              relatedProducts={related}
              categoryWhatsApp={waMsg.boneGraftCategory}
              faqItems={dict.faq.boneGraft}
              t={dict.filters}
              lang={lang}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
