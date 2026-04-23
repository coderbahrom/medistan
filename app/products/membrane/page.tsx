import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CategoryView, type FilterGroup } from "@/components/category-view";
import { getProductsByCategory, getProductBySlug } from "@/data/products";
import { waMsg } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Dental Barrier Membranes — Collagen & Pericardium",
  description:
    "Korean resorbable barrier membranes for GBR and GTR: Type I porcine collagen (3–4 mo) and bovine pericardium (4–6 mo). K-FDA and CE cleared. Factory-direct wholesale.",
  openGraph: {
    title: "Dental Barrier Membranes — Collagen & Pericardium | Medistan",
    description:
      "Diaderm M (collagen) and Titan Gide (pericardium). Extended barrier function. K-FDA and CE cleared.",
    images: [{ url: "/og/membrane.svg", width: 1200, height: 630 }],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medistan.co.kr" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://medistan.co.kr/products" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Membranes",
      item: "https://medistan.co.kr/products/membrane",
    },
  ],
};

const filterGroups: FilterGroup[] = [
  {
    id: "material",
    label: "Material",
    options: [
      { value: "collagen", label: "Collagen" },
      { value: "pericardium", label: "Pericardium" },
    ],
  },
  {
    id: "resorption",
    label: "Resorption Time",
    options: [
      { value: "3-4", label: "3–4 months" },
      { value: "4-6", label: "4–6 months" },
    ],
  },
  {
    id: "origin",
    label: "Origin",
    options: [
      { value: "porcine", label: "Porcine" },
      { value: "bovine", label: "Bovine" },
    ],
  },
  {
    id: "indication",
    label: "Indication",
    options: [
      { value: "gbr", label: "Guided Bone Regeneration" },
      { value: "gtr", label: "Guided Tissue Regeneration" },
      { value: "large", label: "Large ridge augmentation" },
      { value: "complex", label: "Complex GBR" },
      { value: "sinus", label: "Sinus floor protection" },
      { value: "graft", label: "Graft site protection" },
    ],
  },
  {
    id: "size",
    label: "Size",
    options: [
      { value: "15×20", label: "15×20 mm" },
      { value: "15×30", label: "15×30 mm" },
      { value: "20×30", label: "20×30 mm" },
    ],
  },
];

const membraneProducts = getProductsByCategory("membrane");
const relatedGrafts = (["renew-oss", "titan-x"] as const)
  .map((s) => getProductBySlug(s))
  .filter((p): p is NonNullable<typeof p> => p !== undefined);

const faqItems = [
  {
    q: "What's the difference between collagen and pericardium membranes?",
    a: "Collagen membranes (like Diaderm® M) are made from porcine atelocollagen, offering excellent flexibility and a 3–4 month resorption that matches standard GBR healing. Pericardium membranes (like Titan Gide®) are made from bovine pericardium — a naturally dense, multi-directional fiber structure that provides superior tear resistance and a longer 4–6 month barrier, making them better suited for large or complex augmentations.",
  },
  {
    q: "How do I choose between resorbable membrane options?",
    a: "Choose based on three factors: defect size, expected healing time, and surgical complexity. For routine socket preservation, extraction site GBR, or small defects: Diaderm® M (collagen, 3–4 mo). For large ridge augmentations, cases requiring suturing or tacking, or when you need 4–6 months of barrier protection: Titan Gide® (pericardium). Pericardium's tear resistance is especially valuable when fixing the membrane with tacks.",
  },
  {
    q: "Can I use a membrane without a bone graft?",
    a: "Yes — in Guided Tissue Regeneration (GTR) for periodontal defects, a membrane alone (without bone graft) is used to exclude epithelial and connective tissue while allowing PDL cells to repopulate the root surface. However, for most GBR bone augmentation procedures, combining a membrane with a bone graft material significantly improves volumetric outcomes.",
  },
  {
    q: "What is GBR vs GTR?",
    a: "GBR (Guided Bone Regeneration) uses a barrier membrane to exclude soft tissue from a bone defect, directing bone cells to regenerate lost volume. It's used for ridge augmentation, socket preservation, and peri-implant defects. GTR (Guided Tissue Regeneration) is a periodontal procedure using a barrier membrane to encourage regeneration of the periodontal attachment (cementum, PDL, and alveolar bone) around a tooth root.",
  },
  {
    q: "How long before the membrane resorbs?",
    a: "Diaderm® M (porcine collagen) resorbs in 3–4 months under normal healing conditions. Titan Gide® (bovine pericardium) provides an extended barrier function of 4–6 months. Resorption timelines can vary based on patient biology, vascularization, and the inflammatory environment. Both membranes are fully resorbable — no membrane retrieval surgery is required.",
  },
];

export default function MembranePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      {/* Breadcrumb */}
      <nav
        className="border-b border-slate-100 bg-white px-6 py-3 lg:px-10"
        aria-label="Breadcrumb"
      >
        <ol className="mx-auto flex max-w-7xl items-center gap-1.5 text-xs text-slate-500">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="hover:text-slate-900">
              Products
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-900">Membranes</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-200/80 bg-linear-to-b from-slate-50/60 to-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            — 2 Products
          </div>
          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
            Barrier Membranes
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Korean resorbable barrier membranes for guided bone and tissue
            regeneration. Type I porcine atelocollagen for routine GBR, and
            bovine pericardium for complex augmentations requiring extended
            protection and suture strength. Both K-FDA and CE cleared.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Suspense>
            <CategoryView
              products={membraneProducts}
              filterGroups={filterGroups}
              relatedTitle="Pair with a bone graft for complete GBR"
              relatedProducts={relatedGrafts}
              categoryWhatsApp={waMsg.membraneCategory}
              faqItems={faqItems}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
