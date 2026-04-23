// ---------------------------------------------------------------------------
// Product catalog — single source of truth for all 6 Medistan SKUs
// ---------------------------------------------------------------------------

export interface BaseSpecs {
  material: string;
  storage?: string;
}

export interface BoneGraftSpecs extends BaseSpecs {
  specType: 'bone-graft';
  remodelingTime?: string;
  sterilization?: string;
  format?: string;
  density?: string;
  handling?: string;
  porosity?: string;
  resorption?: string;
  hydrophilicity?: string;
}

export interface MembraneSpecs extends BaseSpecs {
  specType: 'membrane';
  resorptionTime: string;
  handling: string;
  tearResistance?: string;
  memory?: string;
}

export type ProductSpecs = BoneGraftSpecs | MembraneSpecs;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'bone-graft' | 'membrane';
  subcategory: string;
  composition: string;
  tagline: string;
  description: string;
  specs: ProductSpecs;
  primaryUse: string[];
  sizes?: string[];
  packaging?: string[];
  image: string;
  relatedProducts: string[];
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ── Bone Graft Materials ─────────────────────────────────────────────────

  {
    id: 'renew-oss',
    slug: 'renew-oss',
    name: 'Renew Oss™',
    category: 'bone-graft',
    subcategory: 'Allograft · Particulate',
    composition: '80% Cortical / 20% Cancellous',
    tagline:
      'A premium allograft particulate designed for predictable bone regeneration. Combines structural integrity with rapid remodeling.',
    description:
      'Renew Oss™ is a premium mineralized human allograft particulate engineered for predictable guided bone regeneration. Its 80/20 cortical-to-cancellous ratio delivers optimal structural support during the critical early healing phase while the cancellous component accelerates revascularization and cellular infiltration. The 0.25–1.0 mm particulate size range provides excellent handling characteristics and adapts to irregular defect morphologies. Gamma irradiation sterilization ensures sterility without compromising the osteoinductive protein matrix.',
    specs: {
      specType: 'bone-graft',
      material: 'Mineralized Human Allograft',
      remodelingTime: '3–4 Months',
      sterilization: 'Gamma Irradiation',
      format: 'Particulate (0.25 mm – 1.0 mm)',
      storage: 'Room Temperature',
    },
    primaryUse: ['Socket preservation', 'Sinus augmentation', 'Ridge augmentation'],
    image: '/products/renew-oss.svg',
    relatedProducts: ['diaderm-m', 'titan-gide'],
  },

  {
    id: 'do-bone',
    slug: 'do-bone',
    name: 'Do Bone™',
    category: 'bone-graft',
    subcategory: 'Allograft · Syringe',
    composition: '70% Cortical / 30% Cancellous',
    tagline:
      "High-performance allograft in an ergonomic delivery syringe. The 'Golden Ratio' provides enhanced revascularization while maintaining volume.",
    description:
      'Do Bone™ combines the regenerative power of a 70/30 cortical-to-cancellous allograft with the precision of a pre-filled delivery syringe. The "Golden Ratio" formulation is specifically calibrated to maximize revascularization speed while maintaining sufficient cortical structure for volume stability. The ergonomic syringe format allows surgeons to deliver graft material exactly where needed, minimizing handling and contamination risk. Instant rehydration makes chair-side preparation effortless.',
    specs: {
      specType: 'bone-graft',
      material: 'Mineralized Human Allograft',
      remodelingTime: '4–6 Months',
      handling: 'Instant rehydration, precise placement',
      storage: 'Room Temperature',
    },
    primaryUse: [
      'Extraction sockets',
      'Implant dehiscence',
      'Minimally invasive GBR',
    ],
    packaging: ['Pre-filled Syringe', '0.25 cc', '0.5 cc', '1.0 cc', '2.0 cc'],
    image: '/products/do-bone.svg',
    relatedProducts: ['diaderm-m', 'titan-gide'],
  },

  {
    id: 'titan-bone',
    slug: 'titan-bone',
    name: 'Titan Bone™',
    category: 'bone-graft',
    subcategory: 'Allograft · High-Density',
    composition: '100% Cortical',
    tagline:
      'Maximum structural stability. Designed for cases where space maintenance and slow, steady remodeling are the priority.',
    description:
      'Titan Bone™ is engineered for the most demanding structural bone regeneration cases. At 100% mineralized cortical composition, it offers the highest density and compression resistance in the Medistan allograft range. This makes it the material of choice when space maintenance is paramount — particularly in horizontal ridge augmentation cases where collapsing membranes or soft tissue pressure may compromise healing. The slower 5–6 month remodeling timeline allows for complete bone integration before prosthetic loading.',
    specs: {
      specType: 'bone-graft',
      material: '100% Mineralized Cortical Bone',
      remodelingTime: '5–6 Months',
      density: 'High (Resists compression)',
      storage: 'Room Temperature',
    },
    primaryUse: ['Horizontal ridge augmentation', 'Large bony defects'],
    image: '/products/titan-bone.svg',
    relatedProducts: ['diaderm-m', 'titan-gide'],
  },

  {
    id: 'titan-x',
    slug: 'titan-x',
    name: 'Titan-X® / Titan-B™',
    category: 'bone-graft',
    subcategory: 'Xenograft · Bovine',
    composition: 'Bovine Cancellous',
    tagline:
      'Anorganic bovine bone mineral matrix. A permanent, osteoconductive scaffold for extreme volume stability and aesthetics.',
    description:
      'Titan-X®/Titan-B™ is an anorganic bovine bone mineral matrix processed to remove all organic components while preserving the native hydroxyapatite crystalline structure. The highly interconnected 70–80% porosity network facilitates rapid blood clot formation, cellular adhesion, and neovascularization. Its near-permanent scaffold properties make it uniquely suited for aesthetic zone cases where long-term volume maintenance is critical. The hydrophilic surface chemistry ensures instant blood uptake for optimal handling in the surgical field.',
    specs: {
      specType: 'bone-graft',
      material: 'Anorganic Bovine Mineral',
      porosity: '70%–80% Interconnected',
      resorption: 'Very Slow (Permanent Scaffold)',
      hydrophilicity: 'Excellent (Wicks blood instantly)',
      storage: 'Room Temperature',
    },
    primaryUse: [
      'Aesthetic zone augmentation',
      'Sinus lifts',
      'Long-term volume maintenance',
    ],
    image: '/products/titan-x.svg',
    relatedProducts: ['diaderm-m', 'titan-gide'],
  },

  // ── Membranes ─────────────────────────────────────────────────────────────

  {
    id: 'diaderm-m',
    slug: 'diaderm-m',
    name: 'Diaderm® M',
    category: 'membrane',
    subcategory: 'Collagen Membrane',
    composition: 'Atelocollagen',
    tagline:
      'Biodegradable barrier membrane. Highly biocompatible with low immunogenicity, designed for routine protection of graft sites.',
    description:
      'Diaderm® M is a Type I porcine atelocollagen membrane manufactured using a proprietary purification process that minimizes immunogenic epitopes. The result is a highly biocompatible barrier membrane with predictable 3–4 month resorption that aligns with the bone regeneration timeline. Its flexible, conformable structure adapts to complex three-dimensional defect geometries, and the high draping effect ensures intimate contact with adjacent tissues — essential for creating the protected space that allows bone regeneration to occur undisturbed.',
    specs: {
      specType: 'membrane',
      material: 'Type I Porcine Atelocollagen',
      resorptionTime: '3–4 Months',
      handling: 'Flexible, high draping effect',
      storage: 'Room Temperature',
    },
    primaryUse: ['Guided Bone Regeneration (GBR)', 'Guided Tissue Regeneration (GTR)'],
    sizes: ['15×20 mm', '15×30 mm', '20×30 mm'],
    image: '/products/diaderm-m.svg',
    relatedProducts: ['renew-oss', 'do-bone'],
  },

  {
    id: 'titan-gide',
    slug: 'titan-gide',
    name: 'Titan Gide®',
    category: 'membrane',
    subcategory: 'Pericardium Membrane',
    composition: 'Bovine Pericardium',
    tagline:
      'Premium long-term barrier. Naturally dense multi-directional fiber structure provides exceptional strength and longer protection.',
    description:
      'Titan Gide® leverages the natural multi-directional fiber architecture of bovine pericardium to deliver exceptional mechanical strength in a resorbable membrane. The dense collagen network resists tearing during suturing and membrane tacking, making it the preferred choice for large augmentations and complex GBR procedures where membrane stability is critical. Its extended 4–6 month barrier function — significantly longer than standard collagen membranes — provides protection throughout the entire critical healing phase. When hydrated, the membrane softens to zero-memory, draping naturally over the augmented site.',
    specs: {
      specType: 'membrane',
      material: 'Bovine Pericardium',
      resorptionTime: '4–6 Months (Extended Barrier)',
      handling: 'Zero-memory when hydrated',
      tearResistance: 'High (Suitable for suturing/tacking)',
      memory: 'Zero-memory when hydrated',
      storage: 'Room Temperature',
    },
    primaryUse: [
      'Large ridge augmentations',
      'Complex GBR',
      'Sinus floor protection',
    ],
    image: '/products/titan-gide.svg',
    relatedProducts: ['titan-x', 'titan-bone'],
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getProductsByCategory(
  category: Product['category']
): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProducts
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
}

// ---------------------------------------------------------------------------
// Type guard helpers for narrowing specs
// ---------------------------------------------------------------------------

export function isBoneGraftSpecs(specs: ProductSpecs): specs is BoneGraftSpecs {
  return specs.specType === 'bone-graft';
}

export function isMembraneSpecs(specs: ProductSpecs): specs is MembraneSpecs {
  return specs.specType === 'membrane';
}
