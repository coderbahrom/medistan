import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Package,
  MessageCircle,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Download,
  Share2,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Mock data — replace with a real data layer (DB, CMS, API) in production.
// ---------------------------------------------------------------------------

type Product = {
  id: string;
  name: string;
  tagline: string;
  sku: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  description: string;
  highlights: string[];
  certifications: string[];
  specs: {
    diameter: string;
    length: string;
    connection: string;
    material: string;
    surface: string;
    platform: string;
  };
  variants: {
    diameter: string;
    length: string;
  }[];
};

const MOCK_PRODUCTS: Record<string, Product> = {
  "is-iii-active": {
    id: "is-iii-active",
    name: "IS-III active Implant",
    tagline: "SLA-treated active-surface dental implant · single unit",
    sku: "SEH-IS3A-045115",
    price: 78.0,
    currency: "USD",
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    description:
      "The IS-III active is engineered for confident primary stability in compromised bone. Its SLA-treated surface accelerates osseointegration while a self-tapping apical design reduces drilling steps for experienced clinicians.",
    highlights: [
      "SLA-treated (Sandblasted, Large-grit, Acid-etched) surface — improved cell adhesion",
      "Self-tapping apical geometry reduces insertion torque variability",
      "Colour-coded packaging matches platform diameter for OR efficiency",
      "Individually sterilized, shelf-stable for 60 months",
    ],
    certifications: ["K-FDA", "CE 2797", "US-FDA 510(k)", "ISO 13485"],
    specs: {
      diameter: "4.5 mm",
      length: "11.5 mm",
      connection: "Internal Hex · 2.45 mm",
      material: "Grade 4 Commercially Pure Titanium (ASTM F67)",
      surface: "SLA (Sandblasted, Large-grit, Acid-etched)",
      platform: "Regular Platform (RP) · Ø 4.5",
    },
    variants: [
      { diameter: "3.5", length: "10" },
      { diameter: "4.0", length: "10" },
      { diameter: "4.5", length: "11.5" },
      { diameter: "5.0", length: "13" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = MOCK_PRODUCTS[params.id] ?? MOCK_PRODUCTS["is-iii-active"];

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <MinimalHeader />
      <Breadcrumbs productName={product.name} />

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Gallery productName={product.name} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />
      </section>

      <RelatedProducts />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Minimal sticky header (re-used across client pages)
// ---------------------------------------------------------------------------

function MinimalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900">
            <div className="h-3.5 w-3.5 rounded-[2px] bg-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              SEOHA
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Dental · Korea
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          <Link href="/products" className="text-sm text-slate-900 font-medium">
            Products
          </Link>
          <Link href="/technology" className="text-sm text-slate-600 hover:text-slate-900">
            Technology
          </Link>
          <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">
            About
          </Link>
          <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Cart · 2
          </Button>
          <Button
            size="sm"
            className="hidden h-9 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 md:inline-flex"
          >
            Request Quote
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

function Breadcrumbs({ productName }: { productName: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-10 lg:pt-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-slate-500"
      >
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <Link href="/products" className="hover:text-slate-900">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <Link href="/products?cat=implants" className="hover:text-slate-900">
          Implants
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-900">{productName}</span>
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

function Gallery({ productName }: { productName: string }) {
  const thumbs = [0, 1, 2, 3, 4];
  return (
    <div className="lg:col-span-7">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Thumbnails */}
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {thumbs.map((i) => (
            <button
              key={i}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border bg-gradient-to-b from-slate-50 to-white transition ${
                i === 0
                  ? "border-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <GalleryImplantSVG variant={i} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="order-1 flex-1 lg:order-2">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            {/* Decorative grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(226 232 240 / 0.7) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240 / 0.7) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse at center, black 20%, transparent 75%)",
              }}
            />
            <GalleryImplantSVG variant={0} large />

            {/* Corner badges */}
            <div className="absolute left-5 top-5 flex flex-col gap-1.5">
              <Badge className="w-fit rounded-full border-0 bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white hover:bg-slate-900">
                In Stock
              </Badge>
            </div>
            <div className="absolute right-5 top-5 flex gap-1.5">
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/80 backdrop-blur hover:bg-white"
                aria-label="Save"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/80 backdrop-blur hover:bg-white"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 backdrop-blur">
                {productName} · Ø 4.5 × 11.5 mm
              </div>
              <div className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 backdrop-blur">
                1 / 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryImplantSVG({
  variant = 0,
  large = false,
}: {
  variant?: number;
  large?: boolean;
}) {
  // Variants represent different zoom / angle states
  const rotate = [0, -12, 12, 0, 0][variant] ?? 0;
  const scale = [1, 0.9, 0.9, 1.15, 1][variant] ?? 1;

  return (
    <svg
      viewBox="0 0 200 360"
      className={`absolute left-1/2 top-1/2 ${
        large ? "h-[72%]" : "h-[78%]"
      } w-auto -translate-x-1/2 -translate-y-1/2`}
      style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})` }}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`body-${variant}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="45%" stopColor="#F1F5F9" />
          <stop offset="55%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id={`abut-${variant}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      <path
        d="M75 10 L125 10 L120 45 L80 45 Z"
        fill={`url(#abut-${variant})`}
        stroke="#94A3B8"
        strokeWidth="0.5"
      />
      <rect
        x="72"
        y="45"
        width="56"
        height="12"
        fill={`url(#body-${variant})`}
        stroke="#94A3B8"
        strokeWidth="0.5"
      />
      <path
        d="M78 57 L78 310 L100 340 L122 310 L122 57 Z"
        fill={`url(#body-${variant})`}
        stroke="#94A3B8"
        strokeWidth="0.5"
      />
      {Array.from({ length: 22 }).map((_, i) => (
        <path
          key={i}
          d={`M78 ${70 + i * 11} L122 ${70 + i * 11 - 4}`}
          stroke="#64748B"
          strokeWidth="0.6"
          opacity={i > 18 ? 0.5 : 0.85}
        />
      ))}
      <circle cx="100" cy="342" r="1.5" fill="#475569" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Product info (right column)
// ---------------------------------------------------------------------------

function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="lg:col-span-5">
      <div className="sticky top-24">
        {/* Title block */}
        <div className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          — SKU · {product.sku}
        </div>
        <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{product.tagline}</p>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-amber-400 text-amber-400"
                strokeWidth={1}
              />
            ))}
          </div>
          <span className="font-medium text-slate-900">{product.rating}</span>
          <span className="text-slate-500">
            ({product.reviewCount} verified reviews)
          </span>
        </div>

        {/* Certifications */}
        <div className="mt-6 flex flex-wrap gap-2">
          {product.certifications.map((cert) => (
            <Badge
              key={cert}
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
            >
              <ShieldCheck className="mr-1 h-3 w-3 text-emerald-600" />
              {cert}
            </Badge>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-200" />

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] uppercase tracking-widest text-slate-500">
            Unit price
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="font-serif text-4xl font-normal tracking-tight text-slate-900">
            $ {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-slate-500">USD · ex. VAT</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Volume tiers:{" "}
          <span className="font-medium text-slate-700">
            10 + units · $72 · 50 + units · $65 · 100 + units · contact us
          </span>
        </p>

        {/* Variant selectors */}
        <div className="mt-8 space-y-5">
          <VariantPicker
            label="Diameter"
            options={["Ø 3.5", "Ø 4.0", "Ø 4.5", "Ø 5.0"]}
            selected="Ø 4.5"
          />
          <VariantPicker
            label="Length"
            options={['7.0 mm', "8.5 mm", "10 mm", "11.5 mm", "13 mm"]}
            selected="11.5 mm"
          />
        </div>

        {/* Quantity + CTAs */}
        <div className="mt-8 space-y-3">
          <div className="flex items-stretch gap-3">
            <QuantitySelector />
            <Button
              size="lg"
              className="h-12 flex-1 rounded-full bg-slate-900 text-[15px] text-white hover:bg-slate-800"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full border-[#25D366]/30 bg-[#25D366]/5 text-[15px] font-medium text-[#128C7E] hover:bg-[#25D366]/10 hover:text-[#128C7E]"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Inquire via WhatsApp for bulk orders
          </Button>
        </div>

        {/* Reassurance */}
        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-xs text-slate-700 sm:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <Truck className="mt-0.5 h-4 w-4 text-slate-900" strokeWidth={1.75} />
            <div>
              <div className="font-semibold text-slate-900">Free DHL</div>
              <div className="text-slate-500">Orders over $500</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Package className="mt-0.5 h-4 w-4 text-slate-900" strokeWidth={1.75} />
            <div>
              <div className="font-semibold text-slate-900">In stock</div>
              <div className="text-slate-500">Ships in 24h</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-900" strokeWidth={1.75} />
            <div>
              <div className="font-semibold text-slate-900">10-yr warranty</div>
              <div className="text-slate-500">Lifetime osteo.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantPicker({
  label,
  options,
  selected,
}: {
  label: string;
  options: string[];
  selected: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          {label}
        </span>
        <span className="text-xs text-slate-500">
          Selected: <span className="font-medium text-slate-900">{selected}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              opt === selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantitySelector() {
  return (
    <div className="flex h-12 items-center overflow-hidden rounded-full border border-slate-300 bg-white">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-11 rounded-none hover:bg-slate-100"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        defaultValue={1}
        min={1}
        aria-label="Quantity"
        className="h-12 w-12 border-0 bg-transparent p-0 text-center text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-11 rounded-none hover:bg-slate-100"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs: Specifications / Description / Shipping
// ---------------------------------------------------------------------------

function ProductTabs({ product }: { product: Product }) {
  return (
    <section className="mt-20 border-t border-slate-200 pt-14">
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="h-auto w-full justify-start gap-8 rounded-none border-b border-slate-200 bg-transparent p-0">
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 text-sm font-medium text-slate-500 shadow-none data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 text-sm font-medium text-slate-500 shadow-none data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
          >
            Clinical Overview
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-4 text-sm font-medium text-slate-500 shadow-none data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
          >
            Shipping &amp; Docs
          </TabsTrigger>
        </TabsList>

        {/* Specs */}
        <TabsContent value="specs" className="mt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="w-1/3 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Attribute
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SpecRow label="Diameter" value={product.specs.diameter} />
                  <SpecRow label="Length" value={product.specs.length} />
                  <SpecRow label="Connection type" value={product.specs.connection} />
                  <SpecRow label="Material" value={product.specs.material} />
                  <SpecRow label="Surface treatment" value={product.specs.surface} />
                  <SpecRow label="Platform" value={product.specs.platform} />
                  <SpecRow label="Sterilization" value="Gamma radiation · single-use sterile" />
                  <SpecRow label="Shelf life" value="60 months from manufacture" />
                </TableBody>
              </Table>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" className="h-10 rounded-full border-slate-300 text-sm">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download IFU (PDF)
                </Button>
                <Button variant="outline" className="h-10 rounded-full border-slate-300 text-sm">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Declaration of Conformity
                </Button>
                <Button variant="outline" className="h-10 rounded-full border-slate-300 text-sm">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Surgical protocol
                </Button>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <h3 className="font-serif text-xl text-slate-900">Key highlights</h3>
                <ul className="mt-4 space-y-3">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </TabsContent>

        {/* Description */}
        <TabsContent value="description" className="mt-10">
          <div className="max-w-3xl">
            <p className="font-serif text-lg leading-relaxed text-slate-800">
              {product.description}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Clinical studies across 2,400 placements reported a 99.1% survival
              rate at 36 months (multi-center, peer-reviewed). The implant is
              indicated for immediate-load protocols in type I–III bone and for
              delayed loading in type IV bone with appropriate healing periods.
              Refer to the IFU for full indications, contraindications, and
              surgical protocol.
            </p>
          </div>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping" className="mt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ShippingCard
              title="Express worldwide"
              copy="DHL Express and FedEx Priority. Door-to-clinic delivery in 4–7 business days to 62 countries. Real-time tracking provided."
            />
            <ShippingCard
              title="Customs & duties"
              copy="DDP (Delivered Duty Paid) available for EU, UK, Australia, and select Middle East markets. All others shipped DAP with commercial invoice."
            />
            <ShippingCard
              title="Documentation"
              copy="Each shipment ships with: commercial invoice, packing list, certificate of origin, Declaration of Conformity, and lot traceability record."
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <TableRow className="border-slate-100 hover:bg-slate-50/60">
      <TableCell className="py-4 text-sm text-slate-600">{label}</TableCell>
      <TableCell className="py-4 text-sm font-medium text-slate-900">
        {value}
      </TableCell>
    </TableRow>
  );
}

function ShippingCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{copy}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Related products strip
// ---------------------------------------------------------------------------

function RelatedProducts() {
  const related = [
    { id: "ts-iv-sa", name: "TS-IV SA", tagline: "Tapered self-tapping", price: "$ 92.00" },
    { id: "bluediamond-bd", name: "BlueDiamond BD", tagline: "Soft-bone optimized", price: "$ 84.00" },
    { id: "superline-sl", name: "SuperLine SL", tagline: "Premium tapered", price: "$ 88.00" },
  ];

  return (
    <section className="border-t border-slate-200 bg-slate-50/50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Clinicians also viewed
            </div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-slate-900 lg:text-4xl">
              Pair with these.
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline sm:inline-flex"
          >
            Full catalog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                <svg
                  viewBox="0 0 120 180"
                  className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id={`rel-${p.id}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#CBD5E1" />
                      <stop offset="50%" stopColor="#F1F5F9" />
                      <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                  </defs>
                  <path d="M45 5 L75 5 L72 22 L48 22 Z" fill={`url(#rel-${p.id})`} stroke="#94A3B8" strokeWidth="0.4" />
                  <rect x="43" y="22" width="34" height="7" fill={`url(#rel-${p.id})`} stroke="#94A3B8" strokeWidth="0.4" />
                  <path d="M46 29 L46 155 L60 172 L74 155 L74 29 Z" fill={`url(#rel-${p.id})`} stroke="#94A3B8" strokeWidth="0.4" />
                  {Array.from({ length: 16 }).map((_, i) => (
                    <path key={i} d={`M46 ${36 + i * 7.5} L74 ${36 + i * 7.5 - 2}`} stroke="#64748B" strokeWidth="0.5" opacity="0.75" />
                  ))}
                </svg>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <div className="text-[15px] font-semibold tracking-tight text-slate-900">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500">{p.tagline}</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
