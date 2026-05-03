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

// ---------------------------------------------------------------------------
// Filter types — no functions, fully serializable
// ---------------------------------------------------------------------------

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface CategoryViewProps {
  products: Product[];
  filterGroups: FilterGroup[];
  relatedTitle: string;
  relatedProducts: Product[];
  categoryWhatsApp: string;
  faqItems: { q: string; a: string }[];
  lang?: string;
}

// ---------------------------------------------------------------------------
// Matching — all logic lives here in the client bundle
// ---------------------------------------------------------------------------

function matchProduct(
  product: Product,
  activeFilters: Record<string, string[]>
): boolean {
  for (const [id, selected] of Object.entries(activeFilters)) {
    if (selected.length === 0) continue;
    let hit = false;

    switch (id) {
      case "type":
        hit = selected.some((v) =>
          product.subcategory.toLowerCase().includes(v.toLowerCase())
        );
        break;
      case "format":
        hit = selected.some((v) => {
          const sub = product.subcategory.toLowerCase();
          if (v === "high-density")
            return sub.includes("high-density") || sub.includes("high density");
          if (v === "bovine")
            return sub.includes("bovine") || sub.includes("xenograft");
          return sub.includes(v.toLowerCase());
        });
        break;
      case "remodeling":
        if (!isBoneGraftSpecs(product.specs)) { hit = false; break; }
        {
          const time = product.specs.remodelingTime ?? "";
          const resorption = product.specs.resorption ?? "";
          hit = selected.some((v) => {
            if (v === "permanent")
              return (
                resorption.toLowerCase().includes("permanent") ||
                resorption.toLowerCase().includes("slow")
              );
            return (
              time.includes(v.replace("-", "–")) || time.includes(v)
            );
          });
        }
        break;
      case "indication":
        hit = selected.some((v) =>
          product.primaryUse.some((u) =>
            u.toLowerCase().includes(v.toLowerCase())
          )
        );
        break;
      case "composition":
        hit = selected.some((v) =>
          product.composition.toLowerCase().includes(v.toLowerCase())
        );
        break;
      case "material":
        hit = selected.some((v) =>
          product.subcategory.toLowerCase().includes(v.toLowerCase())
        );
        break;
      case "resorption":
        if (!isMembraneSpecs(product.specs)) { hit = false; break; }
        {
          const t = product.specs.resorptionTime;
          hit = selected.some(
            (v) => t.includes(v.replace("-", "–")) || t.includes(v)
          );
        }
        break;
      case "origin":
        if (!isMembraneSpecs(product.specs)) { hit = false; break; }
        {
          const mat = product.specs.material.toLowerCase();
          const comp = product.composition.toLowerCase();
          hit = selected.some((v) => mat.includes(v) || comp.includes(v));
        }
        break;
      case "size":
        hit = !product.dimensions?.length
          ? false
          : selected.some((v) =>
              product.dimensions!.some((d) => d.includes(v))
            );
        break;
      case "volume":
        hit = !product.volumes?.length
          ? false
          : selected.some((v) => product.volumes!.includes(v));
        break;
      case "weight":
        hit = !product.volumes?.length
          ? false
          : selected.some((v) => product.volumes!.includes(v));
        break;
      case "particleRange": {
        const ps = product.particleSize;
        if (!ps) { hit = false; break; }
        const sizes = Array.isArray(ps) ? ps : [ps];
        hit = selected.some((range) => {
          if (range === "<0.5mm")
            return sizes.some((s) => {
              const lo = parseFloat(s.split("–")[0].trim());
              return lo < 0.5;
            });
          if (range === "0.5-1.0mm")
            return sizes.some((s) => {
              const lo = parseFloat(s.split("–")[0].trim());
              const hi = parseFloat(s.split("–")[1]?.trim() ?? "0");
              return (lo >= 0.5 && lo <= 1.0) || (hi >= 0.5 && hi <= 1.0);
            });
          if (range === "1.0-2.0mm")
            return sizes.some((s) => {
              const hi = parseFloat(s.split("–")[1]?.trim() ?? "0");
              return hi >= 1.0;
            });
          return false;
        });
        break;
      }
      default:
        hit = true;
    }

    if (!hit) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Size summary helper — compact one-liner for category cards
// ---------------------------------------------------------------------------

function getSizeSummary(p: Product): string | null {
  if (p.dimensions?.length) return p.dimensions.join(" / ");
  if (p.volumes?.length) return `Available in ${p.volumes.join(" / ")}`;
  return null;
}

// ---------------------------------------------------------------------------
// Spec line helper
// ---------------------------------------------------------------------------

function getSpecLine(p: Product): string {
  const s = p.specs;
  if (isBoneGraftSpecs(s)) {
    if (s.remodelingTime) return `${s.remodelingTime} remodeling · ${p.composition}`;
    if (s.resorption) return `${s.resorption} · ${p.composition}`;
    return p.composition;
  }
  if (isMembraneSpecs(s)) {
    return `${s.resorptionTime} resorption · ${s.material.split(" ").pop() ?? s.material}`;
  }
  return p.composition;
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
    return products.filter((p) => matchProduct(p, activeFilters));
  }, [products, activeFilters]);

  const FilterPanel = () => (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
          >
            <X className="h-3 w-3" />
            Clear all
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
                  onClick={() => toggleFilter(group.id, opt.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );

  return (
    <div>
      {/* Mobile filter trigger */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-slate-600">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {totalActive > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
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
              <span className="text-base font-semibold text-slate-900">Filters</span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <FilterPanel />
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-full bg-slate-900 text-white"
                )}
              >
                Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
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
            <FilterPanel />
          </div>
        </div>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-12 text-center">
              <p className="font-serif text-xl italic text-slate-500">
                No products match the selected filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-4 rounded-full"
                )}
              >
                Clear filters
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
                      <p className="mt-0.5 text-xs text-slate-500">{getSpecLine(p)}</p>
                    </div>
                    <p className="mb-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {p.tagline}
                    </p>
                    {getSizeSummary(p) && (
                      <p className="mb-3 text-[11px] font-medium text-slate-500">
                        {getSizeSummary(p)}
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
                        View details
                        <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "821044959591"}?text=${encodeURIComponent(`Hello Medistan, I'd like a wholesale quote for ${p.name}. Expected quantity: [fill in]. My clinic and country: [fill in].`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Request quote for ${p.name} on WhatsApp`}
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
                  — Complete your setup
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
                        {getSpecLine(rp)}
                      </div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-serif text-2xl font-normal text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
                {faqItems.map((item, i) => (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                    >
                      <span className="pr-4 text-sm font-semibold text-slate-900">
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
            <h2 className="font-serif text-2xl font-normal">
              Ready to request pricing?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Get a wholesale quote within 24 hours.
            </p>
            <a
              href={categoryWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 inline-flex h-12 rounded-full bg-white px-7 text-[15px] text-slate-900 hover:bg-slate-100"
              )}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Request Quote on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
