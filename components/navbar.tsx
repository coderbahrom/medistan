"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { waMsg } from "@/lib/whatsapp";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
] as const;

type NavT = {
  products: string;
  technology: string;
  about: string;
  contact: string;
  signIn: string;
  requestQuote: string;
  boneGraftMaterials: string;
  membranes: string;
  viewAllBoneGrafts: string;
  viewAllMembranes: string;
  viewAllProducts: string;
};

const boneGrafts = [
  { name: "Renew Oss™", slug: "renew-oss", spec: "Allograft particulate · 3–4 mo" },
  { name: "Do Bone™", slug: "do-bone", spec: "Allograft syringe · 4–6 mo" },
  { name: "Bone Us Allo", slug: "bone-us-allo", spec: "Allograft particulate · Balanced 70/30" },
  { name: "Titan Bone™", slug: "titan-bone", spec: "High-density cortical · 5–6 mo" },
  { name: "Titan-X® / Titan-B™", slug: "titan-x", spec: "Bovine xenograft · Permanent scaffold" },
];

const membranes = [
  { name: "Diaderm® M", slug: "diaderm-m", spec: "Collagen membrane · 3–4 mo" },
  { name: "Titan Gide®", slug: "titan-gide", spec: "Pericardium membrane · 4–6 mo" },
];

export function Navbar({ lang, t }: { lang: string; t: NavT }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProdOpen, setMobileProdOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const closeLang = useCallback(() => setLangOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) closeDropdown();
      if (langRef.current && !langRef.current.contains(e.target as Node)) closeLang();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDropdown, closeLang]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeDropdown(); closeLang(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeDropdown, closeLang]);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  function switchLocale(newLang: string) {
    // Replace /[lang] segment at start of pathname
    const withoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    router.push(`/${newLang}${withoutLang === "/" ? "" : withoutLang}`);
  }

  const currentLocaleLabel = LOCALES.find((l) => l.code === lang)?.label ?? lang.toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900">
            <div className="h-3.5 w-3.5 rounded-xs bg-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">Medistan</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Dental · Seoul</span>
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
                if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); setDropdownOpen(true); }
              }}
              className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              {t.products}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", dropdownOpen && "rotate-180")} />
            </button>

            {dropdownOpen && (
              <div role="menu" aria-label="Products menu" className="absolute left-1/2 top-full z-50 w-140 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  <div className="p-5">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.boneGraftMaterials}</div>
                    <ul role="none" className="space-y-1">
                      {boneGrafts.map((p) => (
                        <li key={p.slug} role="none">
                          <Link href={`/${lang}/products/${p.slug}`} role="menuitem" className="flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none">
                            <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                            <span className="mt-0.5 text-[11px] text-slate-500">{p.spec}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Link href={`/${lang}/products/bone-graft-material`} role="menuitem" className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:underline">
                        {t.viewAllBoneGrafts} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.membranes}</div>
                    <ul role="none" className="space-y-1">
                      {membranes.map((p) => (
                        <li key={p.slug} role="none">
                          <Link href={`/${lang}/products/${p.slug}`} role="menuitem" className="flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none">
                            <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                            <span className="mt-0.5 text-[11px] text-slate-500">{p.spec}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Link href={`/${lang}/products/membrane`} role="menuitem" className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:underline">
                        {t.viewAllMembranes} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <Link href={`/${lang}/products`} role="menuitem" className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-900 hover:underline">
                    {t.viewAllProducts} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href={`/${lang}/#technology`} className="text-sm text-slate-600 transition-colors hover:text-slate-900">{t.technology}</Link>
          <Link href={`/${lang}/#about`} className="text-sm text-slate-600 transition-colors hover:text-slate-900">{t.about}</Link>
          <Link href={`/${lang}/#contact`} className="text-sm text-slate-600 transition-colors hover:text-slate-900">{t.contact}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-label="Switch language"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-9 gap-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900")}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden text-xs font-medium uppercase lg:inline">{lang}</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { switchLocale(l.code); setLangOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50",
                      l.code === lang ? "font-semibold text-slate-900" : "text-slate-600"
                    )}
                  >
                    <span className="w-6 text-[10px] font-bold uppercase text-slate-400">{l.code}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={`/${lang}/#contact`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden h-9 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex")}
          >
            {t.signIn}
          </a>
          <a
            href={waMsg.homepageQuote}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "hidden h-9 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 md:inline-flex")}
          >
            {t.requestQuote}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="divide-y divide-slate-100 px-6 py-2">
            <div>
              <button
                type="button"
                aria-expanded={mobileProdOpen}
                onClick={() => setMobileProdOpen((v) => !v)}
                className="flex w-full items-center justify-between py-3 text-sm font-medium text-slate-900"
              >
                {t.products}
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", mobileProdOpen && "rotate-180")} />
              </button>
              {mobileProdOpen && (
                <div className="pb-3 pl-3">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{t.boneGraftMaterials}</div>
                  {boneGrafts.map((p) => (
                    <Link key={p.slug} href={`/${lang}/products/${p.slug}`} className="flex flex-col py-2">
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                      <span className="text-[11px] text-slate-500">{p.spec}</span>
                    </Link>
                  ))}
                  <Link href={`/${lang}/products/bone-graft-material`} className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900">
                    {t.viewAllBoneGrafts} <ArrowRight className="h-3 w-3" />
                  </Link>

                  <div className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{t.membranes}</div>
                  {membranes.map((p) => (
                    <Link key={p.slug} href={`/${lang}/products/${p.slug}`} className="flex flex-col py-2">
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                      <span className="text-[11px] text-slate-500">{p.spec}</span>
                    </Link>
                  ))}
                  <Link href={`/${lang}/products/membrane`} className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900">
                    {t.viewAllMembranes} <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link href={`/${lang}/products`} className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-900 underline underline-offset-2">
                    {t.viewAllProducts} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {[
              { label: t.technology, href: `/${lang}/#technology` },
              { label: t.about, href: `/${lang}/#about` },
              { label: t.contact, href: `/${lang}/#contact` },
            ].map((item) => (
              <a key={item.label} href={item.href} className="flex items-center py-3 text-sm font-medium text-slate-900">
                {item.label}
              </a>
            ))}

            {/* Mobile language switcher */}
            <div className="py-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Language</div>
              <div className="flex flex-wrap gap-2">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      l.code === lang
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-3">
              <a
                href={waMsg.homepageQuote}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "w-full justify-center rounded-full bg-slate-900 text-white")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.requestQuote}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
