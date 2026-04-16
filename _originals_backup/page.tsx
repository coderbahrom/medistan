import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  Headphones,
  BadgeDollarSign,
  MessageCircle,
  Menu,
  Quote,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Data (kept inline for a single-file demo; extract to /lib in production)
// ---------------------------------------------------------------------------

const navItems = [
  { label: "Products", href: "/products" },
  { label: "Technology", href: "/technology" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    copy: "K-FDA, CE, and US-FDA cleared. Every lot traceable to origin, tested against ISO 13485 standards.",
  },
  {
    icon: Globe2,
    title: "Global Logistics",
    copy: "DHL & FedEx express partnerships shipping to 60+ countries. Average door-to-clinic in 4–7 days.",
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

const featuredProducts = [
  {
    id: "is-iii-active",
    name: "IS-III active",
    tagline: "SLA-treated active implant",
    diameter: "Ø 3.5 – 5.0 mm",
    length: "7 – 13 mm",
    connection: "Internal Hex",
    price: "$ 78.00",
    badge: "Bestseller",
  },
  {
    id: "ts-iv-sa",
    name: "TS-IV SA",
    tagline: "Tapered self-tapping",
    diameter: "Ø 4.0 – 5.5 mm",
    length: "8.5 – 13 mm",
    connection: "Internal Conical",
    price: "$ 92.00",
    badge: "New",
  },
  {
    id: "bluediamond-bd",
    name: "BlueDiamond BD",
    tagline: "Soft-bone optimized",
    diameter: "Ø 3.8 – 5.0 mm",
    length: "7 – 11.5 mm",
    connection: "Internal Hex",
    price: "$ 84.00",
    badge: null,
  },
  {
    id: "superline-sl",
    name: "SuperLine SL",
    tagline: "Premium tapered",
    diameter: "Ø 3.6 – 6.0 mm",
    length: "7 – 14 mm",
    connection: "Internal Octa",
    price: "$ 88.00",
    badge: "Featured",
  },
];

const testimonials = [
  {
    quote:
      "Switched our practice entirely to Korean implants last year. The osseointegration timeline is consistently faster than what we saw with European brands — and at two-thirds the cost.",
    name: "Dr. Marco Beltrán",
    role: "Implantologist",
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
      "The documentation and traceability is immaculate. Every implant's lot, surface treatment, and QC record is accessible. It's the kind of paper trail our regulators appreciate.",
    name: "Dr. Jonas Weiß",
    role: "Clinic Director",
    location: "Zurich, Switzerland",
  },
];

const stats = [
  { value: "5,000+", label: "Dentists served" },
  { value: "62", label: "Countries shipped" },
  { value: "18 yrs", label: "Manufacturing" },
  { value: "99.2%", label: "Success rate" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <Header />
      <Hero />
      <StatsStrip />
      <TrustFeatures />
      <FeaturedProducts />
      <Testimonials />
      <FinalCta />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        {/* Logo */}
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

        {/* Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-9 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="hidden h-9 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 md:inline-flex"
          >
            Request Quote
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-white">
      {/* Decorative grid */}
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
            K-FDA · CE · US-FDA cleared
          </div>

          <h1 className="font-serif text-[2.5rem] font-normal leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.5rem]">
            Premium Korean
            <br />
            dental implants.
            <br />
            <span className="italic text-slate-500">
              Direct to your clinic,
            </span>{" "}
            <span className="italic text-slate-500">worldwide.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Eighteen years of precision manufacturing in Seoul. Factory-direct
            wholesale for dentists, clinics, and distributors in 62 countries —
            with clinical support that answers when you call.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full bg-slate-900 px-7 text-[15px] text-white shadow-sm hover:bg-slate-800"
            >
              Explore Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-slate-300 bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-50"
            >
              Download Price List
            </Button>
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
          <ImplantVisual />
        </div>
      </div>
    </section>
  );
}

// Minimalist SVG representation of a premium dental implant — no external image dependency.
function ImplantVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Background halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-50 via-slate-50 to-white" />
      <div className="absolute inset-8 rounded-full border border-slate-200/80" />
      <div className="absolute inset-16 rounded-full border border-slate-200/60" />

      {/* Measurement ticks */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        <div>Ø 4.5mm</div>
        <div className="h-px w-8 bg-slate-300" />
        <div>L 11.5mm</div>
      </div>
      <div className="absolute right-6 top-12 text-right text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        <div>Grade 4</div>
        <div className="ml-auto mt-1 h-px w-8 bg-slate-300" />
        <div className="mt-1">Ti — SLA</div>
      </div>

      {/* Implant SVG */}
      <svg
        viewBox="0 0 200 360"
        className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="ti-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="45%" stopColor="#F1F5F9" />
            <stop offset="55%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="ti-abut" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Abutment */}
        <path
          d="M75 10 L125 10 L120 45 L80 45 Z"
          fill="url(#ti-abut)"
          stroke="#94A3B8"
          strokeWidth="0.5"
        />
        {/* Platform */}
        <rect
          x="72"
          y="45"
          width="56"
          height="12"
          fill="url(#ti-body)"
          stroke="#94A3B8"
          strokeWidth="0.5"
        />
        {/* Threaded body */}
        <path
          d="M78 57
             L78 310
             L100 340
             L122 310
             L122 57 Z"
          fill="url(#ti-body)"
          stroke="#94A3B8"
          strokeWidth="0.5"
        />
        {/* Thread lines */}
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={i}
            d={`M78 ${70 + i * 11} L122 ${70 + i * 11 - 4}`}
            stroke="#64748B"
            strokeWidth="0.6"
            opacity={i > 18 ? 0.5 : 0.85}
          />
        ))}
        {/* Apex */}
        <circle cx="100" cy="342" r="1.5" fill="#475569" />
      </svg>

      {/* Floating badges */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        Lot 24-A8291
      </div>
      <div className="absolute bottom-6 right-6 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        Made in Seoul
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
    <section className="border-b border-slate-200/80 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Why dentists choose us
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Manufacturing discipline,
              <br />
              <span className="italic text-slate-500">without the middlemen.</span>
            </h2>
          </div>
          <Link
            href="/about"
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
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              — Featured catalog
            </div>
            <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Built for every bone density.
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-900 underline-offset-4 hover:underline sm:inline-flex"
          >
            View all 48 products
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
                  {p.badge && (
                    <Badge className="absolute left-4 top-4 z-10 rounded-full border-0 bg-slate-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white hover:bg-slate-900">
                      {p.badge}
                    </Badge>
                  )}
                  <MiniImplantGraphic />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-5">
                <div>
                  <CardTitle className="text-[17px] font-semibold tracking-tight text-slate-900">
                    {p.name}
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs text-slate-500">
                    {p.tagline}
                  </CardDescription>
                </div>

                <dl className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <dt>Diameter</dt>
                    <dd className="font-medium text-slate-900">{p.diameter}</dd>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <dt>Length</dt>
                    <dd className="font-medium text-slate-900">{p.length}</dd>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <dt>Connection</dt>
                    <dd className="font-medium text-slate-900">{p.connection}</dd>
                  </div>
                </dl>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-slate-100 p-5">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">
                    From
                  </div>
                  <div className="text-[15px] font-semibold tracking-tight text-slate-900">
                    {p.price}
                  </div>
                </div>
                <Link href={`/products/${p.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-full border-slate-300 bg-white text-xs font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
                  >
                    View Details
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniImplantGraphic() {
  return (
    <svg
      viewBox="0 0 120 180"
      className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="mini-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path
        d="M45 5 L75 5 L72 22 L48 22 Z"
        fill="url(#mini-body)"
        stroke="#94A3B8"
        strokeWidth="0.4"
      />
      <rect
        x="43"
        y="22"
        width="34"
        height="7"
        fill="url(#mini-body)"
        stroke="#94A3B8"
        strokeWidth="0.4"
      />
      <path
        d="M46 29 L46 155 L60 172 L74 155 L74 29 Z"
        fill="url(#mini-body)"
        stroke="#94A3B8"
        strokeWidth="0.4"
      />
      {Array.from({ length: 16 }).map((_, i) => (
        <path
          key={i}
          d={`M46 ${36 + i * 7.5} L74 ${36 + i * 7.5 - 2}`}
          stroke="#64748B"
          strokeWidth="0.5"
          opacity="0.75"
        />
      ))}
    </svg>
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
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {t.name
                    .split(" ")
                    .slice(-1)[0]
                    .charAt(0)}
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
// Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
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
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100 lg:w-auto"
            >
              Request Custom Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-slate-700 bg-transparent px-7 text-[15px] text-white hover:bg-slate-900 hover:text-white lg:w-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </Button>
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
        <div className="flex flex-col items-start justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-900">
              <div className="h-3 w-3 rounded-[2px] bg-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              SEOHA Dental
            </span>
            <span className="text-xs text-slate-500">
              · Seoul, Republic of Korea
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>ISO 13485:2016</span>
            <span>·</span>
            <span>K-FDA Licensed</span>
            <span>·</span>
            <span>CE 2797</span>
            <span>·</span>
            <span>US-FDA 510(k)</span>
          </div>
          <div className="text-xs text-slate-500">
            © 2026 SEOHA Medical Co., Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// WhatsApp floating button
// ---------------------------------------------------------------------------

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/821012345678"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
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
