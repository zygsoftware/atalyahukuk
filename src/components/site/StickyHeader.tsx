"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-cream/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-cream/80",
        scrolled
          ? "border-bordo-100 shadow-[0_4px_20px_-8px_rgba(35,10,11,0.25)]"
          : "border-transparent shadow-none",
      )}
    >
      {children}
    </header>
  );
}
