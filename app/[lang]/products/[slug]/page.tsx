import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Download, Check } from "lucide-react";
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
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const categoryLabel =
    product.category === "bone-graft" ? "Bone Graft Material" : "Barrier Membrane";
  return {
    title: `${product.name} — ${categoryLabel}`,
    description: `${product.tagline} K-FDA and CE cleared. Factory-direct wholesale to oral surgeons worldwide.`,
    openGraph: {
      title: `${product.name} — ${categoryLabel} | Medistan`,
      description: product.tagline,
      images: [{ url: product.image, width: 800, height: 800, alt: `${product.name} — ${product.subcategory}` }],
    },
  };
}

function buildSpecRows(product: Product, t: Dictionary["productDetail"]): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: "Category", value: product.category === "bone-graft" ? t.boneGraftMaterial : t.barrierMembrane });
  rows.push({ label: "Subcategory", value: product.subcategory });
  rows.push({ label: "Composition", value: product.composition });
  const s = product.specs;
  rows.push({ label: "Material", value: s.material });
  if (isBoneGraftSpecs(s)) {
    if (s.remodelingTime) rows.push({ label: "Remodeling Time", value: s.remodelingTime });
    if (s.sterilization) rows.push({ label: "Sterilization", value: s.sterilization });
    if (s.format) rows.push({ label: "Format / Particle Size", value: s.format });
    if (s.density) rows.push({ label: "Density", value: s.density });
    if (s.porosity) rows.push({ label: "Porosity", value: s.porosity });
    if (s.resorption) rows.push({ label: "Resorption", value: s.resorption });
    if (s.hydrophilicity) rows.push({ label: "Hydrophilicity", value: s.hydrophilicity });
    if (s.handling) rows.push({ label: "Handling", value: s.handling });
  }
  if (isMembraneSpecs(s)) {
    rows.push({ label: "Resorption Time", value: s.resorptionTime });
    rows.push({ label: "Handling", value: s.handling });
    if (s.tearResistance) rows.push({ label: "Tear Resistance", value: s.tearResistance });
    if (s.memory) rows.push({ label: "Memory", value: s.memory });
  }
  if (s.storage) rows.push({ label: "Storage", value: s.storage });
  if (product.packaging?.length) rows.push({ label: "Packaging", value: product.packaging.join(", ") });
  if (product.sizes?.length) rows.push({ label: "Available Sizes", value: product.sizes.join(", ") });
  rows.push({ label: "Regulatory Status", value: "K-FDA · CE cleared" });
  return rows;
}

function getClinicalDetail(use: string): string {
  const map: Record<string, string> = {
    "Socket preservation": "Immediate post-extraction socket grafting is one of the most common indications. Placement of bone graft material in fresh extraction sockets preserves alveolar ridge dimensions, reduces resorption, and prepares the site for predictable implant placement 3–6 months later.",
    "Sinus augmentation": "Lateral window and transcrestal sinus augmentation procedures require a graft material with good handling, space-maintaining properties, and reliable integration.",
    "Ridge augmentation": "Horizontal and vertical ridge augmentation cases demand a graft material that resists soft tissue pressure, maintains space beneath the membrane, and provides adequate volume for implant support.",
    "Extraction sockets": "Syringe-delivered grafts allow precise placement in fresh extraction sockets with minimal manipulation, reducing contamination risk and optimizing graft adaptation to the socket walls.",
    "Implant dehiscence": "Buccal dehiscence defects around implants are commonly treated with a particulate or syringe graft material combined with a resorbable membrane.",
    "Minimally invasive GBR": "The pre-filled syringe format enables minimally invasive GBR through smaller flap designs, reducing patient morbidity while delivering graft material precisely to the defect site.",
    "Horizontal ridge augmentation": "Cases of severe horizontal ridge resorption require a high-density, compression-resistant graft material that can maintain ridge width against flap tension.",
    "Large bony defects": "Extensive bone loss demands a structurally robust graft material capable of filling large volumes while maintaining space throughout the healing period.",
    "Aesthetic zone augmentation": "The anterior maxilla demands exceptional volume stability. A permanent scaffold material maintains ridge contour long-term, supporting both hard and soft tissue aesthetics.",
    "Sinus lifts": "In sinus lift procedures, the graft material must integrate well with the natural sinus floor while providing sufficient height and density for safe implant placement.",
    "Long-term volume maintenance": "Where maintaining bone volume over years is critical, a slow-resorbing or permanent scaffold preserves the regenerated volume through the prosthetic loading phase.",
    "Guided Bone Regeneration (GBR)": "GBR is the primary indication for barrier membranes. By excluding rapidly proliferating epithelial and connective tissue, the membrane creates a protected space for osteogenic cells.",
    "Guided Tissue Regeneration (GTR)": "In GTR for periodontal defects, the membrane prevents epithelial downgrowth and connective tissue invasion, allowing periodontal ligament cells to regenerate the attachment apparatus.",
    "Large ridge augmentations": "Large augmentations place significant mechanical demands on the membrane. A tear-resistant pericardium membrane can be sutured and tacked without risk of perforation.",
    "Complex GBR": "Cases involving large defects or non-contained bone defects benefit from a membrane with high mechanical integrity and extended barrier function.",
    "Sinus floor protection": "During maxillary sinus augmentation, a membrane placed against the Schneiderian membrane provides a barrier layer that protects the graft.",
  };
  return map[use] ?? `${use} is one of the primary clinical indications for this product.`;
}

function getHandlingInfo(product: Product): string {
  const s = product.specs;
  if (isBoneGraftSpecs(s)) {
    if (s.handling) return s.handling;
    if (s.hydrophilicity) return `This xenograft features ${s.hydrophilicity.toLowerCase()}. Moisten with blood or saline before placement. Store at room temperature away from moisture until use.`;
    return `Store at room temperature. Handle with standard sterile technique. ${s.sterilization ? `Sterile by ${s.sterilization}.` : ""}`;
  }
  if (isMembraneSpecs(s)) {
    const mem = s.memory ? `The membrane exhibits ${s.memory.toLowerCase()}, ensuring intimate tissue contact. ` : "";
    return `${mem}Rehydrate in sterile saline for 30–60 seconds before placement. ${s.tearResistance ? `Tear resistance is ${s.tearResistance.toLowerCase()}, allowing secure suturing or tacking. ` : ""}Store at room temperature in the original packaging. Do not re-sterilize.`;
  }
  return "Store at room temperature. Handle with sterile technique.";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const dict = await getDictionary(lang);
  const t = dict.productDetail;
  const tc = dict.common;

  const related = getRelatedProducts(product);
  const categoryLabel = product.category === "bone-graft" ? t.boneGraftMaterial : t.barrierMembrane;
  const categoryHref = product.category === "bone-graft"
    ? `/${lang}/products/bone-graft-material`
    : `/${lang}/products/membrane`;

  const specRows = buildSpecRows(product, t);

  const waDetailUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "821044959591"}?text=${encodeURIComponent(`Hello Medistan, I'd like to inquire about ${product.name} (${categoryLabel}). Quantity: [fill in]. Clinic/Country: [fill in]. Any specific size/packaging requirements: [fill in].`)}`;

  const medicalDeviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalDevice",
    name: product.name,
    description: product.description,
    manufacturer: { "@type": "Organization", name: "Medistan", url: "https://medistan.co.kr" },
    medicalSpecialty: ["Surgery", "Dentistry"],
    intendedUse: product.primaryUse.join(", "),
    material: product.specs.material,
    regulatoryStatus: "K-FDA and CE cleared",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://medistan.co.kr" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://medistan.co.kr/products" },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: `https://medistan.co.kr${categoryHref}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `https://medistan.co.kr/products/${product.slug}` },
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
                unoptimized
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
                {product.primaryUse.map((u) => (
                  <span key={u} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                    <Check className="h-3 w-3 text-emerald-600" />
                    {u}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waDetailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "h-12 flex-1 rounded-full bg-slate-900 px-6 text-[15px] text-white hover:bg-slate-800")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.requestQuote}
                </a>
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
                    {product.primaryUse.map((u) => (
                      <li key={u} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                {product.sizes && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">{t.availableSizes}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((s) => (
                        <span key={s} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">{s}</span>
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
                  {product.primaryUse.map((use) => (
                    <div key={use}>
                      <h3 className="mb-2 text-base font-semibold text-slate-900">{use}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{getClinicalDetail(use)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="handling">
              <div className="max-w-3xl">
                <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">{t.handlingStorage}</h2>
                <p className="text-base leading-relaxed text-slate-600">{getHandlingInfo(product)}</p>
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
                    <Image src={rp.image} alt={rp.name} fill className="object-contain p-6" unoptimized />
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
            <a
              href={waDetailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-12 shrink-0 rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.requestQuoteWhatsApp}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
