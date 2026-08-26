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
    title: t.membraneTitle,
    description: t.membraneDescription,
    alternates: alternatesFor(locale, "/products/membrane"),
    openGraph: {
      title: `${t.membraneTitle} | Medistan`,
      description: t.membraneDescription,
      url: localeUrl(locale, "/products/membrane"),
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og/membrane.svg", width: 1200, height: 630 }],
    },
  };
}

/** Filter groups, labelled from the active locale's dictionary. */
function buildFilterGroups(t: Dictionary["filters"]): FilterGroup[] {
  const g = t.groups;
  const o = t.options;
  return [
    {
      id: "material",
      label: g.material,
      options: [
        { value: "collagen", label: o.collagen },
        { value: "pericardium", label: o.pericardium },
      ],
    },
    {
      id: "resorption",
      label: g.resorption,
      options: [
        { value: "3-4", label: o["3-4"] },
        { value: "4-6", label: o["4-6"] },
      ],
    },
    {
      id: "origin",
      label: g.origin,
      options: [
        { value: "porcine", label: o.porcine },
        { value: "bovine", label: o.bovine },
      ],
    },
    {
      id: "indication",
      label: g.indication,
      options: [
        { value: "ind-gbr", label: o["ind-gbr"], matches: ["gbr"] },
        { value: "ind-gtr", label: o["ind-gtr"], matches: ["gtr"] },
        { value: "ind-large-ridge", label: o["ind-large-ridge"], matches: ["large-ridge-augmentation"] },
        { value: "ind-complex-gbr", label: o["ind-complex-gbr"], matches: ["complex-gbr"] },
        { value: "ind-sinus-floor", label: o["ind-sinus-floor"], matches: ["sinus-floor-protection"] },
      ],
    },
    {
      id: "size",
      label: g.size,
      options: ["15 × 20 mm", "20 × 30 mm", "30 × 40 mm"].map((v) => ({
        value: v,
        label: v,
      })),
    },
  ];
}

const membraneProducts = getProductsByCategory("membrane");
const relatedGrafts = (["renew-oss", "titan-x"] as const)
  .map((s) => getProductBySlug(s))
  .filter((p): p is NonNullable<typeof p> => p !== undefined);

export default async function MembranePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const products = localizeProducts(membraneProducts, dict.catalog);
  const related = localizeProducts(relatedGrafts, dict.catalog);
  const filterGroups = withCounts(products, buildFilterGroups(dict.filters));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.productDetail.home, item: localeUrl(lang) },
      { "@type": "ListItem", position: 2, name: dict.nav.products, item: localeUrl(lang, "/products") },
      { "@type": "ListItem", position: 3, name: dict.nav.membranes, item: localeUrl(lang, "/products/membrane") },
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
          <li className="font-medium text-slate-900">{dict.nav.membranes}</li>
        </ol>
      </nav>

      <section className="border-b border-slate-200/80 bg-linear-to-b from-slate-50/60 to-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            — {dict.products["2products"]}
          </div>
          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
            {dict.nav.membranes}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            {dict.categoryPages.membraneIntro}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Suspense>
            <CategoryView
              products={products}
              filterGroups={filterGroups}
              relatedTitle={dict.categoryPages.relatedMembrane}
              relatedProducts={related}
              categoryWhatsApp={waMsg.membraneCategory}
              faqItems={dict.faq.membrane}
              t={dict.filters}
              lang={lang}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
