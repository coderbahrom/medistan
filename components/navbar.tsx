"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { waMsg } from "@/lib/whatsapp";

const boneGrafts = [
  { name: "Renew Oss™", slug: "renew-oss", spec: "Allograft particulate · 3–4 mo" },
  { name: "Do Bone™", slug: "do-bone", spec: "Allograft syringe · 4–6 mo" },
  { name: "Titan Bone™", slug: "titan-bone", spec: "High-density cortical · 5–6 mo" },
  { name: "Titan-X® / Titan-B™", slug: "titan-x", spec: "Bovine xenograft · Permanent scaffold" },
];

const membranes = [
  { name: "Diaderm® M", slug: "diaderm-m", spec: "Collagen membrane · 3–4 mo" },
  { name: "Titan Gide®", slug: "titan-gide", spec: "Pericardium membrane · 4–6 mo" },
];

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDropdown]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeDropdown]);

  // Close everything on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900">
            <div className="h-3.5 w-3.5 rounded-xs bg-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              Medistan
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Dental · Seoul
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {/* Products dropdown */}
          <div
            ref={dropdownRef}
            className="relative pb-2"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "Enter") {
                  e.preventDefault();
                  setDropdownOpen(true);
                }
              }}
              className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Products
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-150",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Mega menu */}
            {dropdownOpen && (
              <div
                role="menu"
                aria-label="Products menu"
                className="absolute left-1/2 top-full z-50 w-140 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
              >
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  {/* Column 1: Bone Grafts */}
                  <div className="p-5">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Bone Graft Materials
                    </div>
                    <ul role="none" className="space-y-1">
                      {boneGrafts.map((p) => (
                        <li key={p.slug} role="none">
                          <Link
                            href={`/products/${p.slug}`}
                            role="menuitem"
                            className="flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                          >
                            <span className="text-sm font-semibold text-slate-900">
                              {p.name}
                            </span>
                            <span className="mt-0.5 text-[11px] text-slate-500">
                              {p.spec}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Link
                        href="/products/bone-graft-material"
                        role="menuitem"
                        className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:underline"
                      >
                        View all bone grafts
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: Membranes */}
                  <div className="p-5">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Membranes
                    </div>
                    <ul role="none" className="space-y-1">
                      {membranes.map((p) => (
                        <li key={p.slug} role="none">
                          <Link
                            href={`/products/${p.slug}`}
                            role="menuitem"
                            className="flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                          >
                            <span className="text-sm font-semibold text-slate-900">
                              {p.name}
                            </span>
                            <span className="mt-0.5 text-[11px] text-slate-500">
                              {p.spec}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Link
                        href="/products/membrane"
                        role="menuitem"
                        className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:underline"
                      >
                        View all membranes
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom full-width link */}
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <Link
                    href="/products"
                    role="menuitem"
                    className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-900 hover:underline"
                  >
                    View all products
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/#technology"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            Technology
          </Link>
          <Link
            href="/#about"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/#contact"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden h-9 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
            )}
          >
            Sign in
          </a>
          <a
            href={waMsg.homepageQuote}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden h-9 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 md:inline-flex"
            )}
          >
            Request Quote
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "md:hidden"
            )}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="divide-y divide-slate-100 px-6 py-2">
            {/* Products accordion */}
            <div>
              <button
                type="button"
                aria-expanded={mobileProdOpen}
                onClick={() => setMobileProdOpen((v) => !v)}
                className="flex w-full items-center justify-between py-3 text-sm font-medium text-slate-900"
              >
                Products
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 transition-transform",
                    mobileProdOpen && "rotate-180"
                  )}
                />
              </button>
              {mobileProdOpen && (
                <div className="pb-3 pl-3">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Bone Graft Materials
                  </div>
                  {boneGrafts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="flex flex-col py-2"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{p.spec}</span>
                    </Link>
                  ))}
                  <Link
                    href="/products/bone-graft-material"
                    className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    View all bone grafts <ArrowRight className="h-3 w-3" />
                  </Link>

                  <div className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Membranes
                  </div>
                  {membranes.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="flex flex-col py-2"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{p.spec}</span>
                    </Link>
                  ))}
                  <Link
                    href="/products/membrane"
                    className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    View all membranes <ArrowRight className="h-3 w-3" />
                  </Link>

                  <Link
                    href="/products"
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-900 underline underline-offset-2"
                  >
                    View all products <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {[
              { label: "Technology", href: "/#technology" },
              { label: "About", href: "/#about" },
              { label: "Contact", href: "/#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center py-3 text-sm font-medium text-slate-900"
              >
                {item.label}
              </a>
            ))}

            <div className="py-3">
              <a
                href={waMsg.homepageQuote}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "w-full justify-center rounded-full bg-slate-900 text-white"
                )}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Request Quote
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
