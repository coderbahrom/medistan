// ---------------------------------------------------------------------------
// Catalog filtering — matches on language-neutral facets only, never on
// translated prose. Shared by the server pages (which build the filter groups
// and their counts) and the client CategoryView (which applies them).
// ---------------------------------------------------------------------------

import type { Product } from "@/data/products";

/** Which facet a filter group matches on. */
export type FilterId =
  | "type"
  | "format"
  | "remodeling"
  | "resorption"
  | "indication"
  | "composition"
  | "material"
  | "origin"
  | "size"
  | "volume"
  | "weight"
  | "particleRange";

export interface FilterOption {
  /** Facet key (or, for `indication`, a grouping key resolved via `matches`). */
  value: string;
  label: string;
  /** Indication keys this option covers. Defaults to `[value]`. */
  matches?: string[];
  /** Products in this category matching the option — rendered as "(4)". */
  count?: number;
}

export interface FilterGroup {
  id: FilterId;
  label: string;
  options: FilterOption[];
}

/** Lower/upper bound of a "0.5 – 1.2 mm" style range. */
function parseRange(range: string): [number, number] {
  const [lo, hi] = range.split("–").map((part) => parseFloat(part.trim()));
  return [lo, Number.isNaN(hi) ? lo : hi];
}

function matchesParticleRange(product: Product, bucket: string): boolean {
  const ps = product.particleSize;
  if (!ps) return false;
  return (Array.isArray(ps) ? ps : [ps]).some((size) => {
    const [lo, hi] = parseRange(size);
    if (bucket === "lt-05") return lo < 0.5;
    if (bucket === "05-10") return hi >= 0.5 && lo <= 1.0;
    if (bucket === "10-20") return hi >= 1.0;
    return false;
  });
}

export function matchProduct(
  product: Product,
  activeFilters: Record<string, string[]>,
  indicationMatches: Record<string, string[]> = {}
): boolean {
  const f = product.facets;

  for (const [id, selected] of Object.entries(activeFilters)) {
    if (selected.length === 0) continue;
    let hit = false;

    switch (id as FilterId) {
      case "type":
        hit = selected.includes(f.type ?? "");
        break;
      case "format":
        hit = selected.includes(f.format ?? "");
        break;
      case "remodeling":
      case "resorption":
        hit = selected.includes(f.duration ?? "");
        break;
      case "indication":
        hit = selected.some((value) =>
          (indicationMatches[value] ?? [value]).some((key) =>
            (f.indications as string[]).includes(key)
          )
        );
        break;
      case "composition":
        hit = selected.includes(f.composition ?? "");
        break;
      case "material":
        hit = selected.includes(f.membraneMaterial ?? "");
        break;
      case "origin":
        hit = selected.includes(f.origin);
        break;
      case "size":
        hit = selected.some((v) => product.dimensions?.includes(v) ?? false);
        break;
      case "volume":
      case "weight":
        hit = selected.some((v) => product.volumes?.includes(v) ?? false);
        break;
      case "particleRange":
        hit = selected.some((bucket) => matchesParticleRange(product, bucket));
        break;
      default:
        hit = true;
    }

    if (!hit) return false;
  }
  return true;
}

/**
 * How many products an option matches — computed from the catalog so the "(4)"
 * suffixes can never go stale.
 */
export function countMatches(
  products: Product[],
  groupId: FilterId,
  option: FilterOption
): number {
  const matches = { [option.value]: option.matches ?? [option.value] };
  return products.filter((p) =>
    matchProduct(p, { [groupId]: [option.value] }, matches)
  ).length;
}

/** Attach live counts to every option of every group. */
export function withCounts(
  products: Product[],
  groups: FilterGroup[]
): FilterGroup[] {
  return groups.map((group) => ({
    ...group,
    options: group.options.map((option) => ({
      ...option,
      count: countMatches(products, group.id, option),
    })),
  }));
}
