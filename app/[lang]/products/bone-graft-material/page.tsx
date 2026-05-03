import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CategoryView, type FilterGroup } from "@/components/category-view";
import { getProductsByCategory, getProductBySlug } from "@/data/products";
import { waMsg } from "@/lib/whatsapp";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Dental Bone Graft Materials — Allografts & Xenografts",
  description:
    "Korean dental bone graft materials: mineralized human allografts (particulate, syringe, high-density) and anorganic bovine xenograft. K-FDA and CE cleared. Wholesale to clinics worldwide.",
  openGraph: {
    title: "Dental Bone Graft Materials — Allografts & Xenografts | Medistan",
    description:
      "4 bone graft SKUs: Renew Oss, Do Bone, Titan Bone, Titan-X. K-FDA and CE cleared. Factory-direct wholesale.",
    images: [{ url: "/og/bone-graft-material.svg", width: 1200, height: 630 }],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medistan.co.kr" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://medistan.co.kr/products" },
    { "@type": "ListItem", position: 3, name: "Bone Graft Materials", item: "https://medistan.co.kr/products/bone-graft-material" },
  ],
};

const filterGroups: FilterGroup[] = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "allograft", label: "Allograft (4)" },
      { value: "xenograft", label: "Xenograft (1)" },
    ],
  },
  {
    id: "format",
    label: "Format",
    options: [
      { value: "particulate", label: "Particulate" },
      { value: "syringe", label: "Syringe" },
      { value: "high-density", label: "High-Density Block" },
      { value: "bovine", label: "Granules (Xenograft)" },
    ],
  },
  {
    id: "remodeling",
    label: "Remodeling / Resorption Time",
    options: [
      { value: "3-4", label: "3–4 months" },
      { value: "4-6", label: "4–6 months" },
      { value: "5-6", label: "5–6 months" },
      { value: "permanent", label: "Very Slow (permanent)" },
    ],
  },
  {
    id: "indication",
    label: "Indication",
    options: [
      { value: "socket", label: "Socket preservation" },
      { value: "sinus", label: "Sinus lift / augmentation" },
      { value: "ridge", label: "Ridge augmentation" },
      { value: "aesthetic", label: "Aesthetic zone" },
      { value: "dehiscence", label: "Implant dehiscence" },
      { value: "large", label: "Large defects" },
    ],
  },
  {
    id: "composition",
    label: "Composition",
    options: [
      { value: "100%", label: "100% Cortical" },
      { value: "80%", label: "80/20 Cortical-Cancellous" },
      { value: "70%", label: "70/30 Cortical-Cancellous" },
      { value: "bovine cancellous", label: "Bovine Cancellous" },
    ],
  },
  {
    id: "volume",
    label: "Volume (cc)",
    options: [
      { value: "0.25cc", label: "0.25 cc" },
      { value: "0.3cc", label: "0.3 cc" },
      { value: "0.35cc", label: "0.35 cc" },
      { value: "0.5cc", label: "0.5 cc" },
      { value: "0.6cc", label: "0.6 cc" },
      { value: "1.0cc", label: "1.0 cc" },
      { value: "1.1cc", label: "1.1 cc" },
    ],
  },
  {
    id: "weight",
    label: "Weight (g)",
    options: [
      { value: "0.25g", label: "0.25 g" },
      { value: "0.5g", label: "0.5 g" },
      { value: "1.0g", label: "1.0 g" },
      { value: "2.0g", label: "2.0 g" },
    ],
  },
  {
    id: "particleRange",
    label: "Particle Size Range",
    options: [
      { value: "<0.5mm", label: "< 0.5 mm" },
      { value: "0.5-1.0mm", label: "0.5 – 1.0 mm" },
      { value: "1.0-2.0mm", label: "1.0 – 2.0 mm" },
    ],
  },
];

const faqItems = [
  {
    q: "What is the difference between allograft and xenograft?",
    a: "Allografts are derived from human bone (cadaveric) and processed to preserve the mineral and protein matrix. They integrate naturally and remodel as new bone. Xenografts are derived from bovine (cow) bone mineral — all organic material is removed, leaving only the hydroxyapatite scaffold. Xenografts resorb very slowly, making them ideal where long-term volume stability is the priority.",
  },
  {
    q: "How long does a bone graft take to integrate?",
    a: "Integration time depends on the graft material and patient biology. Allografts typically show good integration in 3–6 months: Renew Oss (3–4 mo), Do Bone (4–6 mo), Titan Bone (5–6 mo). Bovine xenografts like Titan-X remain as a permanent scaffold and are gradually incorporated over years.",
  },
  {
    q: "Do I always need a membrane with a bone graft?",
    a: "In most guided bone regeneration (GBR) cases, a membrane is strongly recommended to prevent soft tissue ingrowth into the graft site. Exceptions include intra-bony defects with three or four walls. For extraction sockets and ridge augmentation procedures, a membrane significantly improves predictability.",
  },
  {
    q: "Which bone graft is best for socket preservation?",
    a: "Renew Oss™ (allograft particulate) is the most common choice for socket preservation due to its 0.25–1.0 mm particle size and its 3–4 month remodeling timeline. Do Bone™ in syringe delivery is also excellent for sockets requiring precise placement.",
  },
  {
    q: "Which bone graft is best for sinus lift?",
    a: "Both Renew Oss™ and Titan-X®/Titan-B™ are commonly used for sinus lifts. Renew Oss remodels more quickly (3–4 months). Titan-X offers superior volume stability and is preferred in cases requiring long-term volumetric predictability.",
  },
];

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
            Korean-manufactured bone grafting materials for oral surgeons, periodontists, and implantologists. Three human allografts — particulate, syringe delivery, and high-density cortical — plus a permanent bovine xenograft scaffold. All K-FDA and CE cleared.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Suspense>
            <CategoryView
              products={boneGraftProducts}
              filterGroups={filterGroups}
              relatedTitle="Most surgeons pair their bone graft with a membrane"
              relatedProducts={relatedMembranes}
              categoryWhatsApp={waMsg.boneGraftCategory}
              faqItems={faqItems}
              lang={lang}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
