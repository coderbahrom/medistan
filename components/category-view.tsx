"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Filter,
  X,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isBoneGraftSpecs, isMembraneSpecs } from "@/data/products";
import { matchProduct, type FilterGroup } from "@/lib/product-filters";
import { fill } from "@/lib/catalog";

// ---------------------------------------------------------------------------
// Props — everything crossing the server boundary is plain data
// ---------------------------------------------------------------------------

/** Every user-visible string in this component, already localized. */
export interface CategoryViewCopy {
  filters: string;
  clearAll: string;
  clearFilters: string;
  noMatch: string;
  /** "{count} products" */
  productCount: string;
  /** "Show {count} results" */
  showResults: string;
  viewDetails: string;
  quoteAria: string;
  completeSetup: string;
  faqTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  /** "{time} remodeling" / "{time} resorption" */
  specLineRemodeling: string;
  specLineResorption: string;
  /** "Available in {sizes}" */
  availableIn: string;
}

interface CategoryViewProps {
  products: Product[];
  filterGroups: FilterGroup[];
  relatedTitle: string;
  relatedProducts: Product[];
  categoryWhatsApp: string;
  faqItems: { q: string; a: string }[];
  t: CategoryViewCopy;
  lang?: string;
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

function getSizeSummary(p: Product, t: CategoryViewCopy): string | null {
  if (p.dimensions?.length) return p.dimensions.join(" / ");
  if (p.volumes?.length) return fill(t.availableIn, { sizes: p.volumes.join(" / ") });
  return null;
}

function getSpecLine(p: Product, t: CategoryViewCopy): string {
  const s = p.specs;
  if (isBoneGraftSpecs(s)) {
    if (s.remodelingTime)
      return `${fill(t.specLineRemodeling, { time: s.remodelingTime })} · ${p.composition}`;
    if (s.resorption) return `${s.resorption} · ${p.composition}`;
    return p.composition;
  }
  if (isMembraneSpecs(s)) {
    return `${fill(t.specLineResorption, { time: s.resorptionTime })} · ${s.material.split(" ").pop() ?? s.material}`;
  }
  return p.composition;
}

// ---------------------------------------------------------------------------
// Filter panel — declared at module scope so its state is never reset by a
// parent re-render (react-hooks/static-components).
// ---------------------------------------------------------------------------

function FilterPanel({
  filterGroups,
  activeFilters,
  totalActive,
  onToggle,
  onClearAll,
  t,
}: {
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string[]>;
  totalActive: number;
  onToggle: (groupId: string, value: string) => void;
  onClearAll: () => void;
  t: CategoryViewCopy;
}) {
  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{t.filters}</h2>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
          >
            <X className="h-3 w-3" />
            {t.clearAll}
          </button>
        )}
      </div>
      {filterGroups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {group.label}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((opt) => {
              const active =
                activeFilters[group.id]?.includes(opt.value) ?? false;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onToggle(group.id, opt.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  )}
                >
                  {opt.label}
                  {opt.count !== undefined && ` (${opt.count})`}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CategoryView({
  products,
  filterGroups,
  relatedTitle,
  relatedProducts,
  categoryWhatsApp,
  faqItems,
  t,
  lang = "en",
}: CategoryViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeFilters = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const group of filterGroups) {
      const vals = searchParams.getAll(group.id);
      if (vals.length > 0) result[group.id] = vals;
    }
    return result;
  }, [searchParams, filterGroups]);

  // value → indication keys, for the grouped indication options
  const indicationMatches = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const group of filterGroups) {
      if (group.id !== "indication") continue;
      for (const opt of group.options) map[opt.value] = opt.matches ?? [opt.value];
    }
    return map;
  }, [filterGroups]);

  const totalActive = useMemo(
    () => Object.values(activeFilters).reduce((sum, v) => sum + v.length, 0),
    [activeFilters]
  );

  const toggleFilter = useCallback(
    (groupId: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(groupId);
      params.delete(groupId);
      if (current.includes(value)) {
        current
          .filter((v) => v !== value)
          .forEach((v) => params.append(groupId, v));
      } else {
        [...current, value].forEach((v) => params.append(groupId, v));
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const filtered = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return products;
    return products.filter((p) =>
      matchProduct(p, activeFilters, indicationMatches)
    );
  }, [products, activeFilters, indicationMatches]);

  return (
    <div>
      {/* Mobile filter trigger */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-slate-600">
          {fill(t.productCount, { count: filtered.length })}
        </p>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        >
          <Filter className="h-3.5 w-3.5" />
          {t.filters}
          {totalActive > 0 && (
            <span className="ms-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">{t.filters}</span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                aria-label={t.clearFilters}
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <FilterPanel
              filterGroups={filterGroups}
              activeFilters={activeFilters}
              totalActive={totalActive}
              onToggle={toggleFilter}
              onClearAll={clearAll}
              t={t}
            />
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-full bg-slate-900 text-white"
                )}
              >
                {fill(t.showResults, { count: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar + grid */}
      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterPanel
              filterGroups={filterGroups}
              activeFilters={activeFilters}
              totalActive={totalActive}
              onToggle={toggleFilter}
              onClearAll={clearAll}
              t={t}
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-12 text-center">
              <p className="font-serif text-xl italic text-slate-500">{t.noMatch}</p>
              <button
                type="button"
                onClick={clearAll}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-4 rounded-full"
                )}
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="relative aspect-video overflow-hidden bg-linear-to-b from-slate-50 to-white">
                    <Image
                      src={p.image}
                      alt={`${p.name} — ${p.subcategory}`}
                      fill
                      className="object-contain p-6"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3">
                      <Badge
                        className={cn(
                          "mb-2 rounded-full border-0 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                          p.category === "bone-graft"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-sky-50 text-sky-700"
                        )}
                      >
                        {p.subcategory.split("·")[0].trim()}
                      </Badge>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {getSpecLine(p, t)}
                      </p>
                    </div>
                    <p className="mb-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {p.tagline}
                    </p>
                    {getSizeSummary(p, t) && (
                      <p className="mb-3 text-[11px] font-medium text-slate-500">
                        {getSizeSummary(p, t)}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${lang}/products/${p.slug}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-9 flex-1 justify-center rounded-full border-slate-300 text-xs font-medium text-slate-900 hover:bg-slate-900 hover:text-white"
                        )}
                      >
                        {t.viewDetails}
                        <ArrowRight className="ms-1.5 h-3 w-3" />
                      </Link>
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "821044959591"}?text=${encodeURIComponent(`Hello Medistan, I'd like a wholesale quote for ${p.name}. Expected quantity: [fill in]. My clinic and country: [fill in].`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={fill(t.quoteAria, { product: p.name })}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "h-9 rounded-full bg-[#25D366] px-3 text-white hover:bg-[#22c55e]"
                        )}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommended accessories */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
              <div className="mb-6">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  — {t.completeSetup}
                </div>
                <h2 className="font-serif text-2xl font-normal text-slate-900">
                  {relatedTitle}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/${lang}/products/${rp.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md hover:shadow-slate-200/50"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-slate-50 to-slate-100">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{rp.name}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">
                        {getSpecLine(rp, t)}
                      </div>
                    </div>
                    <ArrowRight className="ms-auto h-4 w-4 shrink-0 text-slate-400 rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">
                {t.faqTitle}
              </h2>
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                {faqItems.map((item, i) => (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-6 py-5 text-start"
                    >
                      <span className="pe-4 text-sm font-semibold text-slate-900">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-slate-500 transition-transform",
                          openFaq === i && "rotate-180"
                        )}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl bg-slate-950 p-8 text-center text-white">
            <h2 className="font-serif text-2xl font-normal">{t.ctaTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{t.ctaSubtitle}</p>
            <a
              href={categoryWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 inline-flex h-12 rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100"
              )}
            >
              <MessageCircle className="me-2 h-4 w-4" />
              {t.ctaButton}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
