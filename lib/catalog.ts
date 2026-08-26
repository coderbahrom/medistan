// ---------------------------------------------------------------------------
// Catalog localization
//
// `data/products.ts` holds the English copy (canonical + fallback) and the
// language-neutral facets. Translated copy lives in `dictionaries/*.json` under
// `catalog` / `indications`, keyed by product slug and indication key.
// ---------------------------------------------------------------------------

import type { Product, ProductSpecs } from "@/data/products";

export interface ProductCopy {
  subcategory?: string;
  composition?: string;
  tagline?: string;
  description?: string;
  /** Partial spec overrides, keyed exactly like the English `specs` object. */
  specs?: Record<string, string>;
}

export interface IndicationCopy {
  label: string;
  detail: string;
}

/**
 * Overlay a locale's copy onto a product. Any field the locale is missing keeps
 * its English value, so a partial translation degrades field by field rather
 * than dropping the page into English wholesale.
 */
export function localizeProduct(product: Product, catalog: unknown): Product {
  const copy = (catalog as Record<string, ProductCopy | undefined> | undefined)?.[
    product.slug
  ];
  if (!copy) return product;

  return {
    ...product,
    subcategory: copy.subcategory ?? product.subcategory,
    composition: copy.composition ?? product.composition,
    tagline: copy.tagline ?? product.tagline,
    description: copy.description ?? product.description,
    specs: { ...product.specs, ...(copy.specs ?? {}) } as ProductSpecs,
  };
}

export function localizeProducts(products: Product[], catalog: unknown): Product[] {
  return products.map((p) => localizeProduct(p, catalog));
}

function indicationCopy(key: string, indications: unknown): IndicationCopy | undefined {
  return (indications as Record<string, IndicationCopy | undefined> | undefined)?.[key];
}

/** Short label for an indication key, e.g. "Socket preservation". */
export function indicationLabel(key: string, indications: unknown): string {
  return indicationCopy(key, indications)?.label ?? key;
}

/** Long-form clinical paragraph for an indication key. */
export function indicationDetail(key: string, indications: unknown): string {
  const copy = indicationCopy(key, indications);
  return copy?.detail ?? copy?.label ?? key;
}

/** Replace {placeholders} in a dictionary template. */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}
