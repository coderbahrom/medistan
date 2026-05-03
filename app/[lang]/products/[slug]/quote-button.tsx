"use client";

import { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface ProductQuoteButtonProps {
  productName: string;
  categoryLabel: string;
  sizeOptions: string[];
  waNumber: string;
  label: string;
  className?: string;
}

export function ProductQuoteButton({
  productName,
  categoryLabel,
  sizeOptions,
  waNumber,
  label,
  className,
}: ProductQuoteButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const sizeText = selectedSize ? `Size: ${selectedSize}. ` : "Size: [fill in]. ";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello Medistan, I'd like to inquire about ${productName} (${categoryLabel}). ${sizeText}Quantity: [fill in]. Clinic/Country: [fill in].`
  )}`;

  return (
    <div className="flex flex-1 flex-col gap-2">
      {sizeOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                selectedSize === size
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      )}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-12 rounded-full bg-slate-900 px-6 text-[15px] text-white hover:bg-slate-800",
          className
        )}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        {label}
        {className?.includes("bg-white") && <ArrowRight className="ml-2 h-4 w-4" />}
      </a>
    </div>
  );
}
