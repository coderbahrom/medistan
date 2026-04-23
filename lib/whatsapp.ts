const WA_NUMBER =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "821044959591")
    : "821044959591";

function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const waMsg = {
  floating: waUrl(
    "Hello Medistan, I'd like to learn more about your dental regenerative materials."
  ),
  homepageQuote: waUrl(
    "Hello Medistan, I'd like to request a wholesale quote. My clinic/business: [fill in]. Country: [fill in]. Products of interest: Bone grafts / Membranes / Both."
  ),
  productCard: (name: string) =>
    waUrl(
      `Hello Medistan, I'd like a wholesale quote for ${name}. Expected quantity: [fill in]. My clinic and country: [fill in].`
    ),
  productDetail: (name: string, category: string) =>
    waUrl(
      `Hello Medistan, I'd like to inquire about ${name} (${category}). Quantity: [fill in]. Clinic/Country: [fill in]. Any specific size/packaging requirements: [fill in].`
    ),
  boneGraftCategory: waUrl(
    "Hello Medistan, I'd like pricing for your Bone Graft Materials. My clinic and country: [fill in]."
  ),
  membraneCategory: waUrl(
    "Hello Medistan, I'd like pricing for your Membranes. My clinic and country: [fill in]."
  ),
};
