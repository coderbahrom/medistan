import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
  isBoneGraftSpecs,
  isMembraneSpecs,
} from "@/data/products";
import type { Product } from "@/data/products";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import type { Dictionary } from "../../dictionaries";
import { ProductQuoteButton } from "./quote-button";
import {
  localizeProduct,
  localizeProducts,
  indicationLabel,
  indicationDetail,
  fill,
} from "@/lib/catalog";
import { alternatesFor, localeUrl, OG_LOCALE, ogAlternateLocales } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    products.map((p) => ({ lang, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const locale = hasLocale(lang) ? lang : "en";
  const dict = await getDictionary(locale);
  const localized = localizeProduct(product, dict.catalog);
  const categoryLabel =
    product.category === "bone-graft"
      ? dict.productDetail.boneGraftMaterial
      : dict.productDetail.barrierMembrane;
  const path = `/products/${product.slug}`;

  return {
    title: `${product.name} — ${categoryLabel}`,
    description: `${localized.tagline} ${dict.seo.productSuffix}`,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: `${product.name} — ${categoryLabel} | Medistan`,
      description: localized.tagline,
      url: localeUrl(locale, path),
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: product.image, width: 800, height: 800, alt: `${product.name} — ${localized.subcategory}` }],
    },
  };
}

function buildSpecRows(
  product: Product,
  t: Dictionary["productDetail"],
  labels: Dictionary["specLabels"]
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: labels.category, value: product.category === "bone-graft" ? t.boneGraftMaterial : t.barrierMembrane });
  rows.push({ label: labels.subcategory, value: product.subcategory });
  rows.push({ label: labels.composition, value: product.composition });
  const s = product.specs;
  rows.push({ label: labels.material, value: s.material });
  if (isBoneGraftSpecs(s)) {
    if (s.remodelingTime) rows.push({ label: labels.remodelingTime, value: s.remodelingTime });
    if (s.sterilization) rows.push({ label: labels.sterilization, value: s.sterilization });
    if (s.format) rows.push({ label: labels.format, value: s.format });
    if (s.density) rows.push({ label: labels.density, value: s.density });
    if (s.porosity) rows.push({ label: labels.porosity, value: s.porosity });
    if (s.resorption) rows.push({ label: labels.resorption, value: s.resorption });
    if (s.hydrophilicity) rows.push({ label: labels.hydrophilicity, value: s.hydrophilicity });
    if (s.handling) rows.push({ label: labels.handling, value: s.handling });
  }
  if (isMembraneSpecs(s)) {
    rows.push({ label: labels.resorptionTime, value: s.resorptionTime });
    rows.push({ label: labels.handling, value: s.handling });
    if (s.tearResistance) rows.push({ label: labels.tearResistance, value: s.tearResistance });
    if (s.memory) rows.push({ label: labels.memory, value: s.memory });
  }
  if (s.storage) rows.push({ label: labels.storage, value: s.storage });
  if (product.volumes?.length)
    rows.push({
      label: product.volumes[0].endsWith("g") ? labels.weights : labels.volumes,
      value: product.volumes.join(", "),
    });
  if (product.particleSize) {
    const ps = product.particleSize;
    rows.push({
      label: labels.particleSize,
      value: Array.isArray(ps) ? ps.join(", ") : ps,
    });
  }
  if (product.dimensions?.length)
    rows.push({ label: labels.dimensions, value: product.dimensions.join(", ") });
  if (product.packaging?.length) rows.push({ label: labels.packaging, value: product.packaging.join(", ") });
  rows.push({ label: labels.regulatory, value: labels.regulatoryValue });
  return rows;
}

/** Handling & storage copy, composed from localized sentence fragments. */
function getHandlingInfo(product: Product, t: Dictionary["handling"]): string {
  const s = product.specs;
  if (isBoneGraftSpecs(s)) {
    if (s.handling) return s.handling;
    if (s.hydrophilicity)
      return fill(t.xenograft, { hydrophilicity: s.hydrophilicity });
    return [
      t.boneGraft,
      s.sterilization ? fill(t.sterilizedBy, { sterilization: s.sterilization }) : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
  if (isMembraneSpecs(s)) {
    return [
      s.memory ? fill(t.membraneMemory, { memory: s.memory }) : "",
      t.membraneBase,
      s.tearResistance ? fill(t.membraneTear, { tearResistance: s.tearResistance }) : "",
      t.membraneStorage,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return t.boneGraft;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const source = getProductBySlug(slug);
  if (!source) notFound();

  const dict = await getDictionary(lang);
  const t = dict.productDetail;
  const tc = dict.common;

  const product = localizeProduct(source, dict.catalog);
  const related = localizeProducts(getRelatedProducts(source), dict.catalog);
  const indications = product.facets.indications;
  const categoryLabel = product.category === "bone-graft" ? t.boneGraftMaterial : t.barrierMembrane;
  const categoryPath =
    product.category === "bone-graft"
      ? "/products/bone-graft-material"
      : "/products/membrane";
  const categoryHref = `/${lang}${categoryPath}`;

  const specRows = buildSpecRows(product, t, dict.specLabels);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "821044959591";
  const sizeOptions = product.volumes ?? product.dimensions ?? [];

  const medicalDeviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalDevice",
    name: product.name,
    description: product.description,
    manufacturer: { "@type": "Organization", name: "Medistan", url: "https://medistan.co.kr" },
    medicalSpecialty: ["Surgery", "Dentistry"],
    intendedUse: indications.map((key) => indicationLabel(key, dict.indications)).join(", "),
    material: product.specs.material,
    regulatoryStatus: dict.specLabels.regulatoryValue,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: localeUrl(lang) },
      { "@type": "ListItem", position: 2, name: dict.nav.products, item: localeUrl(lang, "/products") },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: localeUrl(lang, categoryPath) },
      { "@type": "ListItem", position: 4, name: product.name, item: localeUrl(lang, `/products/${product.slug}`) },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalDeviceJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <Navbar lang={lang} t={dict.nav} />

      <nav className="border-b border-slate-100 bg-white px-6 py-3 lg:px-10" aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <li><Link href={`/${lang}`} className="hover:text-slate-900">{t.home}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/${lang}/products`} className="hover:text-slate-900">{dict.nav.products}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={categoryHref} className="hover:text-slate-900">{categoryLabel}</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-900">{product.name}</li>
        </ol>
      </nav>

      <section className="border-b border-slate-200/80 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white">
              <Image
                src={product.image}
                alt={`${product.name} — ${product.subcategory} for guided bone regeneration`}
                fill
                priority
                className="object-contain p-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{categoryLabel}</div>
              <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">{product.name}</h1>
              <p className="mt-4 text-base italic leading-snug text-slate-600">{product.tagline}</p>

              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {specRows.slice(0, 6).map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5 text-xs">
                    <dt className="shrink-0 font-medium text-slate-500">{row.label}</dt>
                    <dd className="text-right font-medium text-slate-900">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {indications.map((key) => (
                  <span key={key} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                    <Check className="h-3 w-3 text-emerald-600" />
                    {indicationLabel(key, dict.indications)}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ProductQuoteButton
                  productName={product.name}
                  categoryLabel={categoryLabel}
                  sizeOptions={sizeOptions}
                  waNumber={waNumber}
                  label={t.requestQuote}
                />
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-slate-300 px-6 text-[15px] text-slate-700")}
                  aria-label="Download spec sheet (coming soon)"
                  title="Spec sheet PDF coming soon"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t.specSheet}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-slate-400">{t.certLine}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line" className="mb-8 w-full justify-start overflow-x-auto border-b border-slate-200 pb-0">
              <TabsTrigger value="overview" className="px-4 pb-3 text-sm">{t.overview}</TabsTrigger>
              <TabsTrigger value="specs" className="px-4 pb-3 text-sm">{t.technicalSpecs}</TabsTrigger>
              <TabsTrigger value="clinical" className="px-4 pb-3 text-sm">{t.clinicalUse}</TabsTrigger>
              <TabsTrigger value="handling" className="px-4 pb-3 text-sm">{t.handlingStorage}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="max-w-3xl">
                <h2 className="font-serif text-2xl font-normal text-slate-900">{t.productOverview}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{product.description}</p>
                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">{t.primaryIndications}</h3>
                  <ul className="space-y-2">
                    {indications.map((key) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {indicationLabel(key, dict.indications)}
                      </li>
                    ))}
                  </ul>
                </div>
                {(product.volumes && product.volumes.length > 0) && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      {product.volumes[0].endsWith("g") ? dict.specLabels.weights : dict.specLabels.volumes}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.volumes.map((v) => (
                        <span key={v} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800">{v}</span>
                      ))}
                    </div>
                    {product.particleSize && (
                      <div className="mt-4">
                        <h3 className="mb-2 text-sm font-semibold text-slate-900">{dict.specLabels.particleSize}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(product.particleSize) ? product.particleSize : [product.particleSize]).map((ps) => (
                            <span key={ps} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">{ps}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {(product.dimensions && product.dimensions.length > 0) && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">{t.availableSizes}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.dimensions.map((d) => (
                        <span key={d} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {product.packaging && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">{t.packagingOptions}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.packaging.map((p) => (
                        <span key={p} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <div className="max-w-2xl">
                <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">{t.technicalSpecs}</h2>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {specRows.map((row) => (
                      <tr key={row.label}>
                        <td className="py-3 pr-6 font-medium text-slate-500 align-top w-48">{row.label}</td>
                        <td className="py-3 font-medium text-slate-900">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="clinical">
              <div className="max-w-3xl">
                <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">{t.clinicalUse}</h2>
                <div className="space-y-8">
                  {indications.map((key) => (
                    <div key={key}>
                      <h3 className="mb-2 text-base font-semibold text-slate-900">
                        {indicationLabel(key, dict.indications)}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {indicationDetail(key, dict.indications)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="handling">
              <div className="max-w-3xl">
                <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">{t.handlingStorage}</h2>
                <p className="text-base leading-relaxed text-slate-600">{getHandlingInfo(product, dict.handling)}</p>
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                  <strong>For professional use only.</strong> {t.professionalUse}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-8">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.recommended}</div>
              <h2 className="font-serif text-2xl font-normal text-slate-900">
                {product.category === "bone-graft" ? t.pairWithMembrane : t.pairWithBoneGraft}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/${lang}/products/${rp.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="relative aspect-video overflow-hidden bg-linear-to-b from-slate-50 to-white">
                    <Image src={rp.image} alt={rp.name} fill className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {rp.category === "bone-graft" ? tc.boneGraft : tc.membrane}
                    </div>
                    <div className="mt-1 text-base font-semibold text-slate-900">{rp.name}</div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{rp.tagline}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-900 group-hover:underline">
                      {tc.viewDetails2} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-950 py-14 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-serif text-2xl font-normal lg:text-3xl">
                {t.interestedIn} {product.name}?
              </h2>
              <p className="mt-2 text-sm text-slate-400">{t.wholesalePricing}</p>
            </div>
            <ProductQuoteButton
              productName={product.name}
              categoryLabel={categoryLabel}
              sizeOptions={sizeOptions}
              waNumber={waNumber}
              label={t.requestQuoteWhatsApp}
              className="h-12 shrink-0 rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
